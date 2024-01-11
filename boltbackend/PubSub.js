import express from 'express';
import {PubSub} from '@google-cloud/pubsub';
import * as db from './Database/db.js'
import * as richCard from './Agents/richCard.js'

import rbmPrivateKey from './Agents/rbm-credentials.json' assert {type: 'json'};
import rbmApiHelper from '@google/rcsbusinessmessaging'
import cors from "cors";

const app = express();
const port = 7777;

// the name of the Pub/Sub pull subscription,
const subscriptionName = 'projects/rbm-test-vgw4szq/subscriptions/rbm-agent-subscription';

// initialize Pub/Sub for pull subscription listener
// this is how this agent will receive messages from the client
rbmApiHelper.initRbmApi(rbmPrivateKey);
initPubSub();

app.use(
    cors({
        origin: "http://localhost:4200",
    })
);
app.use(express.json());


/**
 * Sends a survey to the user, expected to have suggested responses
 */
app.post('/startSurvey', async function (req, res, next) {
    try {
        let surveyIdMap = req.body

        for (const [phoneNumber, surveyId] of Object.entries(surveyIdMap)) {
            let survey = await db.getSurvey(surveyId)

            const params = {
                messageText: survey.openingText,
                msisdn: phoneNumber
            };

            // 1. First this sends a message via params
            // 2. The callback function is then called (the 2nd parameter) after sendMessage is complete
            await rbmApiHelper.sendMessage(params,
                function (response, err) {

                    if (response != null) {
                        sendSurveyQuestion(phoneNumber, survey.questions[0])
                    }

                    if (err != null) {
                        console.log("There is something wrong with the message you are trying to send")
                    }
                });
        }

        res.status(200).json({message: "hooray"})
    } catch (error) {
        res.status(500).json({message: "An error has occurred"})
    }
});

/**
 * Sends a review to phone numbers (expects a review to have suggested responses, see ReviewTemplate.ts)
 */
app.post('/startReview', async (req, res) => {

    try {
        let reviewIdMap = req.body

        // Value is the reviewId, key is the phoneNumber
        for (const [phoneNumber, reviewId] of Object.entries(reviewIdMap)) {
            let review = await db.getReview(reviewId);
            richCard.sendReviewTemplate(review, phoneNumber);
        }

        res.status(200).json({message: "hooray"})
    } catch (ex) {
        res.status(500).json({message: "An error has occurred"});
    }
});

/**
 * Parses a survey question and sends it as an RCS message
 * @param msisdn - The phone number to send to
 * @param question - The question to send (see SurveyTemplate.ts)
 * @returns {Promise<unknown>}
 */
function sendSurveyQuestion(msisdn, question) {
    let suggestions = [];
    for (let i = 0; i < question.answers.length; ++i) {
        suggestions.push({
            reply: {
                text: question.answers[i],
                postbackData: "SURVEY_ANSWER_" + i,
            },
        })
    }

    const messageText = question.question;

    const params = {
        messageText: messageText,
        msisdn: msisdn,
        suggestions: suggestions,
    };

    return new Promise(function (resolve, reject) {
        rbmApiHelper.sendMessage(params,
            function (response) {
                if (response != null) {
                    resolve();
                } else {
                    reject(response);
                }
            });
    });
}

/**
 * Handles a message response to a survey
 * @param msisdn - the phone number that sent the response
 * @param message - the message text the phone number sent
 * @returns {Promise<void>}
 */
async function handleSurveyMessage(msisdn, message) {
    let survey = await db.getLatestSent(msisdn)

    if (msisdn !== survey.phoneNumber) return null;

    // Save the answer to the question
    const unansweredQuestion = survey.questions.find(question => !question.hasResponded);

    if (unansweredQuestion) {
        unansweredQuestion.hasResponded = true;
        unansweredQuestion.response = message;
        // Update the survey in the database to have the most recent answer
        db.updateConversation(survey).catch(console.dir)

    }

    const allQuestionsAnswered = survey.questions.every(question => question.hasResponded);

    if (!allQuestionsAnswered) {
        const unansweredQuestion = survey.questions.find(question => !question.hasResponded);
        sendSurveyQuestion(msisdn, unansweredQuestion).catch(console.dir);
    } else {
        const params = {
            messageText: survey.closingText,
            msisdn: msisdn,
        };

        await rbmApiHelper.sendMessage(params, null);

        // Updates recipient so that when a message is sent after a conversation is finished nothing will be saved or happen
        let recipient = await db.getRecipient(msisdn);
        recipient.lastSent = null;

        await db.updateRecipient(recipient);
    }

}

/**
 * Handles a message response to a review
 * @param msisdn - The phone number that is responding
 * @param message - The response that is received
 * @returns {Promise<void>}
 */
async function handleReviewMessage(msisdn, message) {
    let review = await db.getLatestSent(msisdn)

    review.hasResponded = true
    review.response = message

    db.updateConversation(review).catch(console.dir)
}

/**
 * Uses the event received by the pull subscription to send a
 * response to the client's device.
 * @param {object} userEvent The JSON object of a message received by the pull subscription.
 * Grabs the most recent conversation of that phoneNumber and saves the response
 */
async function handleMessage(userEvent) {
    const msisdn = userEvent.senderPhoneNumber

    if (msisdn !== undefined) {

        // parse the response text
        const message = getMessageBody(userEvent);

        // send a read receipt
        rbmApiHelper.sendReadMessage(msisdn, userEvent.messageId, null);

        // check to see that we have a message to process
        if (message) {

            // TODO: Doesn't unsubscribe right now but at least sends the message
            if (message === "STOP") {
                await handleUnsubscribeMessage(message, msisdn)
                return;
            }

            let conversation = await db.getLatestSent(msisdn)

            if (conversation == null) {
                return;
            }

            switch (conversation.templateType) {
                case "Survey":
                    await handleSurveyMessage(msisdn, message)
                    break;

                case "Review":
                    await handleReviewMessage(msisdn, message)
                    break;

                default:
                    console.log("Something went wrong because it should either be Survey or Review")
            }
        }
    }
}

/**
 * Parses the userEvent object to get the response body.
 * This can be plaintext or part of a suggested response.
 * @param {object} userEvent The JSON object of a message
 * received by the pull subscription.
 * @return {string, boolean} The body of the message, false if not found.
 */
function getMessageBody(userEvent) {
    if (userEvent.text !== undefined) {
        return userEvent.text;
    } else if (userEvent.suggestionResponse !== undefined) {
        return userEvent.suggestionResponse.text;
    }

    return false;
}

async function handleUnsubscribeMessage(message, phoneNumber) {

    const params = {
        messageText: "You have successfully unsubscribed, no more messages will be sent to you",
        msisdn: phoneNumber
    };

    await rbmApiHelper.sendMessage(params, null)
}

/**
 * Initializes a pull subscription message handler
 * to receive messages from Pub/Sub.
 */
function initPubSub() {

    const pubsub = new PubSub({
        projectId: rbmPrivateKey.project_id,
        keyFilename: './Agents/rbm-credentials.json',
    });

    // references an existing subscription
    const subscription = pubsub.subscription(subscriptionName);

    // create an event handler to handle messages
    const messageHandler = (message) => {
        // console.log(`Received message ${message.id}:`);
        // console.log(`\tData: ${message.data}`);
        // console.log(`\tAttributes: ${message.attributes}`);

        const userEvent = JSON.parse(message.data);

        handleMessage(userEvent).catch(console.dir);

        // "Ack" (acknowledge receipt of) the message
        message.ack();
    };

    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);

    console.log('initPubSub done');
}

app.listen(port, () => {
    console.log("listening on port " + port)
})

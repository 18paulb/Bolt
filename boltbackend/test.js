import express from 'express';
import {PubSub} from '@google-cloud/pubsub';
import * as db from './Database/db.js'

import rbmPrivatekey from './Agents/rbm-credentials.json' assert {type: 'json'};
import rbmApiHelper from '@google/rcsbusinessmessaging'
import cors from "cors";

const app = express();
const port = 7777;

// the name of the Pub/Sub pull subscription,
// replace with your subscription name
const subscriptionName = 'projects/rbm-test-vgw4szq/subscriptions/rbm-agent-subscription';
// initialize Pub/Sub for pull subscription listener
// this is how this agent will receive messages from the client
rbmApiHelper.initRbmApi(rbmPrivatekey);
initPubsub();

app.use(
    cors({
        origin: "http://localhost:4200", // Angular server
    })
);
app.use(express.json());


/**
 * Sends the user information about the product they purchased.
 */
app.post('/startConversation', async function (req, res, next) {
    const msisdn = req.body.phoneNumber;
    let surveyId = req.body.surveyId
    // let questions = req.body.questions

    const messageText = 'Thanks for agreeing to participate in a survey, to opt out, please respond STOP';

    let survey = await db.getSurvey(surveyId)

    const params = {
        messageText: messageText,
        msisdn: msisdn,
    };

    // remind the user about the item they purchased
    // 1. First this sends a message via params
    // 2. The callback function is then called (the 2nd parameter) after sendMessage is complete
    await rbmApiHelper.sendMessage(params,
        function (response, err) {
            // create a reference to send a product rating prompt
            // const productRatingRequest = sendProductRatingPrompt(msisdn, survey.questions[0]);
            const productRatingRequest = sendProductRatingPrompt(msisdn, survey.questions[0])
    });

    return res.json({'message': "hooray"})
});


function sendProductRatingPrompt(msisdn, question) {
    let suggestions = [];
    for (let i = 0; i < question.answers.length; ++i) {
        suggestions.push({
            reply: {
                text: question.answers[i],
                postbackData: "ANSWER_" + i,
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
 * Uses the event received by the pull subscription to send a
 * response to the client's device.
 * @param {object} userEvent The JSON object of a message
 * received by the pull subscription.
 */

//TODO: This needs to be able to account for different message types (ie Survey vs Review)

async function handleMessage(userEvent) {
    // get the sender's phone number
    const msisdn = userEvent.senderPhoneNumber

    if (msisdn !== undefined) {

        // parse the response text
        const message = getMessageBody(userEvent);

        // get the message id
        const messageId = userEvent.messageId;

        // check to see that we have a message to process
        if (message) {

            let survey = await db.getSurveyByPhoneNumber(msisdn)

            // send a read receipt
            rbmApiHelper.sendReadMessage(msisdn, messageId);

            // Save the answer to the question
            for (let i = 0; i < survey.questions.length; ++i) {
                if (!survey.questions[i].hasResponded) {
                    survey.questions[i].hasResponded = true;
                    survey.questions[i].response = message
                    break;
                }
            }

            // Update the survey in the database to have the most recent answer
            db.updateSurvey(survey, survey._id.toString()).catch(console.dir)

            // Go to the next question in the survey and send that
            let allQuestionsAnswered = true;
            if (msisdn === survey.phoneNumber) {
                for (let i = 0; i < survey.questions.length; ++i) {
                    console.log(survey.questions[i]);
                    if (!survey.questions[i].hasResponded) {
                        allQuestionsAnswered = false;
                        sendProductRatingPrompt(msisdn, survey.questions[i]).then(r => console.log(r))
                        break;
                    }
                }
            }

            if (allQuestionsAnswered) {
                const params = {
                    messageText: "Thank you for completing the survey!",
                    msisdn: msisdn,
                };
                await rbmApiHelper.sendMessage(params,
                    function (response, err) {
                        console.log("Survey is done")
                    });
            }
        }
    }
}

/**
 * Parses the userEvent object to get the response body.
 * This can be plaintext or part of a suggested response.
 * @param {object} userEvent The JSON object of a message
 * received by the pull subscription.
 * @return {string} The body of the message, false if not found.
 */
function getMessageBody(userEvent) {
    if (userEvent.text != undefined) {
        return userEvent.text;
    } else if (userEvent.suggestionResponse != undefined) {
        return userEvent.suggestionResponse.text;
    }

    return false;
}

/**
 * Initializes a pull subscription message handler
 * to receive messages from Pub/Sub.
 */
function initPubsub() {

    const pubsub = new PubSub({
        projectId: rbmPrivatekey.project_id,
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

    console.log('initPubsub done');
}


app.listen(port, () => {
    console.log("listening on port " + port)
})

import express from 'express';
// const {PubSub} = require('@google-cloud/pubsub');
import {PubSub} from '@google-cloud/pubsub';
import * as db from './Database/db.js'

import rbmPrivatekey from './Agents/rbm-credentials.json' assert {type: 'json'};
import rbmApiHelper from '@google/rcsbusinessmessaging'

const app = express();
const port = 7777;

// the name of the Pub/Sub pull subscription,
// replace with your subscription name
const subscriptionName = 'projects/rbm-test-vgw4szq/subscriptions/rbm-agent-subscription';

rbmApiHelper.initRbmApi(rbmPrivatekey);

// initialize Pub/Sub for pull subscription listener
// this is how this agent will receive messages from the client

let survey = {
    phoneNumber: '+13853353799',
    questions: [
        {
            question: "Do you like cats?",
            answers: ["yes", "no"],
            hasResponded: false,
            response: null
        },
        {
            question: "Do you like dogs?",
            answers: ["yes", "no"],
            hasResponded: false,
            response: null
        },
        {
            question: "Do you like me?",
            answers: ["yes", "no"],
            hasResponded: false,
            response: null
        }
    ]

}

initPubsub();

/**
 * Sends the user information about the product they purchased.
 */
app.get('/startConversation', function (req, res, next) {
    const msisdn = req.query.phone_number;
    const messageText = 'We are giving you a survey, please respond';

    const params = {
        messageText: messageText,
        msisdn: msisdn,
    };

    // remind the user about the item they purchased
    rbmApiHelper.sendMessage(params,
        function (response, err) {
            // create a reference to send a product rating prompt
            const productRatingRequest = sendProductRatingPrompt(msisdn, survey.questions[0]);
        });

    db.saveSurvey(survey).then(res => console.log("Successfully saved survey"));
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
function handleMessage(userEvent) {
    if (userEvent.senderPhoneNumber != undefined) {
        // get the sender's phone number
        const msisdn = userEvent.senderPhoneNumber;

        // parse the response text
        const message = getMessageBody(userEvent);

        // get the message id
        const messageId = userEvent.messageId;

        // check to see that we have a message to process
        if (message) {
            // send a read receipt
            rbmApiHelper.sendReadMessage(msisdn, messageId);

            // Save to the question
            for (let i = 0; i < survey.questions.length; ++i) {
                if (!survey.questions[i].hasResponded) {
                    survey.questions[i].hasResponded = true;
                    survey.questions[i].response = message
                    break;
                }
            }

            if (msisdn === survey.phoneNumber) {
                for (let i = 0; i < survey.questions.length; ++i) {
                    console.log(survey.questions[i]);
                    if (!survey.questions[i].hasResponded) {
                        sendProductRatingPrompt(msisdn, survey.questions[i]).then(r => console.log(r))
                        break;
                    }
                }
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
    console.log('initPubsub');

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

        handleMessage(userEvent);

        // "Ack" (acknowledge receipt of) the message
        message.ack();
    };

    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);

    console.log('initPubsub done');
}


app.listen(port, () => {
    console.log("listening on port")
})

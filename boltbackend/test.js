
import express from 'express';
import cors from 'cors'

const app = express();
const port = 7777;

// const {PubSub} = require('@google-cloud/pubsub');
import {PubSub} from '@google-cloud/pubsub';

// location of service account credentials file
// const rbmPrivateKeyFile = './Agents/rbm-credentials.json'
// service account credentials for Pub/Sub
// const rbmPrivatekey = require(rbmPrivateKeyFile);

import rbmPrivatekey from './Agents/rbm-credentials.json' assert { type: 'json' };

// the name of the Pub/Sub pull subscription,
// replace with your subscription name
const subscriptionName = 'projects/rbm-test-vgw4szq/subscriptions/rbm-agent-subscription';

// reference to RBM API helper
// const rbmApiHelper = require('@google/rcsbusinessmessaging');
import rbmApiHelper from '@google/rcsbusinessmessaging'

rbmApiHelper.initRbmApi(rbmPrivatekey);

// initialize Pub/Sub for pull subscription listener
// this is how this agent will receive messages from the client
initPubsub();

// define postback results from product review ratings
const RATING_OF_1 = 'rating_of_1';
const RATING_OF_2 = 'rating_of_2';
const RATING_OF_3 = 'rating_of_3';
const RATING_OF_4 = 'rating_of_4';
const RATING_OF_5 = 'rating_of_5';

const IGNORE_RATING = 'ignore';

/**
 * Sends the user information about the product they purchased.
 */
app.get('/startConversation', function(req, res, next) {
    const msisdn = req.query.phone_number;
    const messageText = 'You recently purchased the Dual Pine Canopy ' +
        'Reclaimed Wood Coffee Table. We would really love your ' +
        'feedback.\n\nNot interested? No problem, type STOP and ' +
        'we will not message you again.';

    const params = {
        messageText: messageText,
        msisdn: msisdn,
    };

    // remind the user about the item they purchased
    rbmApiHelper.sendMessage(params,
        function(response, err) {
            // create a reference to send a picture of the image
            const productImageRequest = sendProductImage(msisdn);

            // create a reference to send a product rating prompt
            const productRatingRequest = sendProductRatingPrompt(msisdn);

            // send the user the product review messages
            productImageRequest.then((result) => {
                productRatingRequest.then((ratingResult) => {
                    res.json({'result': 'ok'});
                });
            });
        });
});

/**
 * Sends the client a prompt to give a start rating for
 * a coffee table they recently purchased.
 * @param {string} msisdn The phone number in E.164 format.
 * @return {Promise} A promise for execution of the RBM api call.
 */
function sendProductRatingPrompt(msisdn) {
    // define a list of suggested replies
    const suggestions = [
        {
            reply: {
                text: '😡',
                postbackData: RATING_OF_1,
            },
        },
        {
            reply: {
                text: '😞',
                postbackData: RATING_OF_2,
            },
        },
        {
            reply: {
                text: '😐',
                postbackData: RATING_OF_3,
            },
        },
        {
            reply: {
                text: '😊',
                postbackData: RATING_OF_4,
            },
        },
        {
            reply: {
                text: '😃',
                postbackData: RATING_OF_5,
            },
        },
        {
            reply: {
                text: 'Not Interested',
                postbackData: IGNORE_RATING,
            },
        },
    ];

    const messageText = 'Please rate your new coffee table with an ' +
        'emoji below and we\'ll send you $20 in rewards!';

    const params = {
        messageText: messageText,
        msisdn: msisdn,
        suggestions: suggestions,
    };

    return new Promise(function(resolve, reject) {
        rbmApiHelper.sendMessage(params,
            function(response) {
                if (response != null) {
                    resolve();
                } else {
                    reject(response);
                }
            });
    });
}

/**
 * Sends the client an image of the product they purchased.
 * @param {string} msisdn The phone number in E.164 format.
 * @return {Promise} A promise for execution of the RBM api call.
 */
function sendProductImage(msisdn) {
    // URL to an image of the product that was purchased
    const furnitureImageUrl = 'https://storage.googleapis.com/ggs-furniture-emporium.appspot.com/furniture_table.jpg';

    const params = {
        imageUrl: furnitureImageUrl,
        msisdn: msisdn,
    };

    // send a rich card with an image of the product
    return new Promise(function(resolve, reject) {
        try {
            rbmApiHelper.sendRichCard(params,
                function(response) {
                    if (response != null) {
                        resolve();
                    } else {
                        reject(response);
                    }
                });
        } catch (e) {
            console.log(e);
        }
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

        console.log('Sender number: ', msisdn);

        // check to see that we have a message to process
        if (message) {
            // send a read receipt
            rbmApiHelper.sendReadMessage(msisdn, messageId);

        } else {
            console.log('unhandled message');
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
        return userEvent.suggestionResponse.postbackData;
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
        console.log(`Received message ${message.id}:`);
        console.log(`\tData: ${message.data}`);
        console.log(`\tAttributes: ${message.attributes}`);

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

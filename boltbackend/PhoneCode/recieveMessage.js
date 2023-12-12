// TODO: Implement receiving message security
// https://developers.google.com/business-communications/rcs-business-messaging/guides/integrate/pubsub
exports.handler = async (event) => {

    let requestBody = JSON.parse(event.body)

    if (requestBody.message !== undefined && requestBody.message.data !== undefined) {
        // Validate the received hash to ensure the message came from Google RBM
        let userEventString = Buffer.from(requestBody.message.data, 'base64');
        // if (headerHash === genHash) {
        let userEvent = JSON.parse(userEventString);
        console.log('User Event: ', userEvent)

        // Respond with a success message or relevant data
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Success' })
        };
    }

    // If the request doesn't have the required properties
    return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid request' })
    };
};


export class ReviewTemplateModel {
    imageUrl
    messageText
    messageDescription
    suggestedResponses
    ownerId

    constructor(imageUrl, messageText, messageDescription, suggestedResponse, ownerId) {
        this.imageUrl = imageUrl;
        this.messageText = messageText;
        this.messageDescription = messageDescription;
        this.suggestedResponses = suggestedResponse;
        this.ownerId = ownerId;
    }
}

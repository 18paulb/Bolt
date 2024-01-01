export class ReviewModel {
    imageUrl
    messageText
    messageDescription
    suggestedResponses
    phoneNumber
    date
    hasResponded
    response
    _id


    constructor(imageUrl, messageText, messageDescription, suggestedResponses, phoneNumber, date) {
        this.imageUrl = imageUrl;
        this.messageText = messageText;
        this.messageDescription = messageDescription;
        this.suggestedResponses = suggestedResponses;
        this.phoneNumber = phoneNumber;
        this.date = date;
    }
}

export class SurveyModel {
    _id
    phoneNumber
    questions
    openingText
    closingText
    // Date will be Epoch time in milliseconds
    date

    constructor(phoneNumber, questions, openingText, closingText, date) {
        this.phoneNumber = phoneNumber;
        this.questions = questions;
        this.openingText = openingText;
        this.closingText = closingText;
        this.date = date
    }
}

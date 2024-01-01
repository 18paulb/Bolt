export class SurveyModel {
    _id
    phoneNumber
    questions
    // Date will be Epoch time in milliseconds
    date

    constructor(phoneNumber, questions, date) {
        this.phoneNumber = phoneNumber;
        this.questions = questions;
        this.date = date
    }
}

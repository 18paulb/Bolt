export class SurveyModel {
    _id
    phoneNumber
    questions

    constructor(phoneNumber, questions) {
        this.phoneNumber = phoneNumber;
        this.questions = questions;
    }
}

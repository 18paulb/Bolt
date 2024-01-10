export class SurveyTemplateModel {
    questions
    ownerId
    openingText

    constructor(questions, openingText, ownerId) {
        this.questions = questions;
        this.openingText = openingText;
        this.ownerId = ownerId
    }
}

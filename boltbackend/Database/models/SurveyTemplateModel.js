export class SurveyTemplateModel {
    questions
    ownerId
    openingText
    closingText

    constructor(questions, openingText, closingText, ownerId) {
        this.questions = questions;
        this.openingText = openingText;
        this.closingText = closingText;
        this.ownerId = ownerId;
    }
}

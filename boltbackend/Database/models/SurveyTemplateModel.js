export class SurveyTemplateModel {
    questions
    ownerId

    constructor(questions, ownerId) {
        this.questions = questions;
        this.ownerId = ownerId
    }
}

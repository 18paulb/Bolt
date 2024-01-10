import {Template} from "./Template";

export class SurveyTemplate extends Template {
    openingText:string
    questions:Question[]


    constructor(questions: Question[], openingText:string, objectId:string) {
        super(objectId)
        this.openingText = openingText;
        this.questions = questions;
    }
}

export class Question {
    question: string
    answers: string[]

    constructor(question: string, answers: string[]) {
        this.question = question;
        this.answers = answers;
    }
}

import {Template} from "./Template";

export class SurveyTemplate extends Template {
    questions:Question[]


    constructor(questions: Question[], objectId:string) {
        super(objectId)
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

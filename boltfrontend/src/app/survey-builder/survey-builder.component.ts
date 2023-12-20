import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-survey-builder',
  templateUrl: './survey-builder.component.html',
  styleUrls: ['./survey-builder.component.css']
})
export class SurveyBuilderComponent {

  constructor(private http:HttpClient) {
  }

  questions:Question[] = []

  currQuestion:string = ""

  suggestedAnswers:string[] = []

  newResponse:string = ""

  addQuestion() {
    let newQuestion:Question = new Question(this.currQuestion, this.suggestedAnswers)
    this.questions.push(newQuestion)

    this.suggestedAnswers = []
    this.currQuestion = ""

  }

  async saveTemplate() {
    let survey:Survey = new Survey(this.questions)

    // const surveyJson = JSON.stringify(survey);

    await lastValueFrom(this.http.post("http://localhost:3000/surveyTemplate", survey))

    this.questions = []
  }

  addUserResponse() {
    this.suggestedAnswers.push(this.newResponse);
    this.newResponse = ""
  }

  removeUserResponse(index: number) {
    this.suggestedAnswers.splice(index, 1);
  }

}


class Survey {
  questions:Question[]


  constructor(questions: Question[]) {
    this.questions = questions;
  }
}

class Question {
  question: string
  answers: string[]

  constructor(question: string, answers: string[]) {
    this.question = question;
    this.answers = answers;
  }
}

import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {lastValueFrom} from "rxjs";
import {SurveyTemplate, Question} from "../../../../shared/models/SurveyTemplate"


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

  openingText:string = ""

  closingText:string = ""

  addQuestion() {
    let newQuestion:Question = new Question(this.currQuestion, this.suggestedAnswers)
    this.questions.push(newQuestion)

    this.suggestedAnswers = []
    this.currQuestion = ""
  }

  async saveTemplate() {

    debugger

    let survey:SurveyTemplate = new SurveyTemplate(this.questions, this.openingText, this.closingText, "")

    await lastValueFrom(this.http.post("http://localhost:3000/surveyTemplate", survey))

    this.questions = []
    this.suggestedAnswers = []
    this.openingText = ""
    this.closingText = ""
    this.newResponse = ""
  }

  addUserResponse() {
    this.suggestedAnswers.push(this.newResponse);
    this.newResponse = ""
  }

  removeUserResponse(index: number) {
    this.suggestedAnswers.splice(index, 1);
  }

}




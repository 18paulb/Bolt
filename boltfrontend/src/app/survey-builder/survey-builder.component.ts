import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {lastValueFrom} from "rxjs";
import {Question, SurveyTemplate} from "../../../../shared/models/SurveyTemplate"


@Component({
  selector: 'app-survey-builder',
  templateUrl: './survey-builder.component.html',
  styleUrls: ['./survey-builder.component.css']
})
export class SurveyBuilderComponent {

  constructor(private http: HttpClient) {
  }

  questions: Question[] = []

  currQuestion: string = ""

  suggestedResponses: string[] = []

  newResponse: string = ""

  openingText: string = ""

  closingText: string = ""

  addQuestion() {
    let newQuestion: Question = new Question(this.currQuestion, this.suggestedResponses)
    this.questions.push(newQuestion)

    this.suggestedResponses = []
    this.currQuestion = ""
  }

  async saveTemplate() {

    let survey: SurveyTemplate = new SurveyTemplate(this.questions, this.openingText, this.closingText, "")

    await lastValueFrom(this.http.post("http://localhost:3000/surveyTemplate", survey))

    this.questions = []
    this.suggestedResponses = []
    this.openingText = ""
    this.closingText = ""
    this.newResponse = ""
  }

  addUserResponse() {
    if (this.suggestedResponses.length >= 11) return;

    if (this.newResponse.length == 0) return;

    this.suggestedResponses.push(this.newResponse);
    this.newResponse = ""
  }

  removeUserResponse(index: number) {
    this.suggestedResponses.splice(index, 1);
  }

}




import {Component, OnInit} from '@angular/core';
import {last, lastValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ReviewTemplate} from "../../../../shared/models/ReviewTemplate";
import {SurveyTemplate} from "../../../../shared/models/SurveyTemplate";

@Component({
  selector: 'app-template-browser',
  templateUrl: './template-browser.component.html',
  styleUrls: ['./template-browser.component.css']
})
export class TemplateBrowserComponent implements OnInit {

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getReviewTemplates().catch(console.dir);
  }

  reviewTemplates: ReviewTemplate[] = []
  surveyTemplates: SurveyTemplate[] = []

  async getReviewTemplates() {

    // Wipe out the templates
    this.reviewTemplates = []

    let results: any = await lastValueFrom(this.http.get("http://localhost:3000/getReviewTemplates/" + "brandon"))
    console.log(results)
    for (let i = 0; i < results.length; ++i) {
      let result = results[i]

      if (result.templateType === "Review") {
        this.reviewTemplates.push(new ReviewTemplate(result["imageUrl"], result["messageText"], result["messageDescription"], result["suggestedResponses"], result["objectId"]))
      }

      if (result.templateType === "Survey") {
        debugger
        this.surveyTemplates.push(new SurveyTemplate(result["questions"]))
      }
    }
  }

  async sendReviewTemplate(template: ReviewTemplate) {

    let body: any = {
      "phoneNumber": "+13853353799",
      "review": template
    }

    let res: any = await lastValueFrom(this.http.post("http://localhost:3000/saveSentReview", body))

    body = {
      "phoneNumber": "+13853353799",
      "reviewId": res.id
    }

    await lastValueFrom(this.http.post("http://localhost:7777/startReview/", body))
  }

  async deleteReviewTemplate(template: ReviewTemplate) {
    await lastValueFrom(this.http.delete("http://localhost:3000/deleteTemplate/" + template.objectId));
    this.getReviewTemplates().catch(console.dir)
  }

  async sendSurveyTemplate(template: SurveyTemplate) {

    let body: any = {
      "phoneNumber": "+13853353799",
      "questions": template.questions
    }

    // First save the survey in the database as a new sent survey
    let res: any = await lastValueFrom(this.http.post("http://localhost:3000/saveSentSurvey/", body))

    body = {
      "phoneNumber": "+13853353799",
      "surveyId": res.id
    }

    // This will be going to the 7777 port because that contains the code for the pubsub service
    await lastValueFrom(this.http.post("http://localhost:7777/startSurvey/", body))
  }
}

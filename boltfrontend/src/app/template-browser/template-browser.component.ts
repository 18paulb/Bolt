import {Component, OnInit} from '@angular/core';
import {lastValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ReviewTemplate} from "../../../../shared/models/ReviewTemplate";
import {SurveyTemplate} from "../../../../shared/models/SurveyTemplate";
import {Template} from "../../../../shared/models/Template";

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

  // This list will need to have been sanitized before reaching this point
  // Sanitization includes
  // 1. Checking to see if the User has unsubscribed from texts using STOP (or some other method)
  // 2. If the user even allows to receive marketing text messages
  phoneNumbers: string[] = ["+13853353799"]

  async getReviewTemplates() {

    // Wipe out the templates
    this.reviewTemplates = []
    this.surveyTemplates = []

    let results: any = await lastValueFrom(this.http.get("http://localhost:3000/getTemplates/" + "brandon"))
    console.log(results)
    for (let i = 0; i < results.length; ++i) {
      let result = results[i]

      if (result.templateType === "Review") {
        this.reviewTemplates.push(new ReviewTemplate(result.imageUrl, result.messageText, result.messageDescription, result.suggestedResponses, result.id))
      }

      if (result.templateType === "Survey") {
        this.surveyTemplates.push(new SurveyTemplate(result.questions, result.openingText, result.closingText, result.id))
      }
    }
  }

  async sendReviewTemplate(template: ReviewTemplate) {

    let compatiblePhoneNumbers = await this.checkCompatibility(this.phoneNumbers);

    let body: any = {
      "phoneNumbers": compatiblePhoneNumbers,
      "review": template
    }

    let res: any = await lastValueFrom(this.http.post("http://localhost:3000/saveSentReview", body))

    // res contains the key/value pairs of phoneNumbers to reviewIds that we send to the startReviewEndpoint
    await lastValueFrom(this.http.post("http://localhost:7777/startReview/", res))
  }

  async deleteTemplate(template: Template) {
    await lastValueFrom(this.http.delete("http://localhost:3000/deleteTemplate/" + template.objectId));
    this.getReviewTemplates().catch(console.dir)
  }

  async sendSurveyTemplate(template: SurveyTemplate) {

    let compatiblePhoneNumbers = await this.checkCompatibility(this.phoneNumbers);

    let body: any = {
      "phoneNumbers": compatiblePhoneNumbers,
      "questions": template.questions,
      "openingText": template.openingText,
      "closingText": template.closingText
    }

    // First save the survey in the database as a new sent survey
    let res: any = await lastValueFrom(this.http.post("http://localhost:3000/saveSentSurvey/", body))

    await lastValueFrom(this.http.post("http://localhost:7777/startSurvey/", res))
  }

  async checkCompatibility(phoneNumbers: string[]) {
    let body: any = {
      "phoneNumbers": phoneNumbers
    }

    let res: any = await lastValueFrom(this.http.post("http://localhost:3000/compatibilityCheck/", body))

    return res.phoneNumbers;
  }
}

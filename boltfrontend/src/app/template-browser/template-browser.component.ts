import {Component, OnInit} from '@angular/core';
import {lastValueFrom} from "rxjs";
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
    await lastValueFrom(this.http.post("http://localhost:3000/sendReviewTemplate", template))
  }

  async deleteReviewTemplate(template: ReviewTemplate) {
    await lastValueFrom(this.http.delete("http://localhost:3000/deleteTemplate/" + template.objectId));
    this.getReviewTemplates().catch(console.dir)
  }
}

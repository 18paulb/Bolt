import { Component } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { lastValueFrom} from "rxjs";
import { ReviewTemplate } from "../../../../shared/models/ReviewTemplate"

@Component({
  selector: 'app-review-builder',
  templateUrl: './review-builder.component.html',
  styleUrls: ['./review-builder.component.css']
})
export class ReviewBuilderComponent {

  constructor(private http: HttpClient) {
  }

  imageUrl:string = "https://storage.googleapis.com/kitchen-sink-sample-images/cute-dog.jpg"

  messageText:string = "TEST"

  messageDescription:string = "This is a test from a node.js server, is this cool?"

  suggestedResponses:Array<string> = ["yes", "no"]

  newResponse:string = ""

  async test() {
    let review:ReviewTemplate = new ReviewTemplate(this.imageUrl, this.messageText, this.messageDescription, this.suggestedResponses, "")
    const data = await lastValueFrom(this.http.post("http://localhost:3000/reviewTemplate", review));
    console.log(data)
  }

  addUserResponse() {
    this.suggestedResponses.push(this.newResponse);
    this.newResponse = ""
  }

  removeUserResponse(index: number) {
    this.suggestedResponses.splice(index, 1);
  }
}

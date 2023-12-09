import { Component } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { lastValueFrom} from "rxjs";

@Component({
  selector: 'app-review-builder',
  templateUrl: './review-builder.component.html',
  styleUrls: ['./review-builder.component.css']
})
export class ReviewBuilderComponent {

  constructor(private http: HttpClient) {
  }


  imageUrl:String = "https://storage.googleapis.com/kitchen-sink-sample-images/cute-dog.jpg"

  messageText:String = "TEST"

  messageDescription:String = "This is a test from a node.js server, is this cool?"

  suggestedResponses:String = "yes"

  async test() {

    let body = {
      "imageUrl": this.imageUrl,
      "messageText": this.messageText,
      "messageDescription": this.messageDescription,
      "suggestedResponses": this.suggestedResponses
    }

    const data = await lastValueFrom(this.http.post("http://localhost:3000/richCard", body));
    console.log(data)
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-review-builder',
  templateUrl: './review-builder.component.html',
  styleUrls: ['./review-builder.component.css']
})
export class ReviewBuilderComponent {


  imageURL:String = ""

  promptText:String = ""

  userResponse:String = ""

  onSubmit():any {
    console.log(this.imageURL)
    console.log(this.promptText)
    console.log(this.userResponse)
  }

}

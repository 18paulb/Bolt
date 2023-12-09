export class ReviewTemplate {
    imageUrl: string;
    messageText: string;
    messageDescription: string;
    suggestedResponses: Array<string>

  constructor(imageUrl:string, messageText:string, messageDescription:string, suggestedResponses: Array<string>) {
      this.imageUrl = imageUrl;
      this.messageText = messageText;
      this.messageDescription = messageDescription;
      this.suggestedResponses = suggestedResponses;
  }
}

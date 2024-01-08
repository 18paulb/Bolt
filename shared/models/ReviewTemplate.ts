import {Template} from "./Template";

export class ReviewTemplate extends Template {
    imageUrl: string;
    messageText: string;
    messageDescription: string;
    suggestedResponses: Array<string>

    constructor(imageUrl: string, messageText: string, messageDescription: string, suggestedResponses: Array<string>, objectId: string) {
        super(objectId)
        this.imageUrl = imageUrl;
        this.messageText = messageText;
        this.messageDescription = messageDescription;
        this.suggestedResponses = suggestedResponses;
        this.objectId = objectId
    }
}

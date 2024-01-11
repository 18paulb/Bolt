export class RecipientModel {
    phoneNumber
    lastSent

    constructor(phoneNumber, lastSent) {
        this.phoneNumber = phoneNumber;
        this.lastSent = lastSent;
    }
}

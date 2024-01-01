import {MongoClient, ObjectId, ServerApiVersion} from "mongodb";
import {ReviewTemplateModel} from "./models/ReviewTemplateModel.js";
import {SurveyModel} from "./models/SurveyModel.js";
import {SurveyTemplateModel} from "./models/SurveyTemplateModel.js";
import {ReviewModel} from "./models/ReviewModel.js";
// import {ReviewTemplate} from "../../shared/models/ReviewTemplate.js";

const uri = "mongodb+srv://brandonpaul:Sports18120@bolt.zjlyp8n.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let isConnected = false;

async function connectToDatabase() {
    if (!isConnected) {
        await client.connect();
        isConnected = true;
    }

    return client.db("Bolt")
}

export async function saveReviewTemplate(template) {
    let db = await connectToDatabase();

    let reviewModel = new ReviewTemplateModel(template.imageUrl, template.messageText, template.messageDescription, template.suggestedResponses, "brandon")
    reviewModel.templateType = "Review"

    await db.collection('Templates').insertOne(reviewModel);
}

export async function deleteTemplate(templateId) {
    let db = await connectToDatabase();

    let collection = db.collection('Templates');

    // Specify the filter criteria to delete by _id
    const filter = {_id: new ObjectId(templateId)};

    await collection.deleteOne(filter);
}

export async function getAllTemplates(ownerId) {
    let db = await connectToDatabase();

    // Define the filter criteria
    const filter = {};
    filter["ownerId"] = ownerId;

    let collection = db.collection("Templates")

    // Fetch documents matching the filter criteria
    const documents = await collection.find(filter).toArray();

    let results = []

    // Get all results and make them into the shared ReviewTemplate model
    for (let i = 0; i < documents.length; ++i) {
        let doc = documents[i]

        if (doc.templateType === "Review") {
            let model = new ReviewTemplateModel(doc.imageUrl, doc.messageText, doc.messageDescription, doc.suggestedResponses, doc.ownerId)
            model._id = doc._id.toString()
            model.templateType = "Review"
            results.push(model)
        }

        if (doc.templateType === "Survey") {
            let model = new SurveyTemplateModel(doc.questions)
            model.id = doc._id.toString()
            model.templateType = "Survey"
            results.push(model)
        }

    }

    return results;
}

export async function saveSentSurvey(survey) {
    let db = await connectToDatabase();

    let surveyModel = new SurveyModel(survey.phoneNumber, survey.questions, Date.now())

    // Add extra data to the survey, ie hasAnswered/response fields
    for (let i = 0; i < surveyModel.questions.length; ++i) {
        let question = surveyModel.questions[i]
        question.hasResponded = false;
        question.response = null;
    }

    let insertResult = await db.collection('Survey').insertOne(surveyModel);

    // Returns the ID of the survey so that we can update it later
    return insertResult.insertedId.toString()
}

export async function saveSentReview(review, phoneNumber) {
    let db = await connectToDatabase();

    let reviewModel = new ReviewModel(review.imageUrl, review.messageText, review.messageDescription, review.suggestedResponses, phoneNumber, Date.now())
    reviewModel.hasResponded = false;
    reviewModel.response = null;

    let insertResult = await db.collection('Review').insertOne(reviewModel)

    return insertResult.insertedId.toString()
}

export async function getReview(reviewId){
    let db = await connectToDatabase();

    const filter = { _id: new ObjectId(reviewId) }

    let collection = db.collection("Review")
    const documents = await collection.find(filter).toArray();

    return documents[0]
}

export async function getReviewByPhoneNumber(phoneNumber) {
    let db = await connectToDatabase();

    const filter = { phoneNumber: phoneNumber}

    let collection = db.collection("Review")

    // FIXME: This is not a long term solution for making sure the correct review is fetched
    // This should get the latest review sent to a phone number
    const latestDocument = await collection.find(filter)
        .sort({ date: -1 })
        .limit(1)
        .toArray();

    return latestDocument.length > 0 ? latestDocument[0] : null;

}

export async function updateReview(review, reviewId) {
    try {
        let db = await connectToDatabase();

        const result = await db.collection('Review').updateOne(
            { _id: new ObjectId(reviewId) }, // Filter criteria: match documents with this surveyId
            { $set: review }   // Update operation: set the new values from `survey`
        );

        // `result` contains information about the operation
        // For example, you can check if a document was modified:
        if (result.modifiedCount === 0) {
            console.log('No document was updated.');
        } else {
            console.log('Document updated successfully.');
        }

        return result;
    } catch (error) {
        console.error('Error updating the survey:', error);
        throw error; // Rethrow the error for further handling if necessary
    }
}

export async function updateSurvey(survey, surveyId) {
    try {
        let db = await connectToDatabase();

        const result = await db.collection('Survey').updateOne(
            { _id: new ObjectId(surveyId) }, // Filter criteria: match documents with this surveyId
            { $set: survey }   // Update operation: set the new values from `survey`
        );

        // `result` contains information about the operation
        // For example, you can check if a document was modified:
        if (result.modifiedCount === 0) {
            console.log('No document was updated.');
        } else {
            console.log('Document updated successfully.');
        }

        return result;
    } catch (error) {
        console.error('Error updating the survey:', error);
        throw error; // Rethrow the error for further handling if necessary
    }
}

export async function getSurvey(surveyId) {
    let db = await connectToDatabase();

    const filter = { _id: new ObjectId(surveyId) }

    let collection = db.collection("Survey")

    const documents = await collection.find(filter).toArray();

    return documents[0]
}

export async function getSurveyByPhoneNumber(phoneNumber) {
    let db = await connectToDatabase();

    const filter = { phoneNumber: phoneNumber}

    let collection = db.collection("Survey")

    // FIXME: This is not a long term solution for making sure the correct survey is fetched
    // This should get the latest survey sent to a phone number
    const latestDocument = await collection.find(filter)
        .sort({ date: -1 })
        .limit(1)
        .toArray();

    return latestDocument.length > 0 ? latestDocument[0] : null;

}

export async function saveSurveyTemplate(survey) {
    let db = await connectToDatabase();

    let collection = db.collection("Templates")

    let surveyModel = new SurveyTemplateModel(survey.questions, "brandon");
    surveyModel.templateType = "Survey"

    await collection.insertOne(surveyModel);
}

import {MongoClient, ObjectId, ServerApiVersion} from "mongodb";
import {ReviewTemplateModel} from "./models/ReviewTemplateModel.js";
import {SurveyModel} from "./models/SurveyModel.js";
import {SurveyTemplateModel} from "./models/SurveyTemplateModel.js";
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

export async function saveReviewTemplate(template) {
    try {
        await client.connect();
        let db = client.db("Bolt");

        let reviewModel = new ReviewTemplateModel(template.imageUrl, template.messageText, template.messageDescription, template.suggestedResponses, "brandon")
        reviewModel.templateType = "Review"

        await db.collection('Templates').insertOne(reviewModel);

        await client.close();
    } catch (ex) {
        console.log(ex);
    }
}

export async function deleteTemplate(templateId) {
    try {
        await client.connect();
        let db = client.db("Bolt");
        let collection =  db.collection('Templates');

        const objectId = new ObjectId(templateId); // Create an ObjectId from the id string
        // Specify the filter criteria to delete by _id
        const filter = { _id: objectId };

        const result = await collection.deleteOne(filter);

        await client.close();
    } catch (ex) {
        console.log(ex);
    }
}

export async function getAllTemplates(ownerId) {
    try {
        await client.connect()
        let db = client.db("Bolt")

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

        await client.close()

        return results;

    } catch (ex) {
        console.log(ex)
    }
}

export async function saveSurvey(survey){
    try {
        await client.connect()
        let db = client.db("Bolt")

        let surveyModel = new SurveyModel(survey.phoneNumber, survey.questions)

        await db.collection('Survey').insertOne(surveyModel);

        await client.close();

    } catch (ex) {
        console.log(ex)
    }
}

export async function saveSurveyTemplate(survey){
    try {
        await client.connect()
        let db = client.db("Bolt")

        let collection = db.collection("Templates")

        let surveyModel = new SurveyTemplateModel(survey.questions, "brandon");
        surveyModel.templateType = "Survey"

        await collection.insertOne(surveyModel);

        await client.close();

    } catch (ex) {
        console.log(ex)
    }
}

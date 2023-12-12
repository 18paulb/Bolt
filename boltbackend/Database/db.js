import {MongoClient, ObjectId, ServerApiVersion} from "mongodb";
import {ReviewTemplateModel} from "./models/ReviewTemplateModel.js";
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

// export async function createCollection() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         let database = client.db("Bolt");
//
//         const collectionName = "Templates";
//         await database.createCollection(collectionName);
//         await client.close();
//
//     } catch (ex) {
//         console.log(ex)
//     }
// }

export async function saveReviewTemplate(template) {
    try {
        await client.connect();
        let db = client.db("Bolt");

        let reviewModel = new ReviewTemplateModel(template.imageUrl, template.messageText, template.messageDescription, template.suggestedResponses, "brandon")

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
            let doc = documents[i];
            let model = new ReviewTemplateModel(doc.imageUrl, doc.messageText, doc.messageDescription, doc.suggestedResponses, doc.ownerId)
            model.objectId = doc._id.toString()
            results.push(model)
        }

        await client.close()

        return results;

    } catch (ex) {
        console.log(ex)
    }
}


// let results = await getAllTemplates("brandon").catch(console.dir)
// console.log(results)


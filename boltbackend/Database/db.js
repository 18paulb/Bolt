
import {MongoClient, ServerApiVersion} from "mongodb";
import {ReviewTemplateModel} from "./models/ReviewTemplateModel.js";

const uri = "mongodb+srv://brandonpaul:Sports18120@bolt.zjlyp8n.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (ex) {
        console.log(ex)
    }
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

export async function createCollection() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        let database = client.db("Bolt");

        const collectionName = "Templates";
        await database.createCollection(collectionName);
    } catch (ex) {
        console.log(ex)
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

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

// run().catch(console.dir);
// createCollection().catch(console.dir)

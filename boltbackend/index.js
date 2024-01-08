import express from 'express';
import cors from 'cors'
import * as db from './Database/db.js'
import * as carousel from './Agents/carousel.js'
import * as abandonedCart from './CRMApps/Shopify/ShopifyDataFetchers/AbandonedCartFetcher.js'

const app = express();
const port = 3000;

app.use(
    cors({
        origin: "http://localhost:4200", // Angular server
    })
);
// Middleware to parse the body of the request
app.use(express.json());

app.use((req, res, next) => {
    console.log("Right here check for compatibility in the middleware")
    next()
})

app.get("/", (req, res) => {
    res.json({message: "Hello World!"});
});

app.post("/reviewTemplate", async (req, res) => {
    try {
        const data = req.body;
        // let reviewTemplateModel = new ReviewTemplateModel(data.imageUrl, data.messageText, data.messageDescription, data.suggestedResponses, data.ownerId)
        await db.saveReviewTemplate(data);

        res.status(200).json({message: "Review Template Saved Successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "An error occurred while saving the review template"});
    }
});

app.post('/surveyTemplate', async (req, res) => {

    try {
        const data = req.body;
        await db.saveSurveyTemplate(data)
        res.status(200).json({message: "Success"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "An error occured while saving the survey template"})
    }
})

app.post('/sendAbandonedCart', async (req, res) => {
    try {
        let cartData = abandonedCart.getAbandonedCarts()
        await carousel.sendCarousel(cartData)
        res.status(200).json({message: "Success"})
    } catch (error) {
        res.status(500).json({message: "An error occurred while sending abandoned cart messages"})
    }
})

app.post("/saveSentReview", async (req, res) => {
    let reviewIdMap = {}

    try {
        for (let i = 0; i < req.body.phoneNumbers.length; ++i) {
            reviewIdMap[req.body.phoneNumbers[i]] = await db.saveSentReview(req.body.review, req.body.phoneNumbers[i]);
        }

        res.status(200).json(reviewIdMap)
    } catch (error) {
        res.status(500).json({message: "An error occurred while sending a review template"})
    }
})

app.post("/saveSentSurvey", async (req, res) => {
    let surveyIdMap = {}

    try {
        let phoneNumbers = req.body.phoneNumbers
        for (let i = 0; i < phoneNumbers.length; ++i) {
            surveyIdMap[phoneNumbers[i]] = await db.saveSentSurvey(req.body.questions, phoneNumbers[i])
        }

        res.status(200).json(surveyIdMap)
    } catch (error) {
        res.status(500).json({message: "An error occurred while sending the survey"})
    }
})

app.get("/getReviewTemplates/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        let result = await db.getAllTemplates(userId);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: "An error occurred while getting the review templates"})
    }
});

app.delete("/deleteTemplate/:templateId", async (req, res) => {
    try {
        const id = req.params.templateId;
        await db.deleteTemplate(id)

        res.status(200).json({message: "Success"})
    } catch (error) {
        res.status(500).json({message: "An error occurred while deleting the template"})
    }
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

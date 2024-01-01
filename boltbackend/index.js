import express from 'express';
import cors from 'cors'
import * as db from './Database/db.js'
import * as richCard from './Agents/richCard.js'
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

        res.status(200);
        res.json({message: "Review Template Saved Successfully"});
    } catch (error) {
        console.error(error);
        res.status(500);
        res.json({message: "An error occurred while saving the review template"});
    }
});

app.post('/surveyTemplate', async (req, res) => {

    try {
        const data = req.body;
        await db.saveSurveyTemplate(data)
        res.status(200);
        res.json({message: "Success"})
    } catch (error) {
        console.log(error);
        res.status(500);
        res.json({message: "An error occured while saving the survey template"})
    }
})

app.post('/sendAbandonedCart', async (req, res) => {
    try {
        let cartData = abandonedCart.getAbandonedCarts()
        await carousel.sendCarousel(cartData)
        res.status(200);
        res.json({message: "Success"})
    } catch (error) {
        res.status(500)
        res.json({message: "An error occurred while sending abandoned cart messages"})
    }
})

app.post("/saveSentReview", async (req, res) => {
    try {
        let reviewId = await db.saveSentReview(req.body.review, req.body.phoneNumber)
        res.status(200)
        res.json({id: reviewId})
    } catch (error) {
        res.status(500)
        res.json({message: "An error occurred while sending the review template"})
    }
})

app.post("/saveSentSurvey", async (req, res) => {
    try {
        const data = req.body;

        let surveyId = await db.saveSentSurvey(data)

        res.status(200)
        res.json({id: surveyId})
    } catch (error) {
        res.status(500)
        res.json({message: "An error occurred while sending the survey"})
    }
})

app.get("/getReviewTemplates/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        let result = await db.getAllTemplates(userId);
        res.status(200);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.json({message: "An error occurred while getting the review templates"})
    }
});

app.delete("/deleteTemplate/:templateId", async (req, res) => {
    try {
        const id = req.params.templateId;
        await db.deleteTemplate(id)
        res.status(200);
        res.json({message: "Success"})
    } catch (error) {
        res.status(500);
        res.json({message: "An error occurred while deleting the template"})
    }
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

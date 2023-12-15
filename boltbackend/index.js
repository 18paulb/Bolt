import express from 'express';
import cors from 'cors'
import * as db from './Database/db.js'
import * as richCard from './Agents/richCard.js'
import * as carousel from './Agents/carousel.js'
import * as abandonedCart from './CRMApps/Shopify/ShopifyDataFetchers/AbandonedCartFetcher.js'
// import {ReviewTemplate} from "../shared/models/ReviewTemplate.js";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:4200", // Angular server
  })
);
// Middleware to parse the body of the request
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.post("/reviewTemplate", async (req, res) => {
  try {
    const data = req.body;
    // let review = new ReviewTemplate(data.imageUrl, data.messageText, data.messageDescription, data.suggestedResponses)

    await db.saveReviewTemplate(data);

    res.status(200);
    res.json({ message: "Review Template Saved Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ message: "An error occurred while saving the review template" });
  }
});

app.post('/surveyTemplate', (req, res) => {

})

app.post('/sendAbandonedCart', async (req, res) => {

    let cartData = abandonedCart.getAbandonedCarts()
    await carousel.sendCarousel(cartData)
        .then(response => {
            res.status(200)
            res.json({message: 'Abandoned Cart Sent'})
        })
        .catch(err => {
            res.status(400)
            res.json({message: err})
        });
})

app.post('/sendReviewTemplate', (req, res) => {
    const data = req.body;
    richCard.sendReviewTemplate(data)
})

app.get("/getReviewTemplates/:userId", async (req, res) => {
  const userId = req.params.userId;
  let result = await db.getAllTemplates(userId);

  res.status(200);
  res.json(result);
});

app.delete("/deleteTemplate/:templateId", async (req, res) => {
  const id = req.params.templateId;
    await db.deleteTemplate(id)
        .then(response => {
            res.status(200)
            res.json({message: 'Template Deleted Successfully'})
        })
        .catch(err => {
            res.status(400)
            res.json({message: err})
        })
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

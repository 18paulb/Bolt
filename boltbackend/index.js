import express from 'express';
const app = express();
const port = 3000;
import cors from 'cors'
// import {ReviewTemplate} from "../shared/models/ReviewTemplate.js";
import * as db from './Database/db.js'
import * as richCard from './Agents/richCard.js'

app.use(cors({
    origin: 'http://localhost:4200' // Angular server
}));
// Middleware to parse the body of the request
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'Hello World!'})
});

app.post('/reviewTemplate', (req, res) => {
    const data = req.body;
    // console.log(data);

    // let review = new ReviewTemplate(data.imageUrl, data.messageText, data.messageDescription, data.suggestedResponses)

    db.saveReviewTemplate(data).catch(console.dir)

    res.status(200)
    res.json({message: 'Review Template Saved Successfully'})
})

app.post('/sendReviewTemplate', (req ,res) => {
    const data = req.body;

    richCard.sendReviewTemplate(data)
})

app.get('/getReviewTemplates/:userId', async (req, res) => {
    const userId = req.params.userId;
    let result = await db.getAllTemplates(userId)

    res.json(result)
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

const richCard = require('./Agents/richCard')

app.use(cors({
    origin: 'http://localhost:4200' // Angular server
}));
// Middleware to parse the body of the request
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' })
});

app.post('/richCard', (req, res) => {
    const data = req.body;

    console.log(data);

    richCard.sendRichCard(data["suggestedResponses"], data["imageUrl"], data["messageText"], data["messageDescription"])

    res.status(200)
    res.json({ message: 'Hello World!' })
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

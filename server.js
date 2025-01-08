require('dotenv').config();
const express = require('express');
const app = express();

const mySecret = process.env.MY_SECRET;
const myApiKey = process.env.API_KEY;

app.get('/', (req, res) => {
  res.send(`Secret: ${mySecret}, API Key: ${myApiKey}`);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

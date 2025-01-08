const express = require('express');
const app = express();
const port = 3000;

const dbUser = process.env.DB_USER; // الوصول إلى متغير البيئة
const dbPassword = process.env.DB_PASSWORD; 

app.get('/', (req, res) => {
  res.send(`DB User: ${dbUser}, DB Password: ${dbPassword}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const express = require('express');
const app = express();
const port = 3000;

// الوصول إلى المتغيرات البيئية
const dbUser = process.env.DB_USER;  // مثال على متغير البيئة
const dbPassword = process.env.DB_PASSWORD;  // مثال على متغير البيئة

app.get('/', (req, res) => {
  res.send(`DB User: ${dbUser}, DB Password: ${dbPassword}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

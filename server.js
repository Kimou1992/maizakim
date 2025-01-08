const express = require('express');
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// استخدام رابط ثابت لاختبار الاتصال
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});


client.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch(err => {
    console.error('❌ Connection error:', err.message);
    console.error('Error stack:', err.stack);
  });

app.get('/', (req, res) => {
  res.send('Testing database connection!');
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

const express = require('express');
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// استخدام رابط ثابت لاختبار الاتصال
const client = new Client({
  connectionString: 'postgresql://usdt_exchange_user:viPVkXuyXiy45QN3xXCSXqNSKrwxaU2U@dpg-ctu4ckjv2p9s738oqch0-a/usdt_exchange',
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

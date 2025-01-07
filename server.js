const express = require('express');
const { Client } = require('pg');

// إنشاء تطبيق Express
const app = express();
const port = process.env.PORT || 3000;

// الاتصال بقاعدة البيانات باستخدام الرابط المخزن في المتغير البيئي
const client = new Client({
  connectionString: process.env.DATABASE_URL,  // استخدام المتغير البيئي
  ssl: {
    rejectUnauthorized: false  // إذا كانت قاعدة البيانات تتطلب SSL
  }
});

// محاولة الاتصال بقاعدة البيانات
client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

// إعداد واجهة API بسيطة
app.get('/', (req, res) => {
  res.send('Hello from the Render app!');
});

// بدء السيرفر
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

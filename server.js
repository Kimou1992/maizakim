// تحميل مكتبة dotenv لتحميل المتغيرات البيئية إذا كنت تعمل محلياً (تأكد من أن ملف .env موجود)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); // تحميل المتغيرات البيئية من .env في حالة بيئة التطوير
}

// استيراد مكتبة PostgreSQL
const { Client } = require('pg');

// إعدادات الاتصال بقاعدة البيانات باستخدام المتغيرات البيئية
const client = new Client({
  user: process.env.PGUSER,        // سيتم تحميله من متغير البيئة
  host: process.env.PGHOST,        // سيتم تحميله من متغير البيئة
  database: process.env.PGDATABASE,// سيتم تحميله من متغير البيئة
  password: process.env.PGPASSWORD,// سيتم تحميله من متغير البيئة
  port: process.env.PGPORT,        // سيتم تحميله من متغير البيئة
});

// محاولة الاتصال بقاعدة البيانات
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// إعداد خادم HTTP بسيط باستخدام Express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // استخدام المتغير البيئي PORT أو الافتراضي 3000

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// بدء الخادم
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require('express');
const { Client } = require('pg');

// إنشاء تطبيق Express
const app = express();
const port = process.env.PORT || 3000;

// عرض قيمة DATABASE_URL في السجلات (للتأكد من قراءتها)
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// إعداد اتصال PostgreSQL
const client = new Client({
  connectionString: process.env.DATABASE_URL, // قراءة الرابط من المتغير البيئي
  ssl: {
    rejectUnauthorized: false, // السماح بالاتصالات غير الموثوقة (مطلوب في Render)
  }
});

// محاولة الاتصال بقاعدة البيانات
client.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch(err => {
    console.error('❌ Connection error:', err.message);
    console.error('Error stack:', err.stack);
  });

// إعداد نقطة نهاية بسيطة للتحقق من عمل التطبيق
app.get('/', (req, res) => {
  res.send('Hello from Render App!');
});

// نقطة نهاية للحصول على بيانات من قاعدة البيانات
app.get('/data', async (req, res) => {
  try {
    const result = await client.query('SELECT NOW() AS current_time');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('❌ Query error:', err.message);
    res.status(500).json({ success: false, message: 'Database query failed' });
  }
});

// بدء تشغيل السيرفر
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

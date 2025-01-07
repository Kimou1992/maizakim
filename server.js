// استيراد المكتبات
require('dotenv').config();  // لتحميل المتغيرات البيئية من ملف .env

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

// إنشاء تطبيق Express
const app = express();

// تفعيل CORS
app.use(cors());

// الإعدادات
const PORT = process.env.PORT || 3000; // استخدم المنفذ الذي توفره Render أو 3000 افتراضيًا

// الاتصال بقاعدة بيانات PostgreSQL
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432,  // إذا كان المنفذ غير محدد، استخدم 5432
});

pool.connect()
  .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح!'))
  .catch(err => console.error('خطأ في الاتصال بقاعدة البيانات:', err));

// تعريف نقطة النهاية
app.get('/', (req, res) => {
  res.send('الخادم يعمل!');
});

// نقطة النهاية للتفاعل مع قاعدة البيانات (مثال: استعلام للحصول على بيانات)
app.get('/get-users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users'); // تعديل الاستعلام حسب احتياجاتك
    res.json(result.rows); // إرسال البيانات على هيئة JSON
  } catch (error) {
    console.error('خطأ أثناء استعلام قاعدة البيانات:', error);
    res.status(500).send('حدث خطأ في الخادم');
  }
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});

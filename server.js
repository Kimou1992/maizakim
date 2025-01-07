const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // مكتبة لدعم CORS
const app = express();

app.use(cors()); // تمكين CORS للسماح بالوصول من جميع النطاقات
app.use(express.json()); // لدعم قراءة بيانات JSON

// إعداد الاتصال بقاعدة البيانات باستخدام متغيرات البيئة
const pool = new Pool({
  user: process.env.PGUSER,       // اسم المستخدم لقاعدة البيانات من متغيرات البيئة
  host: process.env.PGHOST,       // اسم المضيف لقاعدة البيانات من متغيرات البيئة
  database: process.env.PGDATABASE, // اسم قاعدة البيانات من متغيرات البيئة
  password: process.env.PGPASSWORD, // كلمة المرور لقاعدة البيانات من متغيرات البيئة
  port: process.env.PGPORT || 5432, // المنفذ (افتراضي 5432)
});

// endpoint لجلب البيانات من قاعدة البيانات
app.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users'); // استعلام لجلب البيانات
    res.json(result.rows); // إرسال البيانات كـ JSON
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).send('Internal Server Error');
  }
});

// تشغيل الخادم
const PORT = process.env.PORT || 3000; // استخدم المتغيرات البيئية أو المنفذ الافتراضي
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

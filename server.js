const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// استخدم JSON لتفسير البيانات المدخلة
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// قراءة البيانات السرية من ملف .env أو Secret File
const secretFilePath = '/etc/secrets/secret'; // قم بتغيير المسار حسب الحاجة
let secretData = '';

// قراءة الملف عند بدء الخادم
fs.readFile(secretFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('خطأ في قراءة الملف السرية:', err);
  } else {
    secretData = data.trim();  // احفظ البيانات السرية
  }
});

// نقطة النهاية للمقارنة
app.post('/compare', (req, res) => {
  const inputData = req.body.input;  // استلام المدخل من المستخدم

  if (inputData === secretData) {
    res.json({ message: 'البيانات متطابقة' });
  } else {
    res.json({ message: 'البيانات غير متطابقة' });
  }
});

// بدء الخادم
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`الخادم يعمل على المنفذ ${port}`);
});

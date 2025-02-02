const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// تقديم الملفات الثابتة من المجلد الحالي
app.use(express.static(__dirname));

// توجيه الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// تشغيل الخادم
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

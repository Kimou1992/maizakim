const express = require('express');
const app = express();
const path = require('path');

// تعيين البورت الذي سيعمل عليه التطبيق
const PORT = process.env.PORT || 3000;

// مسار لخدمة الملفات الثابتة (مثل HTML و CSS و JS)
app.use(express.static(path.join(__dirname, 'public')));

// المسار الرئيسي الذي يعرض صفحة HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// بدء الخادم على البورت المحدد
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

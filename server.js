const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

// تحميل ملف users.json
let data = require('./users.json');

// مسار GET لإرجاع البيانات
app.get('/users', (req, res) => {
    res.json(data);
});

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

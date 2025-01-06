const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json()); // لدعم JSON

// تحميل البيانات من ملف users.json
let data = require('./users.json');

// عرض البيانات (GET)
app.get('/users', (req, res) => {
    res.json(data); // إرسال البيانات كـ JSON
});

// إضافة بيانات جديدة (POST)
app.post('/users', (req, res) => {
    const newUser = req.body; // بيانات المستخدم الجديد
    data.push(newUser); // إضافة المستخدم إلى المصفوفة

    // تحديث ملف users.json
    fs.writeFile('./users.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'فشل حفظ البيانات' });
        }
        res.json({ message: 'تمت الإضافة بنجاح', user: newUser });
    });
});

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

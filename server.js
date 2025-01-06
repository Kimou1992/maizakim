// استيراد مكتبة CORS
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const app = express();

// تفعيل CORS للسماح بالوصول من أي مصدر
app.use(cors()); // هذا يتيح الوصول من أي موقع

// أو يمكنك تحديد مصادر معينة (إذا كنت تريد السماح فقط بموقع معين):
// app.use(cors({
//     origin: 'https://example.com' // استبدل بـ URL الخاص بموقعك
// }));

// إعدادات الـ API الأخرى (مثل الـ POST و GET و PUT)
app.use(express.json()); // لتفسير الـ JSON في الجسم

const dataFile = './users.json'; // تأكد من مسار الملف الصحيح

// تعريف المسارات (مثال)
app.get('/users', (req, res) => {
    fs.readFile(dataFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'حدث خطأ في قراءة البيانات' });
        }
        res.json(JSON.parse(data));
    });
});

// تعديل المستخدم (مثال PUT)
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { username } = req.body;

    fs.readFile(dataFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'حدث خطأ أثناء قراءة البيانات' });
        }

        const users = JSON.parse(data);
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'المستخدم غير موجود' });
        }

        users[userIndex].username = username;

        fs.writeFile(dataFile, JSON.stringify(users, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'حدث خطأ أثناء حفظ البيانات' });
            }
            res.json(users[userIndex]); // إرجاع المستخدم المعدل
        });
    });
});

// بدء الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
});

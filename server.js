const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// لتفعيل تحليل بيانات JSON في الجسم
app.use(express.json());

const dataFile = path.join(__dirname, 'data.json');

// نقطة النهاية لجلب المستخدمين
app.get('/users', (req, res) => {
    fs.readFile(dataFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'حدث خطأ أثناء قراءة البيانات' });
        }
        res.json(JSON.parse(data)); // إرجاع بيانات المستخدمين
    });
});

// نقطة النهاية لتعديل بيانات المستخدم
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id); // الحصول على ID المستخدم من المعامل
    const { username } = req.body; // الحصول على الاسم الجديد من الجسم

    fs.readFile(dataFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'حدث خطأ أثناء قراءة البيانات' });
        }

        const users = JSON.parse(data); // تحويل البيانات إلى مصفوفة
        const userIndex = users.findIndex(user => user.id === userId); // البحث عن المستخدم بناءً على الـ ID

        if (userIndex === -1) {
            return res.status(404).json({ error: 'المستخدم غير موجود' }); // إذا لم يتم العثور على المستخدم
        }

        // تحديث الاسم
        users[userIndex].username = username;

        // حفظ البيانات المعدلة في ملف JSON
        fs.writeFile(dataFile, JSON.stringify(users, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'حدث خطأ أثناء حفظ البيانات' });
            }
            // إرجاع المستخدم المعدل
            res.json(users[userIndex]);
        });
    });
});

// بدء الخادم على المنفذ 3000 أو المنفذ المخصص
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

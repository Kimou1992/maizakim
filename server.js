const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

// تمكين CORS لجميع الطلبات
app.use(cors());

// نقطة النهاية لقراءة بيانات المستخدمين من ملف JSON
app.get('/users', (req, res) => {
    // قراءة ملف JSON
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('خطأ في قراءة البيانات');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

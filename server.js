const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// استيراد المتغير البيئي
const MNH = process.env.MNH;

// التحقق من وجود المتغير البيئي
if (!MNH) {
    console.error('ملاحظة: المتغير البيئي MNH غير مضبوط!');
}

app.use(express.static('public'));
app.use(express.json());

app.post('/verify', (req, res) => {
    const { word } = req.body;

    // التحقق من الكلمة المدخلة
    if (word === MNH) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
});

app.listen(port, () => {
    console.log(`الخادم يعمل على المنفذ ${port}`);
});

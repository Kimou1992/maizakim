const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// طباعة المتغير البيئي للتحقق
console.log('متغير MNH:', process.env.MNH);

const MNH = process.env.MNH;
if (!MNH) {
    console.error('المتغير البيئي MNH غير مضبوط!');
    process.exit(1);  // إيقاف الخادم إذا لم يتم ضبط المتغير
} else {
    console.log(`تم ضبط المتغير البيئي MNH: ${MNH}`);
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

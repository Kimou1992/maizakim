const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// استيراد المتغير البيئي
const MNH = process.env.MNH;

app.use(express.static('public'));
app.use(express.json());

app.post('/verify', (req, res) => {
    const { word } = req.body;

    // التحقق من الكلمة
    if (word === MNH) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

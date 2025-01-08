// استيراد مكتبة Express
const express = require('express');
const app = express();

// استخدام المتغير البيئي PORT أو تعيينه إلى 3000
const PORT = process.env.PORT || 3000;

// إعداد مسار GET افتراضي
app.get('/', (req, res) => {
    res.send('Hello, World! This is your app running on Render.');
});

// بدء الخادم على البورت المحدد
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

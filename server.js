// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// توجيه الطلبات إلى المجلد الحالي
app.use(express.static(path.join(__dirname)));

// استماع للطلبات على المنفذ المحدد
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

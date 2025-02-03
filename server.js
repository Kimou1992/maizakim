require("dotenv").config();
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // السماح بالطلبات من أي مصدر

// دالة لتوقيع الطلبات إلى Binance API
function signRequest(queryString, secretKey) {
    return crypto.createHmac("sha256", secretKey).update(queryString).digest("hex");
}

// نقطة API لاسترجاع عنوان USDT (باستخدام POST فقط)
app.post("/get-usdt-address", async (req, res) => {
    try {
        const { apiKey, secretKey } = req.body;

        if (!apiKey || !secretKey) {
            return res.status(400).json({ error: "يرجى إدخال API Key و Secret Key" });
        }

        const timestamp = Date.now();
        const params = `coin=USDT&timestamp=${timestamp}`;
        const signature = signRequest(params, secretKey);

        const response = await axios.get(`https://api.binance.com/sapi/v1/capital/deposit/address?${params}&signature=${signature}`, {
            headers: { "X-MBX-APIKEY": apiKey },
        });

        res.json({ address: response.data.address });
    } catch (error) {
        console.error("حدث خطأ:", error.response?.data || error.message);
        res.status(500).json({ error: "فشل جلب عنوان USDT" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});

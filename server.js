const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// دالة لإنشاء توقيع HMAC SHA256 للطلب
function signRequest(queryString, secretKey) {
    return crypto.createHmac("sha256", secretKey).update(queryString).digest("hex");
}

// إعداد JSON Parsing لتعامل مع بيانات POST
app.use(express.json());

// استرجاع عنوان إيداع USDT
app.post("/usdt-address", async (req, res) => {
    const { apiKey, secretKey } = req.body;  // استلام API Key و Secret Key من الطلب
    if (!apiKey || !secretKey) {
        return res.status(400).send("يرجى إدخال API Key و Secret Key.");
    }

    const timestamp = Date.now();
    const coin = "USDT"; // العملة المطلوبة
    const network = "TRX"; // شبكة TRC20، يمكن تغييرها إلى ETH أو BSC
    const queryString = `coin=${coin}&network=${network}&timestamp=${timestamp}`;
    const signature = signRequest(queryString, secretKey);

    try {
        // طلب عنوان الإيداع من Binance API باستخدام API Key و Secret Key المدخلة
        const response = await axios.get(`https://api.binance.com/sapi/v1/capital/deposit/address?${queryString}&signature=${signature}`, {
            headers: { "X-MBX-APIKEY": apiKey }
        });

        res.json({ address: response.data.address, network: response.data.network });
    } catch (error) {
        console.error("خطأ في جلب عنوان الإيداع:", error.response?.data || error.message);
        res.status(500).send("فشل في جلب عنوان الإيداع");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
});

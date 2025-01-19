const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; // استخدام المتغير البيئي PORT في حالة نشره على Render

// إعداد CORS
const corsOptions = {
  origin: '*', // يسمح بالوصول من أي نطاق
  methods: ['GET', 'POST'], // تحديد طرق HTTP المسموح بها
  allowedHeaders: ['Content-Type'], // السماح بالوصول للرؤوس المحددة
};

app.use(cors(corsOptions)); // استخدام إعدادات CORS المخصصة

// إعداد Google Sheets API
async function getSheetData() {
  const clientEmail = 'tgbot-618@citric-gradient-447312-g8.iam.gserviceaccount.com'; // بريد حساب الخدمة
  const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n'); // استبدال \n بالسطر الجديد
  const spreadsheetId = '15qQqToX86S1hcc3lH9qqYoxb907R7nTdK697q3Fyz10'; // معرف Google Sheets

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'], // إذن القراءة فقط
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    // قراءة البيانات من ورقة Usdt1 من A إلى E
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Usdt1!A:E', // النطاق الذي سيتم قراءته
    });
    return response.data.values; // إرجاع القيم المقروءة
  } catch (error) {
    console.error('Error reading sheet:', error);
    throw error;
  }
}

// إعداد Express للتعامل مع الطلبات
app.use(express.json()); // للتعامل مع البيانات التي يتم إرسالها بتنسيق JSON

// نقطة النهاية لقراءة البيانات من الشيت باستخدام GET
app.get('/row', async (req, res) => {
  try {
    const rows = await getSheetData(); // قراءة البيانات من Google Sheets
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'No data found in the sheet' });
    }
    res.status(200).json({ data: rows }); // إرسال البيانات في الرد
  } catch (error) {
    console.error('Error during reading data:', error); // تسجيل التفاصيل حول الخطأ
    res.status(500).json({ error: 'Failed to read data', details: error.message });
  }
});

// تشغيل الخادم على رابط Render
app.listen(PORT, () => {
  console.log(`Server is running on https://your-app-name.onrender.com`);
});

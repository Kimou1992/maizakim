const express = require('express');
const { google } = require('googleapis');

const app = express();
const PORT = 3000;

// إعداد Google Sheets API
async function getSheetData() {
  const clientEmail = 'tgbot-618@citric-gradient-447312-g8.iam.gserviceaccount.com'; // بريد حساب الخدمة
  const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n'); // استبدال \n بالسطر الجديد
 // المفتاح الخاص من متغير البيئة
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
    // قراءة الصف الأول من ورقة Usdt1
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Usdt1!1:1', // استرجاع الصف الأول من ورقة Usdt1
    });
    return response.data.values[0]; // الصف الأول
  } catch (error) {
    console.error('Error reading sheet:', error);
    throw error;
  }
}

// نقطة النهاية لاسترجاع الصف الأول من ورقة Usdt1
app.get('/row', async (req, res) => {
  try {
    const row = await getSheetData();
    res.status(200).json({ row });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  }
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

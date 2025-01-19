const express = require('express');
const { google } = require('googleapis');

// إنشاء تطبيق Express
const app = express();
const PORT = 3000; // المنفذ الذي سيعمل عليه الخادم

// Middleware لتحليل بيانات JSON
app.use(express.json());

// إعداد Google Sheets API
async function updateSheet(data) {
  // بيانات Google Service Account
  const clientEmail = 'tgbot-618@citric-gradient-447312-g8.iam.gserviceaccount.com'; // بريد حساب الخدمة
  const privateKey = process.env.PRIVATE_KEY; // المفتاح الخاص من متغير البيئة
  const spreadsheetId = '15qQqToX86S1hcc3lH9qqYoxb907R7nTdK697q3Fyz10'; // معرف Google Sheets

  // إعداد المصادقة
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // الحصول على عميل مصدّق
  const client = await auth.getClient();

  // إعداد طلب التحديث
  const sheets = google.sheets({ version: 'v4', auth: client });
  const request = {
    spreadsheetId,
    range: 'Sheet1!A1', // النطاق المراد تحديثه
    valueInputOption: 'RAW',
    resource: {
      values: [
        [data], // البيانات القادمة من الطلب
      ],
    },
  };

  try {
    const response = await sheets.spreadsheets.values.update(request);
    console.log('Data updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating sheet:', error);
    throw error;
  }
}

// نقطة النهاية لتلقي طلب POST
app.post('/update', async (req, res) => {
  const { data } = req.body; // الحصول على البيانات من الطلب
  if (!data) {
    return res.status(400).json({ error: 'No data provided' });
  }

  try {
    await updateSheet(data);
    res.status(200).json({ message: 'Data updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update data', details: error.message });
  }
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

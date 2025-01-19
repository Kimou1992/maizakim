const express = require('express');
const { google } = require('googleapis');

const app = express();
const PORT = 3000;

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
    scopes: ['https://www.googleapis.com/auth/spreadsheets'], // إذن القراءة والكتابة
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

// نقطة النهاية لتحديث البيانات أو إضافة بيانات جديدة
app.post('/update', express.json(), async (req, res) => {
  const { id, sellAd, buyAd, withAd, lstUpdt } = req.body;

  const newData = [id, sellAd, buyAd, withAd, lstUpdt];

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: 'tgbot-618@citric-gradient-447312-g8.iam.gserviceaccount.com',
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // إضافة البيانات الجديدة إلى الورقة (Usdt1)
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: '15qQqToX86S1hcc3lH9qqYoxb907R7nTdK697q3Fyz10',
      range: 'Usdt1!A2:E2', // تحديد نطاق الإضافة
      valueInputOption: 'RAW',
      resource: {
        values: [newData]
      },
    });

    res.status(200).json({ message: 'Data added successfully!', data: newData });
  } catch (error) {
    console.error('Error updating sheet:', error);
    res.status(500).json({ error: 'Failed to add data', details: error.message });
  }
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

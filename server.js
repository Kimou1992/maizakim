const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; // استخدام المتغير البيئي PORT في حالة نشره على Render

// إعداد Google Sheets API
async function updateSheetData(data) {
  const clientEmail = 'tgbot-618@citric-gradient-447312-g8.iam.gserviceaccount.com'; // بريد حساب الخدمة
  const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n'); // استبدال \n بالسطر الجديد
  const spreadsheetId = '15qQqToX86S1hcc3lH9qqYoxb907R7nTdK697q3Fyz10'; // معرف Google Sheets

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'], // إذن الكتابة
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    // تحديد البيانات التي سيتم تحديثها في الصف الأول (مثال: row[0] و row[4])
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Usdt1!A1:E1', // تحديث الخلايا من A1 إلى E1 في ورقة Usdt1
      valueInputOption: 'RAW', // لإدخال البيانات مباشرة
      resource: {
        values: [
          [data.id, data.sellAd, data.buyAd, data.withAd, data.lstUpdt], // البيانات التي سيتم إدخالها
        ],
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating sheet:', error);
    throw error;
  }
}

// إعداد Express للتعامل مع الطلبات
app.use(cors()); // يسمح بالوصول من أي نطاق
app.use(express.json()); // للتعامل مع البيانات التي يتم إرسالها بتنسيق JSON

// نقطة النهاية لاستقبال بيانات الـ POST
app.post('/update', async (req, res) => {
  try {
    const data = req.body; // بيانات الـ POST المرسلة من الـ HTML
    console.log('Received data:', data); // لتسجيل البيانات المستلمة

    // التحقق من البيانات المرسلة
    if (!data.id || !data.sellAd || !data.buyAd || !data.withAd || !data.lstUpdt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updatedData = await updateSheetData(data); // تحديث البيانات في Google Sheets
    res.status(200).json({ message: 'Data updated successfully', data: updatedData });
  } catch (error) {
    console.error('Error during update:', error); // تسجيل التفاصيل حول الخطأ
    res.status(500).json({ error: 'Failed to update data', details: error.message });
  }
});

// تشغيل الخادم على رابط Render
app.listen(PORT, () => {
  console.log(`Server is running on https://your-app-name.onrender.com`);
});

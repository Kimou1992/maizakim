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

// وظيفة لتحديث البيانات في Google Sheets
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
    // قراءة البيانات لتحديد الصف المطلوب بناءً على `id`
    const readResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Usdt1!A:E', // قراءة كامل العمود الذي يحتوي على البيانات
    });

    const rows = readResponse.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('Sheet is empty or does not exist.');
    }

    // البحث عن الصف الذي يحتوي على `id`
    const rowIndex = rows.findIndex(row => row[0] === data.id);
    if (rowIndex === -1) {
      throw new Error(`No row found with ID: ${data.id}`);
    }

    // تحديد النطاق بناءً على الصف الذي يحتوي على `id`
    const updateRange = `Usdt1!A${rowIndex + 1}:E${rowIndex + 1}`;
    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: 'RAW',
      resource: {
        values: [[data.id, data.sellAd, data.buyAd, data.withAd, data.lstUpdt]],
      },
    });

    return updateResponse.data;
  } catch (error) {
    console.error('Error updating sheet:', error);
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

// نقطة النهاية لتحديث البيانات باستخدام POST
app.post('/update', async (req, res) => {
  try {
    const data = req.body; // البيانات المرسلة من الـ HTML عبر POST
    console.log('Received data:', data);

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
         

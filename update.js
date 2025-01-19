const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; // استخدام المتغير البيئي PORT عند النشر على Render

// إعداد CORS
const corsOptions = {
  origin: '*', // يسمح بالوصول من أي نطاق
  methods: ['POST'], // السماح بطلبات POST فقط
  allowedHeaders: ['Content-Type'], // السماح بالرؤوس المحددة
};

app.use(cors(corsOptions)); // تمكين CORS
app.use(express.json()); // للتعامل مع البيانات المرسلة بتنسيق JSON

// إعداد Google Sheets API
const clientEmail = 'tgbot-618@citric-gradient-447312-g8.iam.gserviceaccount.com'; // بريد حساب الخدمة
const spreadsheetId = '15qQqToX86S1hcc3lH9qqYoxb907R7nTdK697q3Fyz10'; // معرف Google Sheets

// وظيفة لتحديث البيانات في Google Sheets
async function updateSheetDataById(data) {
  const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n'); // استبدال \n بالسطر الجديد

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
    // جلب كافة الصفوف من ورقة العمل
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Usdt1!A:E', // نطاق البيانات
    });

    const rows = getResponse.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No data found in the sheet');
    }

    // البحث عن الصف بناءً على ID
    const rowIndex = rows.findIndex(row => row[0] === data.id); // العمود الأول هو ID
    if (rowIndex === -1) {
      throw new Error(`Row with ID ${data.id} not found`);
    }

    // تحديث الصف المحدد
    const updateRange = `Usdt1!A${rowIndex + 1}:E${rowIndex + 1}`; // تحديد نطاق الصف
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: 'RAW',
      resource: {
        values: [
          [data.id, data.sellAd, data.buyAd, data.withAd, data.lstUpdt], // القيم الجديدة
        ],
      },
    });

    return { success: true, updatedRange: updateRange };
  } catch (error) {
    console.error('Error updating sheet:', error);
    throw error;
  }
}

// نقطة النهاية لتحديث البيانات باستخدام POST
app.post('/update', async (req, res) => {
  try {
    const data = req.body; // البيانات المرسلة من العميل
    console.log('Received data:', data);

    // التحقق من وجود جميع الحقول المطلوبة
    if (!data.id || !data.sellAd || !data.buyAd || !data.withAd || !data.lstUpdt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // تحديث البيانات في Google Sheets
    const result = await updateSheetDataById(data);
    res.status(200).json({ message: 'Data updated successfully', result });
  } catch (error) {
    console.error('Error during update:', error);
    res.status(500).json({ error: 'Failed to update data', details: error.message });
  }
});

// تشغيل الخادم على Render
app.listen(PORT, () => {
  console.log(`Server is running on https://your-app-name.onrender.com`);
});
  

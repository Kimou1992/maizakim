const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// إعداد CORS
app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json()); // التعامل مع بيانات JSON

// إعداد Google Sheets API
async function setupGoogleSheets() {
  const clientEmail = 'tgbot-618@citric-gradient-447312-g8.iam.gserviceaccount.com';
  const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

// قراءة البيانات من Google Sheets
async function getSheetData(spreadsheetId, range) {
  const sheets = await setupGoogleSheets();
  const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  return response.data.values || [];
}

// تحديث بيانات صف معين في Google Sheets
async function updateSheetRow(spreadsheetId, range, data) {
  const sheets = await setupGoogleSheets();
  const response = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    resource: { values: [data] },
  });
  return response.data;
}

// إضافة صف جديد إلى Google Sheets
async function appendSheetRow(spreadsheetId, range, data) {
  const sheets = await setupGoogleSheets();
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    resource: { values: [data] },
  });
  return response.data;
}

// معرف Google Sheets ونطاق العمل
const SPREADSHEET_ID = '15qQqToX86S1hcc3lH9qqYoxb907R7nTdK697q3Fyz10';
const RANGE = 'Usdt1!A:E';

// نقطة النهاية لقراءة البيانات
app.get('/rows', async (req, res) => {
  try {
    const rows = await getSheetData(SPREADSHEET_ID, RANGE);
    if (!rows.length) return res.status(404).json({ message: 'No data found in the sheet' });
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Failed to read data', details: error.message });
  }
});

// نقطة النهاية لتحديث صف معين
app.post('/update', async (req, res) => {
  try {
    const { id, sellAd, buyAd, withAd, lstUpdt } = req.body;
    if (!id || !sellAd || !buyAd || !withAd || !lstUpdt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const rows = await getSheetData(SPREADSHEET_ID, RANGE);
    const rowIndex = rows.findIndex((row) => row[0] === id); // البحث عن الصف حسب المعرف (ID)
    if (rowIndex === -1) {
      return res.status(404).json({ error: 'Row not found for the given ID' });
    }

    const range = `Usdt1!A${rowIndex + 1}:E${rowIndex + 1}`; // تحديد النطاق بناءً على الصف
    const updatedData = await updateSheetRow(SPREADSHEET_ID, range, [id, sellAd, buyAd, withAd, lstUpdt]);
    res.status(200).json({ message: 'Row updated successfully', data: updatedData });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Failed to update data', details: error.message });
  }
});

// نقطة النهاية لإضافة صف جديد
app.post('/add', async (req, res) => {
  try {
    const { id, sellAd, buyAd, withAd, lstUpdt } = req.body;
    if (!id || !sellAd || !buyAd || !withAd || !lstUpdt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const addedData = await appendSheetRow(SPREADSHEET_ID, RANGE, [id, sellAd, buyAd, withAd, lstUpdt]);
    res.status(200).json({ message: 'Row added successfully', data: addedData });
  } catch (error) {
    console.error('Error adding row:', error);
    res.status(500).json({ error: 'Failed to add row', details: error.message });
  }
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`Server is running on https://your-app-name.onrender.com`);
});
           

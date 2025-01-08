require('dotenv').config(); // لتحميل المتغيرات البيئية من ملف .env
const mysql = require('mysql2');

// إعداد الاتصال بقاعدة البيانات باستخدام المتغيرات البيئية
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// الاتصال بقاعدة البيانات والتحقق من الاتصال
connection.connect(err => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
});

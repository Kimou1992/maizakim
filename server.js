// استيراد مكتبة dotenv لتحميل المتغيرات البيئية
require('dotenv').config({ path: '/storage/emulated/0/myfiles/.env' });

// استيراد مكتبة pg
const { Client } = require('pg');

// استخراج الرابط الكامل من متغير البيئة
const dataUrl = process.env.DATA_URL;

// التحقق إذا كانت القيمة موجودة أم لا
if (!dataUrl) {
  console.error('DATA_URL is not defined in the .env file');
  process.exit(1); // إيقاف التنفيذ إذا لم يكن هناك رابط
}

// استخدام URL لتحليل الرابط
const url = new URL(dataUrl);

// إعدادات الاتصال بقاعدة البيانات باستخدام البيانات من DATA_URL
const client = new Client({
  host: url.hostname,
  port: url.port || 5432,  // استخدم المنفذ 5432 إذا لم يكن مذكورًا في الرابط
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1) // إزالة "/" من بداية اسم القاعدة
});

// طباعة تفاصيل الاتصال للتأكد من القيم
console.log('Connecting with the following details:');
console.log('Host:', url.hostname);
console.log('User:', url.username);
console.log('Database:', url.pathname.slice(1));
console.log('Port:', url.port || 5432);

// محاولة الاتصال بقاعدة البيانات
client.connect()
  .then(() => {
    console.log('Connected to the database successfully!');
  })
  .catch(err => {
    console.error('Error connecting to the database', err.stack);
  });

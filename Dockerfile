# استخدم صورة Node.js المناسبة
FROM node:14

# تعيين مجلد العمل في الحاوية
WORKDIR /usr/src/app

# نسخ جميع الملفات من المجلد المحلي إلى الحاوية
COPY . .

# نسخ ملف .env إذا كنت تستخدمه لتخزين المتغيرات البيئية
COPY .env .env

# تثبيت الحزم
RUN npm install

# كشف المنفذ 3000
EXPOSE 3000

# تشغيل التطبيق باستخدام npm start
CMD ["npm", "start"]

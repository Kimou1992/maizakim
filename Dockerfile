# اختيار صورة الأساس من Node.js
FROM node:14

# تعيين الدليل الرئيسي للعمل
WORKDIR /app

# نسخ الملفات الضرورية
COPY package.json package-lock.json ./

# تثبيت الحزم
RUN npm install

# نسخ باقي الملفات
COPY . .

# فتح المنفذ الذي سيعمل عليه الخادم
EXPOSE 3000

# تشغيل التطبيق
CMD ["npm", "start"]

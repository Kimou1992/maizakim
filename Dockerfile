# استخدام صورة Node.js
FROM node:16

# تعيين المجلد للعمل
WORKDIR /app

# نسخ ملفات المشروع إلى المجلد
COPY package.json package-lock.json ./

# تثبيت التبعيات
RUN npm install

# نسخ جميع الملفات الأخرى
COPY . .

# تحديد المنفذ الذي سيستمع عليه التطبيق
EXPOSE 3000

# بدء التطبيق
CMD ["npm", "start"]

# استخدام صورة Node.js
FROM node:16

# تعيين المجلد للعمل
WORKDIR /app

# نسخ ملفات المشروع إلى المجلد
COPY package.json ./

# تثبيت التبعيات دون الحاجة إلى package-lock.json
RUN npm install --no-package-lock

# نسخ جميع الملفات الأخرى
COPY . .

# تحديد المنفذ الذي سيستمع عليه التطبيق
EXPOSE 3000

# بدء التطبيق
CMD ["npm", "start"]

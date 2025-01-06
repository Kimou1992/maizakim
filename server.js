const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// تمكين الطلبات من إرسال بيانات بتنسيق JSON
app.use(express.json());

// مسار ملف JSON الذي يحتوي على بيانات المستخدمين
const dataFilePath = path.join(__dirname, 'users.json');

// نقطة النهاية للحصول على بيانات مستخدم معين
app.get('/api/getUser/:id', (req, res) => {
  const userId = req.params.id;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading file' });
    }

    let users = JSON.parse(data);
    const user = users.find(u => u.id == userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // إرجاع بيانات المستخدم
  });
});

// نقطة النهاية لإضافة بيانات مستخدم جديد
app.post('/api/addUser', (req, res) => {
  const newUser = req.body;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading file' });
    }

    let users = JSON.parse(data);
    users.push(newUser); // إضافة المستخدم الجديد إلى المصفوفة

    fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error writing to file' });
      }
      res.status(201).json(newUser); // إرجاع المستخدم الذي تم إضافته
    });
  });
});

// نقطة النهاية لتحديث بيانات مستخدم
app.put('/api/updateUser/:id', (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading file' });
    }

    let users = JSON.parse(data);
    let user = users.find(u => u.id == userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user = { ...user, ...updatedData }; // دمج البيانات الجديدة مع البيانات القديمة
    users = users.map(u => u.id == userId ? user : u); // تحديث البيانات في المصفوفة

    fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error writing to file' });
      }
      res.json(user); // إرجاع البيانات المحدثة للمستخدم
    });
  });
});

// نقطة النهاية لحذف بيانات مستخدم
app.delete('/api/deleteUser/:id', (req, res) => {
  const userId = req.params.id;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading file' });
    }

    let users = JSON.parse(data);
    const userExists = users.some(u => u.id == userId);

    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    users = users.filter(u => u.id != userId); // إزالة المستخدم من المصفوفة

    fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error writing to file' });
      }
      res.status(204).end(); // رد بنجاح دون محتوى
    });
  });
});

// بدء الخادم
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

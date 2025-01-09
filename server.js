const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// إعداد قاعدة البيانات
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // هام عند استخدام PostgreSQL على Render
  },
});

// إعدادات التطبيق
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));

// عرض الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// إضافة بيانات جديدة
app.post("/add", async (req, res) => {
  const { firstName, lastName, address } = req.body;

  try {
    await pool.query(
      "INSERT INTO users (first_name, last_name, address) VALUES ($1, $2, $3)",
      [firstName, lastName, address]
    );
    res.send("تمت إضافة البيانات بنجاح!");
  } catch (err) {
    console.error(err);
    res.status(500).send("حدث خطأ أثناء إضافة البيانات.");
  }
});

// عرض البيانات
app.get("/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("حدث خطأ أثناء عرض البيانات.");
  }
});

app.listen(port, () => {
  console.log(`الخادم يعمل على المنفذ ${port}`);
});

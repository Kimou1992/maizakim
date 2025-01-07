const express = require('express');
const { Client } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to PostgreSQL database
const client = new Client({
  connectionString: process.env.DATABASE_URL, // استخدام المتغير البيئي
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Route to handle POST requests
app.post('/data', (req, res) => {
  const { firstName, lastName, address } = req.body;
  
  const query = 'INSERT INTO users (first_name, last_name, address) VALUES ($1, $2, $3) RETURNING *';
  const values = [firstName, lastName, address];
  
  client.query(query, values)
    .then(result => {
      res.json({ message: 'Data received and stored', data: result.rows[0] });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

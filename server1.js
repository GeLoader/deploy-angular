const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');
const bcrypt = require('bcrypt'); // Add bcrypt for password hashing

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const config = {
  user: 'aris',
  password: 'Rv2NMc!hZ_q0',
  server: 'den1.mssql7.gear.host',
  database: 'aris',
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  },
};

// Use connection pool for better performance
const pool = new sql.ConnectionPool(config);

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Hash and salt the password before querying the database
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.connect();

    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hashedPassword)
      .query('SELECT email, password FROM tbl_user WHERE email = @email AND password = @password');

    if (result.recordset.length > 0) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await pool.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

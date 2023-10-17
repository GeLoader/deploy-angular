const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors'); 
const app = express();
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

sql.connect(config, (err, connection) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected to MSSQL database');
    conn = connection; 
  }
});

  
app.post('/login', (req, res) => {
  const { email, password } = req.body;
 
  const query = 'SELECT * FROM tbl_user WHERE email = @Email AND password = @Password';

  const request = new sql.Request();
  request.input('Email', sql.NVarChar, email);
  request.input('Password', sql.NVarChar, password);

  request.query(query, (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.recordset.length === 1) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false });
    }
  });
});


 


 
 
 

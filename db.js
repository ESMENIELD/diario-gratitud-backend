const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then(() => {
    console.log('✅ Conexión exitosa a MySQL');
  })
  .catch(err => {
    console.error('❌ Error al conectar a MySQL:', err);
  });

module.exports = pool;

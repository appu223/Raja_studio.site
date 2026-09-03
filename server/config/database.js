const mysql = require('mysql2/promise');
const config = require('./config');

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: config.db.connectionLimit,
  queueLimit: 0,
});

// Test connection on boot
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`[Database] Connected successfully to MySQL: "${config.db.name}"`);
    connection.release();
  } catch (error) {
    console.error(`[Database Error] Could not connect to MySQL "${config.db.name}":`, error.message);
    console.error('Make sure XAMPP MySQL is running and you created the "raja_studio" database.');
  }
})();

module.exports = pool;
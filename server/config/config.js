const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const sslCa = process.env.DB_SSL_CA
  ? fs.readFileSync(process.env.DB_SSL_CA)
  : undefined;

module.exports = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_key_raja_studio_2025',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    name: process.env.DB_NAME || 'raja_studio',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    connectionLimit: 10,

    ssl: sslCa
      ? {
          ca: sslCa,
          rejectUnauthorized: true,
        }
      : undefined,
  },
};
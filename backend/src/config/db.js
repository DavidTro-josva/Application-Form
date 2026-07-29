/**
 * ========================================================
 * HAPPY KIDS SCHOOL - MYSQL CONNECTION POOL CONFIG
 * Uses mysql2/promise for clean async/await & pooling
 * ========================================================
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'happy_kids_school',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

/**
 * Test database connectivity on startup
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database Connected Successfully to `' + (process.env.DB_NAME || 'happy_kids_school') + '`');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL Database Connection Error:', error.message || error.code || error.toString());
    console.error('💡 Ensure MySQL service is running and credentials in /backend/.env are correct.');
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
};

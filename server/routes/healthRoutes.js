const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET /api/health
router.get('/', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const [result] = await pool.query('SELECT 1 + 1 AS health');
    if (result && result.length > 0) {
      dbStatus = 'connected';
    }
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  res.status(200).json({
    success: true,
    message: 'Raja Studio API is running',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

module.exports = router;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Health check: used by us now, and by Docker/AWS monitoring later.
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    console.error('Health check failed:', err.message);
    res.status(500).json({ status: 'error', database: 'unreachable' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`FixIT API listening on port ${PORT}`));
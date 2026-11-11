require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

// Refuse to start without a real JWT secret.
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET is missing or too short (need 32+ characters). Check backend/.env');
  process.exit(1);
}

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

app.use('/api/auth', require('./routes/auth'));

// Catch-all error handler: logs the real error, sends a safe message.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`FixIT API listening on port ${PORT}`));
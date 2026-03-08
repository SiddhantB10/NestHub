const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(null, true); // allow all in production for now
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

connectDB();

app.use('/api/auth', require('../routes/auth'));
app.use('/api/hostels', require('../routes/hostels'));
app.use('/api/bookings', require('../routes/bookings'));
app.use('/api/maintenance', require('../routes/maintenance'));
app.use('/api/admin', require('../routes/admin'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;

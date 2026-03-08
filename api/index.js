const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../backend/config/db');

dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

connectDB();

app.use('/api/auth', require('../backend/routes/auth'));
app.use('/api/hostels', require('../backend/routes/hostels'));
app.use('/api/bookings', require('../backend/routes/bookings'));
app.use('/api/maintenance', require('../backend/routes/maintenance'));
app.use('/api/admin', require('../backend/routes/admin'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;

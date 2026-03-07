const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  roomType: { type: String, required: true },
  moveInDate: { type: Date, required: true },
  leaseDuration: { type: Number, required: true },
  leaseEndDate: Date,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'waitlisted', 'cancelled', 'completed'],
    default: 'pending',
  },
  documents: [{
    name: String,
    url: String,
    verified: { type: Boolean, default: false },
  }],
  monthlyRent: Number,
  payments: [{
    month: String,
    amount: Number,
    paidAt: Date,
    receiptId: String,
    status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);

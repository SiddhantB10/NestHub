const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['plumbing', 'electrical', 'furniture', 'cleaning', 'pest-control', 'other'],
    required: true,
  },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  status: {
    type: String,
    enum: ['submitted', 'in-progress', 'resolved', 'closed'],
    default: 'submitted',
  },
  images: [String],
  resolvedAt: Date,
  adminNotes: String,
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceRequest', maintenanceSchema);

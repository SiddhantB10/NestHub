const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Number, default: 0 },
  total: { type: Number, required: true },
});

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, enum: ['boys', 'girls', 'unisex'], required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  area: { type: String, required: true },
  distanceFromNMIMS: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  residentSatisfaction: { type: Number, default: 0 },
  images: [String],
  facilities: [String],
  internetSpeed: String,
  foodMenu: {
    breakfast: [String],
    lunch: [String],
    dinner: [String],
  },
  visitorPolicy: String,
  curfewTime: String,
  roomTypes: [roomTypeSchema],
  location: {
    lat: Number,
    lng: Number,
  },
  leaseOptions: [Number],
  contactPhone: String,
  contactEmail: String,
  rules: [String],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

hostelSchema.index({ area: 1, type: 1 });
hostelSchema.index({ distanceFromNMIMS: 1 });

module.exports = mongoose.model('Hostel', hostelSchema);

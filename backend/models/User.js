const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ['student', 'parent', 'admin'], default: 'student' },
  parentEmail: String,
  currentHostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' },
  moveInDate: Date,
  leaseEndDate: Date,
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
  preferences: {
    budget: { min: Number, max: Number },
    gender: String,
    maxDistance: Number,
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

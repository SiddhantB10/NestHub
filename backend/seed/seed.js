const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hostel = require('../models/Hostel');
const User = require('../models/User');
const { hostelData } = require('./data');

dotenv.config();

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/staynmims';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding');

    await Hostel.deleteMany({});
    await Hostel.insertMany(hostelData);
    console.log(`Seeded ${hostelData.length} hostels`);

    const adminExists = await User.findOne({ email: 'admin@staynmims.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@staynmims.com',
        password: 'admin123456',
        role: 'admin',
        phone: '+91 98765 43210',
      });
      console.log('Admin user created');
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();

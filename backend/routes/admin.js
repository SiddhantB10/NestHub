const express = require('express');
const Hostel = require('../models/Hostel');
const Booking = require('../models/Booking');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.use(auth, adminOnly);

router.get('/stats', async (req, res) => {
  try {
    const totalHostels = await Hostel.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingMaintenance = await MaintenanceRequest.countDocuments({ status: { $in: ['submitted', 'in-progress'] } });

    res.json({ totalHostels, totalBookings, activeBookings, pendingMaintenance });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

router.post('/hostels', async (req, res) => {
  try {
    const hostel = await Hostel.create(req.body);
    res.status(201).json(hostel);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create hostel', error: error.message });
  }
});

router.put('/hostels/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
    res.json(hostel);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update hostel', error: error.message });
  }
});

router.get('/maintenance', async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate('user', 'name email')
      .populate('hostel', 'name')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests', error: error.message });
  }
});

router.patch('/maintenance/:id', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const update = { status, adminNotes };
    if (status === 'resolved') update.resolvedAt = new Date();

    const request = await MaintenanceRequest.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update request', error: error.message });
  }
});

router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('hostel', 'name')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
});

module.exports = router;

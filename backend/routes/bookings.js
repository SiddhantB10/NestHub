const express = require('express');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { hostelId, roomType, moveInDate, leaseDuration, monthlyRent } = req.body;
    const leaseEndDate = new Date(moveInDate);
    leaseEndDate.setMonth(leaseEndDate.getMonth() + leaseDuration);

    const booking = await Booking.create({
      user: req.user.id,
      hostel: hostelId,
      roomType,
      moveInDate,
      leaseDuration,
      leaseEndDate,
      monthlyRent,
      status: 'pending',
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('hostel')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
});

router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Cancellation failed', error: error.message });
  }
});

module.exports = router;

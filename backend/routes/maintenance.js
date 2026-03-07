const express = require('express');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { hostelId, title, description, category, priority } = req.body;
    const request = await MaintenanceRequest.create({
      user: req.user.id,
      hostel: hostelId,
      title,
      description,
      category,
      priority,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit request', error: error.message });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ user: req.user.id })
      .populate('hostel', 'name')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests', error: error.message });
  }
});

module.exports = router;

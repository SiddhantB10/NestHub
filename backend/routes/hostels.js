const express = require('express');
const Hostel = require('../models/Hostel');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { type, minBudget, maxBudget, maxDistance, area, search } = req.query;
    const filter = { isActive: true };

    if (type && type !== 'all') filter.type = type;
    if (area) filter.area = { $regex: area, $options: 'i' };
    if (maxDistance) filter.distanceFromNMIMS = { $lte: parseFloat(maxDistance) };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { area: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let hostels = await Hostel.find(filter).sort({ rating: -1 });

    if (minBudget || maxBudget) {
      hostels = hostels.filter(h => {
        const cheapest = Math.min(...h.roomTypes.map(r => r.price));
        if (minBudget && cheapest < parseInt(minBudget)) return false;
        if (maxBudget && cheapest > parseInt(maxBudget)) return false;
        return true;
      });
    }

    res.json(hostels);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch hostels', error: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ slug: req.params.slug, isActive: true });
    if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
    res.json(hostel);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch hostel', error: error.message });
  }
});

router.get('/:slug/availability', async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ slug: req.params.slug });
    if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
    res.json(hostel.roomTypes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch availability', error: error.message });
  }
});

module.exports = router;

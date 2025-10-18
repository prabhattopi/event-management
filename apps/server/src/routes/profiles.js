import express from 'express';
import Profile from '../models/Profile.js';

const router = express.Router();

// Get all profiles
router.get('/', async (req, res) => {
  const profiles = await Profile.find();
  res.json(profiles);
});

// Create profile
router.post('/', async (req, res) => {
  const { name, timezone } = req.body;
  const profile = await Profile.create({ name, timezone });
  res.json(profile);
});

// Update profile timezone
router.patch('/:id', async (req, res) => {
  const { timezone } = req.body;
  const profile = await Profile.findByIdAndUpdate(req.params.id, { timezone }, { new: true });
  res.json(profile);
});

export default router;
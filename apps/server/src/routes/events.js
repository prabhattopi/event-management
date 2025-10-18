import express from 'express';
import Event from '../models/Event.js';
import EventLog from '../models/EventLog.js';
import { toUtc } from '../utils/time.js';

const router = express.Router();

// Create Event
router.post('/', async (req, res) => {
  const { profiles, eventTz, startLocalISO, endLocalISO } = req.body;
  const startUtc = toUtc(startLocalISO, eventTz);
  const endUtc = toUtc(endLocalISO, eventTz);

  if (endUtc < startUtc) return res.status(400).json({ error: 'End must be after start' });

  const event = await Event.create({ profiles, eventTz, startUtc, endUtc });
  res.json(event); // Return UTC values
});

// Get Events for a profile (raw UTC)
router.get('/', async (req, res) => {
  const { profileId } = req.query;
  const events = await Event.find({ profiles: profileId }).populate('profiles');
  res.json(events); // Return UTC values
});

// Update Event
router.patch('/:id', async (req, res) => {
  const { profiles, eventTz, startLocalISO, endLocalISO } = req.body;
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const old = { ...event.toObject() };

  // Apply updates
  if (profiles) event.profiles = profiles;
  if (eventTz) event.eventTz = eventTz;
  if (startLocalISO) event.startUtc = toUtc(startLocalISO, eventTz || event.eventTz);
  if (endLocalISO) event.endUtc = toUtc(endLocalISO, eventTz || event.eventTz);
  event.updatedAtUtc = new Date();
  await event.save();

  // ✅ Build changes array
  const changes = [];

  // Profiles change
  if (old.profiles.toString() !== event.profiles.toString()) {
    changes.push({
      field: 'profiles',
      old: old.profiles.map(String).join(','),
      new: event.profiles.map(String).join(',')
    });
  }

  // Event timezone change
  if (old.eventTz !== event.eventTz) {
    changes.push({
      field: 'eventTz',
      old: old.eventTz || '',
      new: event.eventTz || ''
    });
  }

  // Start time change
  if (old.startUtc.getTime() !== event.startUtc.getTime()) {
    changes.push({
      field: 'startUtc',
      old: old.startUtc.toISOString(),
      new: event.startUtc.toISOString()
    });
  }

  // End time change
  if (old.endUtc.getTime() !== event.endUtc.getTime()) {
    changes.push({
      field: 'endUtc',
      old: old.endUtc.toISOString(),
      new: event.endUtc.toISOString()
    });
  }

  // ✅ Save log if there are changes
  if (changes.length) {
    await EventLog.create({
      eventId: event._id,
      changes,
      changedAtUtc: new Date()
    });
  }

  res.json(event); // Return updated event in UTC
});

// Logs (raw UTC)
router.get('/logs/:id', async (req, res) => {
  const logs = await EventLog.find({ eventId: req.params.id });
  res.json(logs); // Return UTC values
});

export default router;
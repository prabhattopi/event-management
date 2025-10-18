import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  changes: [{ field: String, old: String, new: String }],
  changedAtUtc: { type: Date, default: Date.now }
});

export default mongoose.model('EventLog', logSchema);
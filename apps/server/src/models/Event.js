import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
  eventTz: { type: String, required: true }, // timezone used for input
  startUtc: { type: Date, required: true },
  endUtc: { type: Date, required: true },
  createdAtUtc: { type: Date, default: Date.now },
  updatedAtUtc: { type: Date }
});

export default mongoose.model('Event', eventSchema);
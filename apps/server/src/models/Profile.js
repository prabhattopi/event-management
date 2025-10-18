import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  timezone: { type: String, required: true }
});

export default mongoose.model('Profile', profileSchema);
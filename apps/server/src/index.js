import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import profileRoutes from './routes/profiles.js';
import eventRoutes from './routes/events.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN.split(','), credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Routes
app.use('/api/profiles', profileRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => res.send('Event Management API Running ✅'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
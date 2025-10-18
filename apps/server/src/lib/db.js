import mongoose from 'mongoose'

export async function connectDB(uri) {
  if (!uri) throw new Error('MONGODB_URI missing')
  await mongoose.connect(uri)
  console.log('✅ MongoDB connected')
}

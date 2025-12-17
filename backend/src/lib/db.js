import mongoose from 'mongoose';

export const connectDB = async (mongoURL) => {
  try {

    const conn = await mongoose.connect(process.env.MONGODB_URL)
    console.log(`MongoDB connected: ${conn.connection.host}`);
  
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using Mongoose.
 * Exits the process on failure — the app shouldn't run against a dead DB.
 */
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect is handled by the driver.');
    });
  } catch (error) {
    console.error(`MongoDB initial connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

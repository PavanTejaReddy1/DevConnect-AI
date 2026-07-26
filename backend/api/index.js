import app from '../src/app.js';
import connectDB from '../src/config/db.js';

// Connect to MongoDB
let isConnected = false;

export default async function handler(req, res) {
  // Connect to MongoDB if not already connected
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      return res.status(500).json({ success: false, message: 'Database connection failed' });
    }
  }

  // Handle the request with Express app
  return app(req, res);
}

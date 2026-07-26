import app from '../src/app.js';
import connectDB from '../src/config/db.js';

// Connect to MongoDB
let isConnected = false;

export default async function handler(req, res) {
  // Set timeout for the handler
  res.setTimeout(30000, () => {
    console.error('Request timeout');
    res.status(504).json({ success: false, message: 'Request timeout' });
  });

  try {
    // Connect to MongoDB if not already connected
    if (!isConnected) {
      console.log('Connecting to MongoDB...');
      await connectDB();
      isConnected = true;
      console.log('MongoDB connected successfully');
    }

    // Handle the request with Express app
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
}

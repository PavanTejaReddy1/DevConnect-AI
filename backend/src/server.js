import 'dotenv/config';
import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import { initializeSocket } from './socket/socketServer.js';

const PORT = process.env.PORT || 5000;

await connectDB();

const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`DevConnect AI API listening on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

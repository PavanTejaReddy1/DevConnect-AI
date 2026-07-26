import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import app from './app.js';
import connectDB from './config/db.js';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';
import User from './models/User.js';

const PORT = process.env.PORT || 5000;

await connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Store online users
const onlineUsers = new Map();

// Authentication middleware for Socket.io
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {

  // Add user to online users
  onlineUsers.set(socket.user._id.toString(), socket.id);

  // Broadcast online status
  socket.broadcast.emit('user:online', {
    userId: socket.user._id,
    name: socket.user.name,
  });

  // Join user's conversations
  Conversation.find({
    'participants.user': socket.user._id,
  }).then(conversations => {
    conversations.forEach(conv => {
      socket.join(conv._id.toString());
    });
  });

  // Join typing indicator room
  socket.on('join:conversation', (conversationId) => {
    socket.join(conversationId);
  });

  // Leave conversation
  socket.on('leave:conversation', (conversationId) => {
    socket.leave(conversationId);
  });

  // Typing indicator
  socket.on('typing:start', async ({ conversationId }) => {
    const conversation = await Conversation.findById(conversationId);
    if (conversation && conversation.participants.some(p => p.user.toString() === socket.user._id.toString())) {
      // Add user to typing list
      if (!conversation.typingUsers.includes(socket.user._id)) {
        conversation.typingUsers.push(socket.user._id);
        await conversation.save();
      }
      socket.to(conversationId).emit('typing:start', {
        conversationId,
        user: {
          _id: socket.user._id,
          name: socket.user.name,
        },
      });
    }
  });

  socket.on('typing:stop', async ({ conversationId }) => {
    try {
      // Validate conversationId is a valid ObjectId
      if (!conversationId || !/^[0-9a-fA-F]{24}$/.test(conversationId)) {
        return;
      }

      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        conversation.typingUsers = conversation.typingUsers.filter(id => id.toString() !== socket.user._id.toString());
        await conversation.save();
        socket.to(conversationId).emit('typing:stop', {
          conversationId,
          userId: socket.user._id,
        });
      }
    } catch (error) {
      // Error handling typing stop
    }
  });

  // Send message
  socket.on('message:send', async (data) => {
    try {
      const { conversationId, content, messageType = 'text', replyTo } = data;

      // Validate conversationId is a valid ObjectId
      if (!conversationId || !/^[0-9a-fA-F]{24}$/.test(conversationId)) {
        socket.emit('error', { message: 'Invalid conversation ID' });
        return;
      }

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        socket.emit('error', { message: 'Conversation not found' });
        return;
      }

      const isParticipant = conversation.participants.some(
        p => p.user.toString() === socket.user._id.toString()
      );

      if (!isParticipant) {
        socket.emit('error', { message: 'Not authorized' });
        return;
      }

      const message = await Message.create({
        conversation: conversationId,
        sender: socket.user._id,
        content,
        messageType,
        replyTo: replyTo || null,
      });

      // Update conversation's last message
      conversation.lastMessage = message._id;
      await conversation.save();

      // Increment unread count for all participants except sender
      for (const participant of conversation.participants) {
        if (participant.user.toString() !== socket.user._id.toString()) {
          await conversation.incrementUnread(participant.user);
        }
      }

      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name email avatarUrl')
        .populate('replyTo');

      // Broadcast to all participants in the conversation
      io.to(conversationId).emit('message:new', populatedMessage);

      // Send notification to offline users
      conversation.participants.forEach(participant => {
        if (participant.user.toString() !== socket.user._id.toString()) {
          const isOnline = onlineUsers.has(participant.user.toString());
          if (!isOnline) {
            io.to(participant.user.toString()).emit('notification:new', {
              type: 'message',
              conversationId,
              message: populatedMessage,
            });
          }
        }
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }// Validate conversationId is a valid ObjectId
      if (!conversationId || !/^[0-9a-fA-F]{24}$/.test(conversationId)) {
        return;
      }

      
  });

  // Mark as read
  socket.on('message:read', async ({ conversationId }) => {
    try {
      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        await conversation.markAsRead(socket.user._id);
        socket.to(conversationId).emit('message:read', {
          conversationId,
          userId: socket.user._id,
        });
      }
    } catch (error) {
      // Error marking as read
    }
  });

  // Add reaction
  socket.on('message:reaction', async ({ messageId, emoji }) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        socket.emit('error', { message: 'Message not found' });
        return;
      }

      const conversation = await Conversation.findById(message.conversation);
      const isParticipant = conversation.participants.some(
        p => p.user.toString() === socket.user._id.toString()
      );

      if (!isParticipant) {
        socket.emit('error', { message: 'Not authorized' });
        return;
      }

      const existingReaction = message.reactions.find(r => r.emoji === emoji);
      if (existingReaction) {
        if (!existingReaction.users.includes(socket.user._id)) {
          existingReaction.users.push(socket.user._id);
        }
      } else {
        message.reactions.push({ emoji, users: [socket.user._id] });
      }

      await message.save();

      const populatedMessage = await Message.findById(messageId)
        .populate('sender', 'name email avatarUrl')
        .populate('reactions.users', 'name email avatarUrl');

      io.to(message.conversation.toString()).emit('message:reaction', populatedMessage);
    } catch (error) {
      socket.emit('error', { message: 'Failed to add reaction' });
    }
  });

  // Disconnect
  socket.on('disconnect', async () => {

    // Remove user from online users
    onlineUsers.delete(socket.user._id.toString());

    // Update user's online status in conversations
    await Conversation.updateMany(
      { 'participants.user': socket.user._id },
      { $set: { 'participants.$.isOnline': false } }
    );

    // Broadcast offline status
    socket.broadcast.emit('user:offline', {
      userId: socket.user._id,
    });
  });
});

server.listen(PORT, () => {
  console.log(`DevConnect AI API listening on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

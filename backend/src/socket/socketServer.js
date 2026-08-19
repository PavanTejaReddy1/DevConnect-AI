import { Server } from 'socket.io';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  // Store online users
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins with their ID
    socket.on('user:join', (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      
      // Broadcast online status
      io.emit('user:online', { userId });
    });

    // Join a conversation room
    socket.on('join:room', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.userId} joined room ${conversationId}`);
    });

    // Leave a conversation room
    socket.on('leave:room', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${socket.userId} left room ${conversationId}`);
    });

    // Send message
    socket.on('send:message', async (data) => {
      try {
        const { conversationId, text, attachments, replyTo } = data;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        const message = await Message.create({
          conversation: conversationId,
          sender: socket.userId,
          text,
          attachments: attachments || [],
          replyTo,
          readBy: [socket.userId],
        });

        // Update conversation's last message
        conversation.lastMessage = message._id;
        await conversation.save();

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name username avatarUrl')
          .populate('replyTo');

        // Emit to all users in the conversation
        io.to(conversationId).emit('receive:message', populatedMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { conversationId } = data;
      socket.to(conversationId).emit('user:typing', {
        userId: socket.userId,
        conversationId,
      });
    });

    // Stop typing
    socket.on('stop:typing', (data) => {
      const { conversationId } = data;
      socket.to(conversationId).emit('user:stop:typing', {
        userId: socket.userId,
        conversationId,
      });
    });

    // Message read
    socket.on('message:read', async (data) => {
      try {
        const { conversationId, messageId } = data;

        await Message.findByIdAndUpdate(messageId, {
          $addToSet: { readBy: socket.userId },
        });

        // Emit to sender that message was read
        socket.to(conversationId).emit('message:read:receipt', {
          messageId,
          userId: socket.userId,
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('user:offline', { userId: socket.userId });
      }
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

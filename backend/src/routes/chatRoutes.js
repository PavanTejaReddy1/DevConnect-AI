import express from 'express';
import {
  getConversations,
  getConversationById,
  createConversation,
  updateConversation,
  leaveConversation,
  deleteConversation,
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  markAsRead,
  pinMessage,
  searchMessages,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';
import { body, param } from 'express-validator';

const router = express.Router();

// Validation middleware
const createConversationValidation = [
  body('type').isIn(['private', 'team', 'project', 'group']).withMessage('Invalid conversation type'),
  body('participants').isArray({ min: 1 }).withMessage('Participants must be an array'),
];

const sendMessageValidation = [
  body('conversation').notEmpty().withMessage('Conversation ID is required'),
  body('text').optional().trim().isLength({ max: 5000 }).withMessage('Text must not exceed 5000 characters'),
];

const editMessageValidation = [
  body('text').trim().isLength({ min: 1, max: 5000 }).withMessage('Text must be between 1 and 5000 characters'),
];

// Conversation routes
router.get('/conversations', protect, getConversations);
router.get('/conversations/:id', protect, getConversationById);
router.post('/conversations', protect, createConversationValidation, createConversation);
router.put('/conversations/:id', protect, updateConversation);
router.post('/conversations/:id/leave', protect, leaveConversation);
router.delete('/conversations/:id', protect, deleteConversation);
router.get('/conversations/:id/messages', protect, getMessages);
router.put('/conversations/:id/read', protect, markAsRead);
router.get('/conversations/:id/search', protect, searchMessages);

// Message routes
router.post('/messages', protect, sendMessageValidation, sendMessage);
router.put('/messages/:id', protect, editMessageValidation, editMessage);
router.delete('/messages/:id', protect, deleteMessage);
router.put('/messages/:id/pin', protect, pinMessage);

export default router;

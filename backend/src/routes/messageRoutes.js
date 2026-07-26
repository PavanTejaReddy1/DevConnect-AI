import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createConversation,
  getConversations,
  getConversation,
  getMessages,
  sendMessage,
  markAsRead,
  addReaction,
  removeReaction,
  editMessage,
  deleteMessage,
} from '../controllers/messageController.js';
import {
  createConversationValidation,
  sendMessageValidation,
  conversationIdValidation,
  messageIdValidation,
  getMessagesValidation,
  markAsReadValidation,
  addReactionValidation,
  editMessageValidation,
  deleteMessageValidation,
} from '../validations/messageValidation.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|zip|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  },
});

// Conversation routes
router.route('/conversations')
  .post(protect, createConversationValidation, validateRequest, createConversation)
  .get(protect, getConversations);

router.route('/conversations/:id')
  .get(protect, conversationIdValidation, validateRequest, getConversation);

router.post('/conversations/:conversationId/read', protect, markAsReadValidation, validateRequest, markAsRead);

// Message routes
router.route('/conversations/:conversationId/messages')
  .get(protect, getMessagesValidation, validateRequest, getMessages);

router.route('/messages')
  .post(protect, sendMessageValidation, validateRequest, sendMessage);

router.post('/messages/:messageId/reaction', protect, messageIdValidation, addReactionValidation, validateRequest, addReaction);
router.delete('/messages/:messageId/reaction/:emoji', protect, messageIdValidation, validateRequest, removeReaction);

router.put('/messages/:messageId', protect, messageIdValidation, editMessageValidation, validateRequest, editMessage);
router.delete('/messages/:messageId', protect, messageIdValidation, deleteMessageValidation, validateRequest, deleteMessage);

// File upload for messages
router.post('/messages/file', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      file: {
        name: req.file.originalname,
        url: fileUrl,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
    });
  } catch (error) {
    res.status(500);
    throw new Error('File upload failed');
  }
});

export default router;

import { body, param, query } from 'express-validator';

export const createConversationValidation = [
  body('type')
    .isIn(['private', 'project', 'team'])
    .withMessage('Invalid conversation type'),
  body('participants')
    .isArray({ min: 1 })
    .withMessage('At least one participant is required'),
  body('participants.*')
    .isMongoId()
    .withMessage('Invalid participant ID'),
  body('project')
    .optional()
    .isMongoId()
    .withMessage('Invalid project ID'),
  body('team')
    .optional()
    .isMongoId()
    .withMessage('Invalid team ID'),
];

export const sendMessageValidation = [
  body('conversation')
    .isMongoId()
    .withMessage('Invalid conversation ID'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ max: 5000 })
    .withMessage('Message must not exceed 5000 characters'),
  body('messageType')
    .optional()
    .isIn(['text', 'file', 'system'])
    .withMessage('Invalid message type'),
  body('replyTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid reply-to message ID'),
];

export const conversationIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid conversation ID'),
];

export const messageIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid message ID'),
];

export const getMessagesValidation = [
  param('conversationId')
    .isMongoId()
    .withMessage('Invalid conversation ID'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const markAsReadValidation = [
  param('conversationId')
    .isMongoId()
    .withMessage('Invalid conversation ID'),
];

export const addReactionValidation = [
  param('messageId')
    .isMongoId()
    .withMessage('Invalid message ID'),
  body('emoji')
    .trim()
    .notEmpty()
    .withMessage('Emoji is required')
    .isLength({ max: 10 })
    .withMessage('Emoji must not exceed 10 characters'),
];

export const editMessageValidation = [
  param('messageId')
    .isMongoId()
    .withMessage('Invalid message ID'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ max: 5000 })
    .withMessage('Message must not exceed 5000 characters'),
];

export const deleteMessageValidation = [
  param('messageId')
    .isMongoId()
    .withMessage('Invalid message ID'),
];

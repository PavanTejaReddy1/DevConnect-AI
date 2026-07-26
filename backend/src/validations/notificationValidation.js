import { body, param, query } from 'express-validator';

export const createNotificationValidation = [
  body('recipient')
    .isMongoId()
    .withMessage('Invalid recipient ID'),
  body('type')
    .isIn(['project', 'task', 'chat', 'ai', 'admin', 'team', 'invite', 'mention'])
    .withMessage('Invalid notification type'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 1000 })
    .withMessage('Message must not exceed 1000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority value'),
  body('project')
    .optional()
    .isMongoId()
    .withMessage('Invalid project ID'),
  body('task')
    .optional()
    .isMongoId()
    .withMessage('Invalid task ID'),
  body('team')
    .optional()
    .isMongoId()
    .withMessage('Invalid team ID'),
  body('conversation')
    .optional()
    .isMongoId()
    .withMessage('Invalid conversation ID'),
  body('message')
    .optional()
    .isMongoId()
    .withMessage('Invalid message ID'),
  body('actionUrl')
    .optional()
    .isURL()
    .withMessage('Invalid action URL'),
];

export const notificationIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid notification ID'),
];

export const getNotificationsValidation = [
  query('type')
    .optional()
    .isIn(['project', 'task', 'chat', 'ai', 'admin', 'team', 'invite', 'mention'])
    .withMessage('Invalid type filter'),
  query('isRead')
    .optional()
    .isBoolean()
    .withMessage('isRead must be a boolean'),
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
  param('id')
    .isMongoId()
    .withMessage('Invalid notification ID'),
];

export const markAllAsReadValidation = [
  body('type')
    .optional()
    .isIn(['project', 'task', 'chat', 'ai', 'admin', 'team', 'invite', 'mention'])
    .withMessage('Invalid type filter'),
];

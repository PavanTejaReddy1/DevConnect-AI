import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createNotification,
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
  getUnreadCount,
} from '../controllers/notificationController.js';
import {
  createNotificationValidation,
  notificationIdValidation,
  getNotificationsValidation,
  markAsReadValidation,
  markAllAsReadValidation,
} from '../validations/notificationValidation.js';

const router = express.Router();

// Notification CRUD
router.route('/')
  .post(protect, createNotificationValidation, validateRequest, createNotification)
  .get(protect, getNotificationsValidation, validateRequest, getNotifications);

router.route('/:id')
  .get(protect, notificationIdValidation, validateRequest, getNotification)
  .delete(protect, notificationIdValidation, validateRequest, deleteNotification);

// Mark as read
router.put('/:id/read', protect, notificationIdValidation, validateRequest, markAsRead);
router.put('/read-all', protect, markAllAsReadValidation, validateRequest, markAllAsRead);

// Clear read notifications
router.delete('/clear-read', protect, clearReadNotifications);

// Unread count
router.get('/unread-count', protect, getUnreadCount);

export default router;

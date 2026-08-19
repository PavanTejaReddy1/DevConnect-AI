import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

// @desc    Get user notifications
// @route   GET /notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const { unreadOnly, type, page = 1, limit = 20 } = req.query;

  const query = { user: req.user._id };

  if (unreadOnly === 'true') {
    query.isRead = false;
  }

  if (type) {
    query.type = type;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });

  res.json({
    success: true,
    data: { notifications, total, unreadCount, page: parseInt(page), limit: parseInt(limit) }
  });
});

// @desc    Mark notification as read
// @route   PUT /notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  if (notification.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  notification.isRead = true;
  await notification.save();

  res.json({ success: true, data: notification });
});

// @desc    Mark all notifications as read
// @route   PUT /notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true }
  );

  res.json({ success: true, message: 'All notifications marked as read' });
});

// @desc    Delete notification
// @route   DELETE /notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  if (notification.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  await Notification.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Notification deleted' });
});

// @desc    Create notification (internal use)
// @route   POST /notifications (internal)
// @access  Private
export const createNotification = asyncHandler(async (req, res) => {
  const { userId, type, title, message, link, metadata } = req.body;

  const notification = await Notification.create({
    user: userId,
    type,
    title,
    message,
    link,
    metadata,
  });

  res.status(201).json({ success: true, data: notification });
});

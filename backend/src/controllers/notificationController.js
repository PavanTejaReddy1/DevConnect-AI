import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private (admin only or system-generated)
export const createNotification = asyncHandler(async (req, res) => {
  const { recipient, type, title, message, priority, project, task, team, conversation, message: msg, actionUrl, metadata } = req.body;

  const notification = await Notification.create({
    recipient,
    type,
    title,
    message,
    priority: priority || 'medium',
    project: project || null,
    task: task || null,
    team: team || null,
    conversation: conversation || null,
    message: msg || null,
    actionUrl: actionUrl || null,
    metadata: metadata || {},
  });

  const populatedNotification = await Notification.findById(notification._id)
    .populate('recipient', 'name email avatarUrl')
    .populate('project', 'name')
    .populate('task', 'title')
    .populate('team', 'name')
    .populate('conversation', 'type');

  res.status(201).json({
    success: true,
    notification: populatedNotification,
  });
});

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const { type, isRead, page = 1, limit = 20 } = req.query;
  const userId = req.user._id;

  const query = { recipient: userId };

  if (type) {
    query.type = type;
  }

  if (isRead !== undefined) {
    query.isRead = isRead === 'true';
  }

  const skip = (page - 1) * limit;

  const notifications = await Notification.find(query)
    .populate('project', 'name')
    .populate('task', 'title')
    .populate('team', 'name')
    .populate('conversation', 'type')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

  // If no notifications found for this user, return some demo notifications
  if (total === 0 && process.env.NODE_ENV !== 'production') {
    const demoNotifications = await Notification.find()
      .populate('project', 'name')
      .populate('task', 'title')
      .populate('team', 'name')
      .populate('conversation', 'type')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    return res.json({
      success: true,
      notifications: demoNotifications,
      unreadCount: demoNotifications.filter(n => !n.isRead).length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: demoNotifications.length,
        pages: Math.ceil(demoNotifications.length / limit),
      },
    });
  }

  res.json({
    success: true,
    notifications,
    unreadCount,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
export const getNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id)
    .populate('recipient', 'name email avatarUrl')
    .populate('project', 'name')
    .populate('task', 'title')
    .populate('team', 'name')
    .populate('conversation', 'type');

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  // Check if user is the recipient
  if (notification.recipient._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this notification');
  }

  res.json({
    success: true,
    notification,
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  if (notification.recipient.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this notification');
  }

  notification.isRead = true;
  notification.readAt = Date.now();
  await notification.save();

  const updatedNotification = await Notification.findById(req.params.id)
    .populate('project', 'name')
    .populate('task', 'title')
    .populate('team', 'name')
    .populate('conversation', 'type');

  res.json({
    success: true,
    notification: updatedNotification,
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  const { type } = req.body;
  const userId = req.user._id;

  const query = { recipient: userId, isRead: false };
  if (type) {
    query.type = type;
  }

  await Notification.updateMany(query, {
    isRead: true,
    readAt: Date.now(),
  });

  res.json({
    success: true,
    message: 'All notifications marked as read',
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  if (notification.recipient.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this notification');
  }

  await Notification.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Notification deleted successfully',
  });
});

// @desc    Delete all read notifications
// @route   DELETE /api/notifications/clear-read
// @access  Private
export const clearReadNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await Notification.deleteMany({
    recipient: userId,
    isRead: true,
  });

  res.json({
    success: true,
    message: 'Read notifications cleared successfully',
  });
});

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const unreadCount = await Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });

  res.json({
    success: true,
    unreadCount,
  });
});

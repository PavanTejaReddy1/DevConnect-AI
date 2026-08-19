import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get dashboard summary for authenticated user
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = asyncHandler(async (req, res) => {
  // Mock data - will be replaced with actual database queries when Projects, Tasks, Teams models are created
  const summary = {
    stats: {
      activeProjects: 12,
      teamsJoined: 5,
      pendingTasks: 24,
      completedTasks: 156,
    },
    recentProjects: [
      {
        id: 1,
        name: 'E-commerce Platform',
        description: 'Building a modern e-commerce platform with React and Node.js',
        status: 'active',
        progress: 75,
        team: ['John', 'Sarah', 'Mike'],
        deadline: 'Dec 15, 2024',
      },
      {
        id: 2,
        name: 'Mobile App Redesign',
        description: 'Redesigning the mobile app with new UI/UX guidelines',
        status: 'active',
        progress: 45,
        team: ['Emma', 'David'],
        deadline: 'Jan 20, 2025',
      },
      {
        id: 3,
        name: 'API Integration',
        description: 'Integrating third-party APIs for payment and analytics',
        status: 'onHold',
        progress: 30,
        team: ['Alex'],
        deadline: 'Feb 10, 2025',
      },
    ],
  };

  res.json({ success: true, data: summary });
});

// @desc    Get recent activity for authenticated user
// @route   GET /api/dashboard/activity
// @access  Private
export const getRecentActivity = asyncHandler(async (req, res) => {
  // Mock data - will be replaced with actual database queries
  const activity = [
    { day: 'Mon', commits: 12, tasks: 8 },
    { day: 'Tue', commits: 19, tasks: 15 },
    { day: 'Wed', commits: 15, tasks: 12 },
    { day: 'Thu', commits: 25, tasks: 20 },
    { day: 'Fri', commits: 22, tasks: 18 },
    { day: 'Sat', commits: 8, tasks: 5 },
    { day: 'Sun', commits: 5, tasks: 3 },
  ];

  res.json({ success: true, data: activity });
});

// @desc    Get notifications for authenticated user
// @route   GET /api/dashboard/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  // Mock data - will be replaced with actual database queries
  const notifications = [
    {
      id: 1,
      title: 'New task assigned',
      message: 'You have been assigned to "Design System Update"',
      time: '2 min ago',
      read: false,
      type: 'task',
    },
    {
      id: 2,
      title: 'Project deadline reminder',
      message: 'E-commerce Platform is due in 3 days',
      time: '1 hour ago',
      read: false,
      type: 'project',
    },
    {
      id: 3,
      title: 'Team invitation',
      message: 'Sarah invited you to join "Mobile App Team"',
      time: '3 hours ago',
      read: true,
      type: 'team',
    },
    {
      id: 4,
      title: 'Message received',
      message: 'John: "Hey, can you review the PR?"',
      time: '5 hours ago',
      read: true,
      type: 'message',
    },
  ];

  res.json({ success: true, data: notifications });
});

// @desc    Mark notification as read
// @route   PUT /api/dashboard/notifications/:id/read
// @access  Private
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  // Mock implementation - will be updated when Notification model is created
  res.json({ success: true, message: 'Notification marked as read' });
});

// @desc    Get statistics for authenticated user
// @route   GET /api/dashboard/stats
// @access  Private
export const getStatistics = asyncHandler(async (req, res) => {
  // Mock data - will be replaced with actual database queries
  const stats = {
    weeklyActivity: [
      { day: 'Mon', commits: 12, tasks: 8 },
      { day: 'Tue', commits: 19, tasks: 15 },
      { day: 'Wed', commits: 15, tasks: 12 },
      { day: 'Thu', commits: 25, tasks: 20 },
      { day: 'Fri', commits: 22, tasks: 18 },
      { day: 'Sat', commits: 8, tasks: 5 },
      { day: 'Sun', commits: 5, tasks: 3 },
    ],
    projectProgress: [
      { name: 'E-commerce', progress: 75 },
      { name: 'Mobile App', progress: 45 },
      { name: 'API Integration', progress: 30 },
      { name: 'Dashboard', progress: 90 },
      { name: 'Documentation', progress: 60 },
    ],
    taskStatus: [
      { name: 'Completed', value: 156, color: '#22C55E' },
      { name: 'In Progress', value: 45, color: '#2563EB' },
      { name: 'Pending', value: 24, color: '#F59E0B' },
      { name: 'Overdue', value: 8, color: '#EF4444' },
    ],
  };

  res.json({ success: true, data: stats });
});

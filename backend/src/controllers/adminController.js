import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Team from '../models/Team.js';
import Task from '../models/Task.js';

// @desc    Get admin dashboard statistics
// @route   GET /admin/dashboard
// @access  Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
  const totalProjects = await Project.countDocuments();
  const activeTeams = await Team.countDocuments();
  const tasksCompleted = await Task.countDocuments({ status: 'completed' });
  
  // User growth over time (last 6 months)
  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Project growth over time
  const projectGrowth = await Project.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      totalProjects,
      activeTeams,
      tasksCompleted,
      userGrowth,
      projectGrowth,
    }
  });
});

// @desc    Get all users
// @route   GET /admin/users
// @access  Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const { search, role, status, page = 1, limit = 20 } = req.query;

  const query = {};
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (role) {
    query.role = role;
  }
  
  if (status === 'active') {
    query.isActive = true;
  } else if (status === 'suspended') {
    query.isActive = false;
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: { users, total, page: parseInt(page), limit: parseInt(limit) }
  });
});

// @desc    Update user
// @route   PUT /admin/users/:id
// @access  Admin
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, isActive } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  res.json({ success: true, data: user });
});

// @desc    Delete user
// @route   DELETE /admin/users/:id
// @access  Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'User deleted successfully' });
});

// @desc    Get all projects
// @route   GET /admin/projects
// @access  Admin
export const getAllProjects = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 20 } = req.query;

  const query = {};
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (status === 'active') {
    query.isActive = true;
  } else if (status === 'archived') {
    query.isActive = false;
  }

  const projects = await Project.find(query)
    .populate('owner', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Project.countDocuments(query);

  res.json({
    success: true,
    data: { projects, total, page: parseInt(page), limit: parseInt(limit) }
  });
});

// @desc    Delete project
// @route   DELETE /admin/projects/:id
// @access  Admin
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  await Project.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Project deleted successfully' });
});

// @desc    Get all teams
// @route   GET /admin/teams
// @access  Admin
export const getAllTeams = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;

  const query = {};
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const teams = await Team.find(query)
    .populate('owner', 'name email')
    .populate('members', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Team.countDocuments(query);

  res.json({
    success: true,
    data: { teams, total, page: parseInt(page), limit: parseInt(limit) }
  });
});

// @desc    Delete team
// @route   DELETE /admin/teams/:id
// @access  Admin
export const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  await Team.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Team deleted successfully' });
});

// @desc    Get all tasks
// @route   GET /admin/tasks
// @access  Admin
export const getAllTasks = asyncHandler(async (req, res) => {
  const { search, status, priority, page = 1, limit = 20 } = req.query;

  const query = {};
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (status) {
    query.status = status;
  }
  
  if (priority) {
    query.priority = priority;
  }

  const tasks = await Task.find(query)
    .populate('assignee', 'name email')
    .populate('project', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Task.countDocuments(query);

  res.json({
    success: true,
    data: { tasks, total, page: parseInt(page), limit: parseInt(limit) }
  });
});

// @desc    Delete task
// @route   DELETE /admin/tasks/:id
// @access  Admin
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await Task.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Task deleted successfully' });
});

// @desc    Get platform settings
// @route   GET /admin/settings
// @access  Admin
export const getSettings = asyncHandler(async (req, res) => {
  // For now, return environment-based settings
  res.json({
    success: true,
    data: {
      platformName: process.env.PLATFORM_NAME || 'DevConnect AI',
      maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
      aiEnabled: !!process.env.GEMINI_API_KEY,
    }
  });
});

// @desc    Update platform settings
// @route   PUT /admin/settings
// @access  Admin
export const updateSettings = asyncHandler(async (req, res) => {
  const { platformName, maintenanceMode } = req.body;

  // In a real application, these would be stored in a database
  // For now, we'll just return success
  res.json({
    success: true,
    data: {
      platformName: platformName || process.env.PLATFORM_NAME || 'DevConnect AI',
      maintenanceMode: maintenanceMode !== undefined ? maintenanceMode : process.env.MAINTENANCE_MODE === 'true',
    }
  });
});

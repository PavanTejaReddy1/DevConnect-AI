import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllProjects,
  deleteProject,
  getAllTeams,
  deleteTeam,
  getAllTasks,
  deleteTask,
  getSettings,
  updateSettings,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { body, param } from 'express-validator';

const router = express.Router();

// Validation middleware
const updateUserValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
];

const updateSettingsValidation = [
  body('platformName').optional().trim().notEmpty().withMessage('Platform name cannot be empty'),
];

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserValidation, updateUser);
router.delete('/users/:id', deleteUser);

// Projects
router.get('/projects', getAllProjects);
router.delete('/projects/:id', deleteProject);

// Teams
router.get('/teams', getAllTeams);
router.delete('/teams/:id', deleteTeam);

// Tasks
router.get('/tasks', getAllTasks);
router.delete('/tasks/:id', deleteTask);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettingsValidation, updateSettings);

export default router;

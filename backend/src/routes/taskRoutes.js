import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  assignTask,
  addComment,
  getTaskComments,
  updateComment,
  deleteComment,
  updateChecklist,
  duplicateTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { body, param } from 'express-validator';

const router = express.Router();

// Validation middleware
const createTaskValidation = [
  body('title').trim().isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description must not exceed 2000 characters'),
  body('status').optional().isIn(['backlog', 'todo', 'in-progress', 'review', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
];

const updateTaskValidation = [
  body('title').optional().trim().isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description must not exceed 2000 characters'),
  body('status').optional().isIn(['backlog', 'todo', 'in-progress', 'review', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
];

const commentValidation = [
  body('content').trim().isLength({ min: 1, max: 2000 }).withMessage('Comment must be between 1 and 2000 characters'),
];

// Task CRUD
router.post('/', protect, createTaskValidation, createTask);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTaskById);
router.put('/:id', protect, updateTaskValidation, updateTask);
router.delete('/:id', protect, deleteTask);

// Task status and assignment
router.patch('/:id/status', protect, updateTaskStatus);
router.patch('/:id/assign', protect, assignTask);
router.post('/:id/duplicate', protect, duplicateTask);

// Checklist
router.patch('/:id/checklist', protect, updateChecklist);

// Comments
router.post('/:id/comments', protect, commentValidation, addComment);
router.get('/:id/comments', protect, getTaskComments);
router.put('/:taskId/comments/:commentId', protect, commentValidation, updateComment);
router.delete('/:taskId/comments/:commentId', protect, deleteComment);

export default router;

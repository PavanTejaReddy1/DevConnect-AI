import { body, param, query } from 'express-validator';

export const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'review', 'completed'])
    .withMessage('Invalid status value'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority value'),
  body('assignedTo')
    .optional()
    .isArray()
    .withMessage('assignedTo must be an array'),
  body('labels')
    .optional()
    .isArray()
    .withMessage('Labels must be an array'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid due date format'),
  body('project')
    .optional()
    .isMongoId()
    .withMessage('Invalid project ID'),
  body('team')
    .optional()
    .isMongoId()
    .withMessage('Invalid team ID'),
];

export const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'review', 'completed'])
    .withMessage('Invalid status value'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority value'),
  body('assignedTo')
    .optional()
    .isArray()
    .withMessage('assignedTo must be an array'),
  body('labels')
    .optional()
    .isArray()
    .withMessage('Labels must be an array'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid due date format'),
  body('position')
    .optional()
    .isInt()
    .withMessage('Position must be an integer'),
];

export const taskIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID'),
];

export const searchTasksValidation = [
  query('search')
    .optional()
    .trim(),
  query('status')
    .optional()
    .isIn(['todo', 'in-progress', 'review', 'completed'])
    .withMessage('Invalid status filter'),
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority filter'),
  query('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID'),
  query('project')
    .optional()
    .isMongoId()
    .withMessage('Invalid project ID'),
  query('team')
    .optional()
    .isMongoId()
    .withMessage('Invalid team ID'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const addCommentValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 1000 })
    .withMessage('Comment must not exceed 1000 characters'),
];

export const addChecklistItemValidation = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Checklist item text is required')
    .isLength({ max: 200 })
    .withMessage('Checklist item must not exceed 200 characters'),
];

export const updateChecklistItemValidation = [
  body('completed')
    .isBoolean()
    .withMessage('Completed must be a boolean'),
];

export const reorderTasksValidation = [
  body('tasks')
    .isArray()
    .withMessage('Tasks must be an array'),
  body('tasks.*.id')
    .isMongoId()
    .withMessage('Invalid task ID'),
  body('tasks.*.position')
    .isInt()
    .withMessage('Position must be an integer'),
  body('tasks.*.status')
    .isIn(['todo', 'in-progress', 'review', 'completed'])
    .withMessage('Invalid status value'),
];

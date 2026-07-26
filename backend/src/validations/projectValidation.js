import { body, param, query } from 'express-validator';

export const createProjectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 100 })
    .withMessage('Title must not exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('stack')
    .optional()
    .isArray()
    .withMessage('Stack must be an array'),
  body('stack.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Technology cannot be empty'),
  body('repository')
    .optional()
    .isURL()
    .withMessage('Repository must be a valid URL'),
  body('demo')
    .optional()
    .isURL()
    .withMessage('Demo link must be a valid URL'),
  body('maxMembers')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Max members must be between 1 and 50'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
];

export const updateProjectValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title must not exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project description cannot be empty')
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('stack')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one technology must be specified'),
  body('stack.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Technology cannot be empty'),
  body('status')
    .optional()
    .isIn(['planning', 'in-progress', 'completed', 'on-hold', 'archived'])
    .withMessage('Invalid status value'),
  body('repository')
    .optional()
    .isURL()
    .withMessage('Repository must be a valid URL'),
  body('demo')
    .optional()
    .isURL()
    .withMessage('Demo link must be a valid URL'),
  body('maxMembers')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Max members must be between 1 and 50'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
];

export const projectIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),
];

export const searchProjectsValidation = [
  query('search')
    .optional()
    .trim(),
  query('status')
    .optional()
    .isIn(['planning', 'in-progress', 'completed', 'on-hold', 'archived'])
    .withMessage('Invalid status filter'),
  query('tags')
    .optional()
    .trim(),
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

export const inviteDeveloperValidation = [
  body('email')
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail(),
];

import { body, param, query } from 'express-validator';

export const createTeamValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
];

export const updateTeamValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Team name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
];

export const teamIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid team ID'),
];

export const searchTeamsValidation = [
  query('search')
    .optional()
    .trim(),
  query('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const joinRequestValidation = [
  body('message')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Message must not exceed 300 characters'),
];

export const inviteMemberValidation = [
  body('email')
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['admin', 'member'])
    .withMessage('Role must be either admin or member'),
];

export const respondToRequestValidation = [
  body('status')
    .isIn(['accepted', 'rejected'])
    .withMessage('Status must be either accepted or rejected'),
];

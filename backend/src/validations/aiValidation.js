import { body } from 'express-validator';

export const projectDescriptionValidation = [
  body('projectName')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 200 })
    .withMessage('Project name must not exceed 200 characters'),
  body('projectType')
    .trim()
    .notEmpty()
    .withMessage('Project type is required')
    .isLength({ max: 100 })
    .withMessage('Project type must not exceed 100 characters'),
  body('context')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Context must not exceed 1000 characters'),
];

export const readmeGeneratorValidation = [
  body('projectName')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 200 })
    .withMessage('Project name must not exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('techStack')
    .trim()
    .notEmpty()
    .withMessage('Tech stack is required')
    .isLength({ max: 500 })
    .withMessage('Tech stack must not exceed 500 characters'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
];

export const teamRecommendationValidation = [
  body('projectDescription')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ max: 2000 })
    .withMessage('Project description must not exceed 2000 characters'),
  body('requiredSkills')
    .trim()
    .notEmpty()
    .withMessage('Required skills are required')
    .isLength({ max: 500 })
    .withMessage('Required skills must not exceed 500 characters'),
  body('teamSize')
    .isInt({ min: 1, max: 50 })
    .withMessage('Team size must be between 1 and 50'),
];

export const taskBreakdownValidation = [
  body('projectDescription')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ max: 2000 })
    .withMessage('Project description must not exceed 2000 characters'),
  body('deadline')
    .trim()
    .notEmpty()
    .withMessage('Deadline is required')
    .isLength({ max: 200 })
    .withMessage('Deadline must not exceed 200 characters'),
  body('complexity')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Complexity must be low, medium, or high'),
];

export const codeReviewValidation = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Code is required')
    .isLength({ max: 50000 })
    .withMessage('Code must not exceed 50000 characters'),
  body('language')
    .trim()
    .notEmpty()
    .withMessage('Language is required')
    .isLength({ max: 50 })
    .withMessage('Language must not exceed 50 characters'),
  body('context')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Context must not exceed 1000 characters'),
];

export const meetingSummaryValidation = [
  body('transcript')
    .trim()
    .notEmpty()
    .withMessage('Transcript is required')
    .isLength({ max: 10000 })
    .withMessage('Transcript must not exceed 10000 characters'),
  body('meetingType')
    .optional()
    .isIn(['standup', 'planning', 'review', 'retrospective', 'other'])
    .withMessage('Invalid meeting type'),
];

export const smartSearchValidation = [
  body('query')
    .trim()
    .notEmpty()
    .withMessage('Query is required')
    .isLength({ max: 500 })
    .withMessage('Query must not exceed 500 characters'),
  body('context')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Context must not exceed 1000 characters'),
];

export const productivityInsightsValidation = [
  body('tasksData')
    .trim()
    .notEmpty()
    .withMessage('Tasks data is required')
    .isLength({ max: 2000 })
    .withMessage('Tasks data must not exceed 2000 characters'),
  body('timeData')
    .trim()
    .notEmpty()
    .withMessage('Time data is required')
    .isLength({ max: 2000 })
    .withMessage('Time data must not exceed 2000 characters'),
  body('goals')
    .optional()
    .isArray()
    .withMessage('Goals must be an array'),
];

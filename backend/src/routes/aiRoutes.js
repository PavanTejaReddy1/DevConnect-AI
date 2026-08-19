import express from 'express';
import {
  generateProjectDescriptionHandler,
  generateReadmeHandler,
  generateTeamRecommendationHandler,
  generateTaskBreakdownHandler,
  generateCodeReviewHandler,
  generateMeetingSummaryHandler,
  generateSmartSearchHandler,
  generateProductivityInsightsHandler,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const projectDescriptionValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('techStack').notEmpty().withMessage('Tech stack is required'),
];

const readmeValidation = [
  body('projectName').notEmpty().withMessage('Project name is required'),
  body('description').notEmpty().withMessage('Description is required'),
];

const taskBreakdownValidation = [
  body('projectIdea').notEmpty().withMessage('Project idea is required'),
];

const codeReviewValidation = [
  body('code').notEmpty().withMessage('Code is required'),
  body('language').notEmpty().withMessage('Language is required'),
];

const meetingSummaryValidation = [
  body('meetingNotes').notEmpty().withMessage('Meeting notes are required'),
];

const smartSearchValidation = [
  body('query').notEmpty().withMessage('Query is required'),
];

// AI routes
router.post('/project-description', protect, projectDescriptionValidation, generateProjectDescriptionHandler);
router.post('/readme', protect, readmeValidation, generateReadmeHandler);
router.post('/team-recommendation', protect, generateTeamRecommendationHandler);
router.post('/task-breakdown', protect, taskBreakdownValidation, generateTaskBreakdownHandler);
router.post('/code-review', protect, codeReviewValidation, generateCodeReviewHandler);
router.post('/meeting-summary', protect, meetingSummaryValidation, generateMeetingSummaryHandler);
router.post('/search', protect, smartSearchValidation, generateSmartSearchHandler);
router.get('/productivity', protect, generateProductivityInsightsHandler);

export default router;

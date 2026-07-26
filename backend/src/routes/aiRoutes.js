import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  generateProjectDescription,
  generateReadme,
  recommendTeam,
  breakdownTasks,
  reviewCode,
  summarizeMeeting,
  smartSearch,
  generateProductivityInsights,
} from '../controllers/aiController.js';
import {
  projectDescriptionValidation,
  readmeGeneratorValidation,
  teamRecommendationValidation,
  taskBreakdownValidation,
  codeReviewValidation,
  meetingSummaryValidation,
  smartSearchValidation,
  productivityInsightsValidation,
} from '../validations/aiValidation.js';

const router = express.Router();

// AI Project Description
router.post(
  '/project-description',
  protect,
  projectDescriptionValidation,
  validateRequest,
  generateProjectDescription
);

// AI README Generator
router.post(
  '/readme',
  protect,
  readmeGeneratorValidation,
  validateRequest,
  generateReadme
);

// AI Team Recommendation
router.post(
  '/team-recommendation',
  protect,
  teamRecommendationValidation,
  validateRequest,
  recommendTeam
);

// AI Task Breakdown
router.post(
  '/task-breakdown',
  protect,
  taskBreakdownValidation,
  validateRequest,
  breakdownTasks
);

// AI Code Review
router.post(
  '/code-review',
  protect,
  codeReviewValidation,
  validateRequest,
  reviewCode
);

// AI Meeting Summary
router.post(
  '/meeting-summary',
  protect,
  meetingSummaryValidation,
  validateRequest,
  summarizeMeeting
);

// AI Smart Search
router.post(
  '/smart-search',
  protect,
  smartSearchValidation,
  validateRequest,
  smartSearch
);

// AI Productivity Insights
router.post(
  '/productivity-insights',
  protect,
  productivityInsightsValidation,
  validateRequest,
  generateProductivityInsights
);

export default router;

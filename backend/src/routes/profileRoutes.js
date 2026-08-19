import express from 'express';
import {
  getProfile,
  updateProfile,
  getPublicProfile,
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('username').optional().trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must be alphanumeric with underscores only'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must not exceed 500 characters'),
  body('location').optional().trim().isLength({ max: 100 }).withMessage('Location must not exceed 100 characters'),
  body('availability').optional().isIn(['available', 'busy', 'unavailable']).withMessage('Invalid availability status'),
  body('github').optional().isURL().withMessage('GitHub must be a valid URL'),
  body('linkedin').optional().isURL().withMessage('LinkedIn must be a valid URL'),
  body('twitter').optional().isURL().withMessage('Twitter must be a valid URL'),
  body('website').optional().isURL().withMessage('Website must be a valid URL'),
  body('portfolio').optional().isURL().withMessage('Portfolio must be a valid URL'),
];

// Protected routes
router.get('/', protect, getProfile);
router.put('/', protect, updateProfileValidation, updateProfile);

// Public route
router.get('/:username', getPublicProfile);

export default router;

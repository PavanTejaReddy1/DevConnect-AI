import express from 'express';
import {
  getSettings,
  updateSettings,
  changePassword,
  connectAccount,
  disconnectAccount,
} from '../controllers/settingsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const connectAccountValidation = [
  body('provider').notEmpty().withMessage('Provider is required'),
  body('accountId').notEmpty().withMessage('Account ID is required'),
];

// All settings routes require authentication
router.use(protect);

router.get('/', getSettings);
router.put('/', updateSettings);
router.put('/password', changePasswordValidation, changePassword);
router.put('/connect-account', connectAccountValidation, connectAccount);
router.delete('/connect-account/:provider', disconnectAccount);

export default router;

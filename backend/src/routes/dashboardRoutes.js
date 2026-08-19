import express from 'express';
import {
  getDashboardSummary,
  getRecentActivity,
  getNotifications,
  markNotificationAsRead,
  getStatistics,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);

router.get('/summary', getDashboardSummary);
router.get('/activity', getRecentActivity);
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);
router.get('/stats', getStatistics);

export default router;

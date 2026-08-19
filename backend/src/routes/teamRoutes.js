import express from 'express';
import {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  inviteToTeam,
  requestToJoin,
  acceptInvitation,
  rejectInvitation,
  leaveTeam,
  removeMember,
  transferOwnership,
  getTeamInvitations,
  getTeamJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  getPendingInvitations,
  getPendingJoinRequests,
} from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';
import { body, param } from 'express-validator';

const router = express.Router();

// Validation middleware
const createTeamValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  body('visibility').optional().isIn(['public', 'private']).withMessage('Invalid visibility'),
];

const updateTeamValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  body('visibility').optional().isIn(['public', 'private']).withMessage('Invalid visibility'),
];

const inviteValidation = [
  body('receiverId').notEmpty().withMessage('Receiver ID is required'),
  body('role').optional().isIn(['admin', 'member', 'viewer']).withMessage('Invalid role'),
  body('message').optional().trim().isLength({ max: 300 }).withMessage('Message must not exceed 300 characters'),
];

const joinRequestValidation = [
  body('message').optional().trim().isLength({ max: 300 }).withMessage('Message must not exceed 300 characters'),
];

const transferOwnershipValidation = [
  body('newOwnerId').notEmpty().withMessage('New owner ID is required'),
];

// Team CRUD
router.post('/', protect, createTeamValidation, createTeam);
router.get('/', protect, getTeams);
router.get('/:id', protect, getTeamById);
router.put('/:id', protect, updateTeamValidation, updateTeam);
router.delete('/:id', protect, deleteTeam);

// Team invitations
router.post('/:id/invite', protect, inviteValidation, inviteToTeam);
router.post('/:id/accept', protect, acceptInvitation);
router.post('/:id/reject', protect, rejectInvitation);
router.get('/:id/invitations', protect, getTeamInvitations);
router.get('/invitations/pending', protect, getPendingInvitations);

// Team join requests
router.post('/:id/join', protect, joinRequestValidation, requestToJoin);
router.get('/:id/requests', protect, getTeamJoinRequests);
router.get('/requests/pending', protect, getPendingJoinRequests);
router.put('/:id/requests/:requestId/approve', protect, approveJoinRequest);
router.put('/:id/requests/:requestId/reject', protect, rejectJoinRequest);

// Team member management
router.post('/:id/leave', protect, leaveTeam);
router.delete('/:id/members/:memberId', protect, removeMember);
router.put('/:id/transfer', protect, transferOwnershipValidation, transferOwnership);

export default router;

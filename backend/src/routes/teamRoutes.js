import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  requestToJoin,
  respondToJoinRequest,
  inviteMember,
  acceptInvite,
  leaveTeam,
  removeMember,
  updateMemberRole,
  updateTeamStats,
} from '../controllers/teamController.js';
import {
  createTeamValidation,
  updateTeamValidation,
  teamIdValidation,
  searchTeamsValidation,
  joinRequestValidation,
  inviteMemberValidation,
  respondToRequestValidation,
} from '../validations/teamValidation.js';

const router = express.Router();

// Team CRUD
router.route('/')
  .post(protect, createTeamValidation, validateRequest, createTeam)
  .get(protect, searchTeamsValidation, validateRequest, getTeams);

router.route('/:id')
  .get(protect, teamIdValidation, validateRequest, getTeamById)
  .put(protect, teamIdValidation, updateTeamValidation, validateRequest, updateTeam)
  .delete(protect, teamIdValidation, validateRequest, deleteTeam);

// Join requests
router.post('/:id/join-request', protect, teamIdValidation, joinRequestValidation, validateRequest, requestToJoin);
router.put('/:id/join-requests/:requestId', protect, teamIdValidation, respondToRequestValidation, validateRequest, respondToJoinRequest);

// Invites
router.post('/:id/invite', protect, teamIdValidation, inviteMemberValidation, validateRequest, inviteMember);
router.post('/:id/accept-invite/:token', protect, teamIdValidation, validateRequest, acceptInvite);

// Member management
router.post('/:id/leave', protect, teamIdValidation, validateRequest, leaveTeam);
router.delete('/:id/members/:memberId', protect, teamIdValidation, validateRequest, removeMember);
router.put('/:id/members/:memberId/role', protect, teamIdValidation, validateRequest, updateMemberRole);

// Statistics
router.put('/:id/stats', protect, teamIdValidation, validateRequest, updateTeamStats);

export default router;

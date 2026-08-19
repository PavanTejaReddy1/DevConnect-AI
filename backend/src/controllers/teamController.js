import asyncHandler from 'express-async-handler';
import Team from '../models/Team.js';
import Invitation from '../models/Invitation.js';
import JoinRequest from '../models/JoinRequest.js';
import User from '../models/User.js';

// Helper function to check if user is team owner or admin
const isTeamAdmin = (team, userId) => {
  return team.owner.toString() === userId.toString() || 
         team.admins.some(admin => admin.toString() === userId.toString());
};

// Helper function to check if user is team member
const isTeamMember = (team, userId) => {
  return team.owner.toString() === userId.toString() ||
         team.admins.some(admin => admin.toString() === userId.toString()) ||
         team.members.some(member => member.toString() === userId.toString());
};

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
export const createTeam = asyncHandler(async (req, res) => {
  const { name, description, skills, techStack, openPositions, visibility } = req.body;

  const team = await Team.create({
    name,
    description,
    skills,
    techStack,
    openPositions,
    visibility,
    owner: req.user._id,
    admins: [],
    members: [req.user._id],
  });

  res.status(201).json({ success: true, data: team });
});

// @desc    Get all teams (with optional search)
// @route   GET /api/teams
// @access  Private
export const getTeams = asyncHandler(async (req, res) => {
  const { search, skills } = req.query;
  const userId = req.user._id;

  let query = Team.find({
    $or: [
      { owner: userId },
      { admins: userId },
      { members: userId },
      { visibility: 'public' }
    ]
  });

  if (search) {
    query = query.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    });
  }

  if (skills) {
    const skillArray = skills.split(',');
    query = query.find({ skills: { $in: skillArray } });
  }

  const teams = await query
    .populate('owner', 'name username avatarUrl')
    .populate('admins', 'name username avatarUrl')
    .populate('members', 'name username avatarUrl')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: teams });
});

// @desc    Get single team by ID
// @route   GET /api/teams/:id
// @access  Private
export const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id)
    .populate('owner', 'name username avatarUrl')
    .populate('admins', 'name username avatarUrl')
    .populate('members', 'name username avatarUrl skills')
    .populate('projects');

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Check if user has access to private team
  if (team.visibility === 'private' && !isTeamMember(team, req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to access this team');
  }

  res.json({ success: true, data: team });
});

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private (Owner/Admin only)
export const updateTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (!isTeamAdmin(team, req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to update this team');
  }

  const { name, description, logo, banner, skills, techStack, openPositions, visibility } = req.body;

  if (name !== undefined) team.name = name;
  if (description !== undefined) team.description = description;
  if (logo !== undefined) team.logo = logo;
  if (banner !== undefined) team.banner = banner;
  if (skills !== undefined) team.skills = skills;
  if (techStack !== undefined) team.techStack = techStack;
  if (openPositions !== undefined) team.openPositions = openPositions;
  if (visibility !== undefined) team.visibility = visibility;

  await team.save();

  res.json({ success: true, data: team });
});

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private (Owner only)
export const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (team.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only team owner can delete the team');
  }

  await Team.findByIdAndDelete(req.params.id);
  await Invitation.deleteMany({ team: req.params.id });
  await JoinRequest.deleteMany({ team: req.params.id });

  res.json({ success: true, message: 'Team deleted successfully' });
});

// @desc    Invite user to team
// @route   POST /api/teams/:id/invite
// @access  Private (Owner/Admin only)
export const inviteToTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (!isTeamAdmin(team, req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to invite members');
  }

  const { receiverId, role, message } = req.body;

  // Check if receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if already a member
  if (isTeamMember(team, receiverId)) {
    res.status(400);
    throw new Error('User is already a member of this team');
  }

  // Check if invitation already exists
  const existingInvitation = await Invitation.findOne({
    team: team._id,
    receiver: receiverId,
    status: 'pending'
  });

  if (existingInvitation) {
    res.status(400);
    throw new Error('Invitation already sent');
  }

  const invitation = await Invitation.create({
    sender: req.user._id,
    receiver: receiverId,
    team: team._id,
    role: role || 'member',
    message: message || ''
  });

  res.status(201).json({ success: true, data: invitation });
});

// @desc    Request to join team
// @route   POST /api/teams/:id/join
// @access  Private
export const requestToJoin = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (isTeamMember(team, req.user._id)) {
    res.status(400);
    throw new Error('You are already a member of this team');
  }

  // Check if request already exists
  const existingRequest = await JoinRequest.findOne({
    team: team._id,
    user: req.user._id,
    status: 'pending'
  });

  if (existingRequest) {
    res.status(400);
    throw new Error('Join request already sent');
  }

  const { message } = req.body;

  const joinRequest = await JoinRequest.create({
    user: req.user._id,
    team: team._id,
    message: message || ''
  });

  res.status(201).json({ success: true, data: joinRequest });
});

// @desc    Accept team invitation
// @route   POST /api/teams/:id/accept
// @access  Private
export const acceptInvitation = asyncHandler(async (req, res) => {
  const invitation = await Invitation.findOne({
    team: req.params.id,
    receiver: req.user._id,
    status: 'pending'
  });

  if (!invitation) {
    res.status(404);
    throw new Error('Invitation not found');
  }

  const team = await Team.findById(invitation.team);

  invitation.status = 'accepted';
  await invitation.save();

  // Add user to team
  if (invitation.role === 'admin') {
    team.admins.push(req.user._id);
  }
  team.members.push(req.user._id);
  await team.save();

  res.json({ success: true, message: 'Invitation accepted' });
});

// @desc    Reject team invitation
// @route   POST /api/teams/:id/reject
// @access  Private
export const rejectInvitation = asyncHandler(async (req, res) => {
  const invitation = await Invitation.findOne({
    team: req.params.id,
    receiver: req.user._id,
    status: 'pending'
  });

  if (!invitation) {
    res.status(404);
    throw new Error('Invitation not found');
  }

  invitation.status = 'rejected';
  await invitation.save();

  res.json({ success: true, message: 'Invitation rejected' });
});

// @desc    Leave team
// @route   POST /api/teams/:id/leave
// @access  Private
export const leaveTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (!isTeamMember(team, req.user._id)) {
    res.status(400);
    throw new Error('You are not a member of this team');
  }

  if (team.owner.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Team owner cannot leave. Transfer ownership first or delete the team');
  }

  // Remove from admins and members
  team.admins = team.admins.filter(id => id.toString() !== req.user._id.toString());
  team.members = team.members.filter(id => id.toString() !== req.user._id.toString());
  await team.save();

  res.json({ success: true, message: 'Left team successfully' });
});

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:memberId
// @access  Private (Owner/Admin only)
export const removeMember = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (!isTeamAdmin(team, req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to remove members');
  }

  const { memberId } = req.params;

  if (team.owner.toString() === memberId) {
    res.status(400);
    throw new Error('Cannot remove team owner');
  }

  // Remove from admins and members
  team.admins = team.admins.filter(id => id.toString() !== memberId);
  team.members = team.members.filter(id => id.toString() !== memberId);
  await team.save();

  res.json({ success: true, message: 'Member removed successfully' });
});

// @desc    Transfer team ownership
// @route   PUT /api/teams/:id/transfer
// @access  Private (Owner only)
export const transferOwnership = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (team.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only team owner can transfer ownership');
  }

  const { newOwnerId } = req.body;

  if (!isTeamMember(team, newOwnerId)) {
    res.status(400);
    throw new Error('New owner must be a team member');
  }

  // Transfer ownership
  team.owner = newOwnerId;
  team.admins = team.admins.filter(id => id.toString() !== newOwnerId);
  team.members.push(req.user._id);
  await team.save();

  res.json({ success: true, data: team });
});

// @desc    Get team invitations
// @route   GET /api/teams/:id/invitations
// @access  Private (Owner/Admin only)
export const getTeamInvitations = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (!isTeamAdmin(team, req.user._id)) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const invitations = await Invitation.find({ team: req.params.id, status: 'pending' })
    .populate('receiver', 'name username avatarUrl')
    .populate('sender', 'name username avatarUrl')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: invitations });
});

// @desc    Get team join requests
// @route   GET /api/teams/:id/requests
// @access  Private (Owner/Admin only)
export const getTeamJoinRequests = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (!isTeamAdmin(team, req.user._id)) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const requests = await JoinRequest.find({ team: req.params.id, status: 'pending' })
    .populate('user', 'name username avatarUrl skills')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: requests });
});

// @desc    Approve join request
// @route   PUT /api/teams/:id/requests/:requestId/approve
// @access  Private (Owner/Admin only)
export const approveJoinRequest = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (!isTeamAdmin(team, req.user._id)) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const request = await JoinRequest.findById(req.params.requestId);

  if (!request || request.team.toString() !== req.params.id) {
    res.status(404);
    throw new Error('Request not found');
  }

  request.status = 'approved';
  await request.save();

  // Add user to team
  team.members.push(request.user);
  await team.save();

  res.json({ success: true, message: 'Join request approved' });
});

// @desc    Reject join request
// @route   PUT /api/teams/:id/requests/:requestId/reject
// @access  Private (Owner/Admin only)
export const rejectJoinRequest = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (!isTeamAdmin(team, req.user._id)) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const request = await JoinRequest.findById(req.params.requestId);

  if (!request || request.team.toString() !== req.params.id) {
    res.status(404);
    throw new Error('Request not found');
  }

  request.status = 'rejected';
  await request.save();

  res.json({ success: true, message: 'Join request rejected' });
});

// @desc    Get user's pending invitations
// @route   GET /api/teams/invitations/pending
// @access  Private
export const getPendingInvitations = asyncHandler(async (req, res) => {
  const invitations = await Invitation.find({ receiver: req.user._id, status: 'pending' })
    .populate('team', 'name description logo')
    .populate('sender', 'name username avatarUrl')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: invitations });
});

// @desc    Get user's pending join requests
// @route   GET /api/teams/requests/pending
// @access  Private
export const getPendingJoinRequests = asyncHandler(async (req, res) => {
  const requests = await JoinRequest.find({ user: req.user._id, status: 'pending' })
    .populate('team', 'name description logo')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: requests });
});

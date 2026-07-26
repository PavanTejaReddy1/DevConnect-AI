import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Team from '../models/Team.js';
import User from '../models/User.js';

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
export const createTeam = asyncHandler(async (req, res) => {
  const { name, description, tags, isPublic } = req.body;

  const team = await Team.create({
    name,
    description: description || '',
    tags: tags || [],
    isPublic: isPublic !== undefined ? isPublic : false,
    owner: req.user._id,
    members: [{ user: req.user._id, role: 'owner' }],
  });

  await team.addActivity(req.user._id, 'created', `created the team "${name}"`);

  const populatedTeam = await Team.findById(team._id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl');

  res.status(201).json({
    success: true,
    team: populatedTeam,
  });
});

// @desc    Get all teams (with search and filters)
// @route   GET /api/teams
// @access  Private
export const getTeams = asyncHandler(async (req, res) => {
  const { search, isPublic, page = 1, limit = 10 } = req.query;
  const userId = req.user._id;

  const query = {
    $or: [
      { owner: userId },
      { 'members.user': userId },
      { isPublic: true },
    ],
  };

  if (isPublic === 'true') {
    query.$or.push({ isPublic: true });
  }

  if (search) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * limit;

  const teams = await Team.find(query)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Team.countDocuments(query);

  res.json({
    success: true,
    teams,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single team by ID
// @route   GET /api/teams/:id
// @access  Private
export const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl')
    .populate('joinRequests.user', 'name email avatarUrl')
    .populate('invites.invitedBy', 'name email avatarUrl')
    .populate('activity.user', 'name email avatarUrl');

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Check if user has access
  const isMember = team.members.some(m => m.user._id.toString() === req.user._id.toString());
  const isOwner = team.owner._id.toString() === req.user._id.toString();
  const isPublic = team.isPublic;

  if (!isMember && !isOwner && !isPublic) {
    res.status(403);
    throw new Error('Not authorized to access this team');
  }

  res.json({
    success: true,
    team,
  });
});

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private (owner/admin only)
export const updateTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Check if user is owner or admin
  const member = team.members.find(m => m.user.toString() === req.user._id.toString());
  const isOwner = team.owner.toString() === req.user._id.toString();
  const isAdmin = member && (member.role === 'admin' || member.role === 'owner');

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update this team');
  }

  const { name, description, tags, isPublic } = req.body;

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (tags !== undefined) updates.tags = tags;
  if (isPublic !== undefined) updates.isPublic = isPublic;

  const updatedTeam = await Team.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).populate('owner', 'name email avatarUrl')
   .populate('members.user', 'name email avatarUrl');

  await updatedTeam.addActivity(req.user._id, 'updated', 'updated team details');

  res.json({
    success: true,
    team: updatedTeam,
  });
});

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private (owner only)
export const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // For demo purposes, allow any authenticated user to delete teams
  if (team.owner.toString() !== req.user._id.toString() && process.env.NODE_ENV !== 'production') {
    // Allow deletion in non-production for demo purposes
  } else if (team.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this team');
  }

  await Team.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Team deleted successfully',
  });
});

// @desc    Request to join team
// @route   POST /api/teams/:id/join-request
// @access  Private
export const requestToJoin = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (!team.isPublic) {
    res.status(400);
    throw new Error('This team is not accepting join requests');
  }

  // Check if already a member
  const isMember = team.members.some(m => m.user.toString() === req.user._id.toString());
  if (isMember) {
    res.status(400);
    throw new Error('Already a member of this team');
  }

  // Check if already has a pending request
  const existingRequest = team.joinRequests.find(
    r => r.user.toString() === req.user._id.toString() && r.status === 'pending'
  );
  if (existingRequest) {
    res.status(400);
    throw new Error('Already have a pending join request');
  }

  team.joinRequests.push({
    user: req.user._id,
    message: message || '',
    status: 'pending',
  });

  await team.save();
  await team.addActivity(req.user._id, 'requested_to_join', 'requested to join the team');

  res.json({
    success: true,
    message: 'Join request sent successfully',
  });
});

// @desc    Respond to join request
// @route   PUT /api/teams/:id/join-requests/:requestId
// @access  Private (owner/admin only)
export const respondToJoinRequest = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Check if user is owner or admin
  const member = team.members.find(m => m.user.toString() === req.user._id.toString());
  const isOwner = team.owner.toString() === req.user._id.toString();
  const isAdmin = member && (member.role === 'admin' || member.role === 'owner');

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to respond to join requests');
  }

  const request = team.joinRequests.id(req.params.requestId);
  if (!request) {
    res.status(404);
    throw new Error('Join request not found');
  }

  if (request.status !== 'pending') {
    res.status(400);
    throw new Error('This request has already been processed');
  }

  request.status = status;
  request.respondedAt = Date.now();

  if (status === 'accepted') {
    team.members.push({
      user: request.user,
      role: 'member',
    });
    await team.addActivity(req.user._id, 'accepted_request', `accepted ${request.user}'s join request`);
  } else {
    await team.addActivity(req.user._id, 'rejected_request', `rejected ${request.user}'s join request`);
  }

  await team.save();

  const updatedTeam = await Team.findById(req.params.id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl')
    .populate('joinRequests.user', 'name email avatarUrl');

  res.json({
    success: true,
    team: updatedTeam,
  });
});

// @desc    Invite member to team
// @route   POST /api/teams/:id/invite
// @access  Private (owner/admin only)
export const inviteMember = asyncHandler(async (req, res) => {
  const { email, role = 'member' } = req.body;
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Check if user is owner or admin
  const member = team.members.find(m => m.user.toString() === req.user._id.toString());
  const isOwner = team.owner.toString() === req.user._id.toString();
  const isAdmin = member && (member.role === 'admin' || member.role === 'owner');

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to invite members');
  }

  // Check if already invited
  const existingInvite = team.invites.find(i => i.email === email && i.status === 'pending');
  if (existingInvite) {
    res.status(400);
    throw new Error('User already invited');
  }

  // Check if already a member
  const existingMember = team.members.find(m => m.user.email === email);
  if (existingMember) {
    res.status(400);
    throw new Error('User is already a member');
  }

  const token = crypto.randomBytes(32).toString('hex');
  team.invites.push({
    email,
    token,
    role,
    status: 'pending',
    invitedBy: req.user._id,
  });

  await team.save();
  await team.addActivity(req.user._id, 'invited', `invited ${email} to the team`);

  // TODO: Send email with invite link

  res.json({
    success: true,
    message: 'Invitation sent successfully',
    ...(process.env.NODE_ENV !== 'production' && { inviteToken: token }),
  });
});

// @desc    Accept team invite
// @route   POST /api/teams/:id/accept-invite/:token
// @access  Private
export const acceptInvite = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  const invite = team.invites.find(i => i.token === token && i.status === 'pending');
  if (!invite) {
    res.status(400);
    throw new Error('Invalid or expired invite');
  }

  if (invite.email !== req.user.email) {
    res.status(403);
    throw new Error('This invite is for a different email address');
  }

  // Check if already a member
  const isMember = team.members.some(m => m.user.toString() === req.user._id.toString());
  if (isMember) {
    res.status(400);
    throw new Error('Already a member of this team');
  }

  team.members.push({
    user: req.user._id,
    role: invite.role,
  });

  invite.status = 'accepted';
  await team.save();
  await team.addActivity(req.user._id, 'accepted_invite', 'accepted the team invitation');

  const updatedTeam = await Team.findById(req.params.id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl');

  res.json({
    success: true,
    team: updatedTeam,
  });
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

  // Owner cannot leave
  if (team.owner.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Owner cannot leave the team');
  }

  team.members = team.members.filter(m => m.user.toString() !== req.user._id.toString());
  await team.save();
  await team.addActivity(req.user._id, 'left', 'left the team');

  const updatedTeam = await Team.findById(req.params.id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl');

  res.json({
    success: true,
    team: updatedTeam,
  });
});

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:memberId
// @access  Private (owner/admin only)
export const removeMember = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Check if user is owner or admin
  const member = team.members.find(m => m.user.toString() === req.user._id.toString());
  const isOwner = team.owner.toString() === req.user._id.toString();
  const isAdmin = member && (member.role === 'admin' || member.role === 'owner');

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to remove members');
  }

  const memberToRemove = team.members.find(m => m.user.toString() === req.params.memberId);
  if (!memberToRemove) {
    res.status(404);
    throw new Error('Member not found');
  }

  // Cannot remove owner
  if (memberToRemove.role === 'owner') {
    res.status(400);
    throw new Error('Cannot remove the team owner');
  }

  // Admins cannot remove other admins (only owner can)
  if (isAdmin && memberToRemove.role === 'admin' && !isOwner) {
    res.status(403);
    throw new Error('Admins cannot remove other admins');
  }

  team.members = team.members.filter(m => m.user.toString() !== req.params.memberId);
  await team.save();
  await team.addActivity(req.user._id, 'removed_member', `removed a member from the team`);

  const updatedTeam = await Team.findById(req.params.id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl');

  res.json({
    success: true,
    team: updatedTeam,
  });
});

// @desc    Update member role
// @route   PUT /api/teams/:id/members/:memberId/role
// @access  Private (owner only)
export const updateMemberRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (team.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the owner can update member roles');
  }

  const member = team.members.find(m => m.user.toString() === req.params.memberId);
  if (!member) {
    res.status(404);
    throw new Error('Member not found');
  }

  if (member.role === 'owner') {
    res.status(400);
    throw new Error('Cannot change owner role');
  }

  member.role = role;
  await team.save();
  await team.addActivity(req.user._id, 'updated_role', `updated member role to ${role}`);

  const updatedTeam = await Team.findById(req.params.id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl');

  res.json({
    success: true,
    team: updatedTeam,
  });
});

// @desc    Update team statistics
// @route   PUT /api/teams/:id/stats
// @access  Private (owner/admin only)
export const updateTeamStats = asyncHandler(async (req, res) => {
  const { projectsCompleted, activeProjects, totalTasks, completedTasks } = req.body;
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Check if user is owner or admin
  const member = team.members.find(m => m.user.toString() === req.user._id.toString());
  const isOwner = team.owner.toString() === req.user._id.toString();
  const isAdmin = member && (member.role === 'admin' || member.role === 'owner');

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update team statistics');
  }

  const updates = {};
  if (projectsCompleted !== undefined) updates['stats.projectsCompleted'] = projectsCompleted;
  if (activeProjects !== undefined) updates['stats.activeProjects'] = activeProjects;
  if (totalTasks !== undefined) updates['stats.totalTasks'] = totalTasks;
  if (completedTasks !== undefined) updates['stats.completedTasks'] = completedTasks;

  const updatedTeam = await Team.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true }
  ).populate('owner', 'name email avatarUrl')
   .populate('members.user', 'name email avatarUrl');

  res.json({
    success: true,
    team: updatedTeam,
  });
});

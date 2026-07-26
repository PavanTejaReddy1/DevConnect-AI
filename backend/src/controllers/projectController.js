import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Project from '../models/Project.js';
import User from '../models/User.js';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = asyncHandler(async (req, res) => {
  const { title, description, stack, repository, demo, maxMembers, tags, isPublic } = req.body;

  const project = await Project.create({
    title,
    description: description || 'A new project',
    stack: stack || ['React', 'Node.js'],
    repository: repository || '',
    demo: demo || '',
    maxMembers: maxMembers || 10,
    tags: tags || [],
    isPublic: isPublic !== undefined ? isPublic : true,
    owner: req.user._id,
    members: [{ user: req.user._id, role: 'owner' }],
  });

  await project.addActivity(req.user._id, 'created', `created the project "${title}"`);

  const populatedProject = await Project.findById(project._id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl');

  res.status(201).json({
    success: true,
    project: populatedProject,
  });
});

// @desc    Get all projects (with search and filters)
// @route   GET /api/projects
// @access  Private
export const getProjects = asyncHandler(async (req, res) => {
  const { search, status, tags, page = 1, limit = 10 } = req.query;
  const userId = req.user._id;

  const query = {
    $or: [
      { owner: userId },
      { 'members.user': userId },
      { isPublic: true },
    ],
  };

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$text = { $search: search };
  }

  if (tags) {
    const tagArray = tags.split(',').map(t => t.trim());
    query.tags = { $in: tagArray };
  }

  const skip = (page - 1) * limit;

  const projects = await Project.find(query)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Project.countDocuments(query);

  res.json({
    success: true,
    projects,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl')
    .populate('comments.user', 'name email avatarUrl')
    .populate('activity.user', 'name email avatarUrl')
    .populate('files.uploadedBy', 'name email avatarUrl');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user has access
  const isMember = project.members.some(m => m.user._id.toString() === req.user._id.toString());
  const isOwner = project.owner._id.toString() === req.user._id.toString();
  const isPublic = project.isPublic;

  if (!isMember && !isOwner && !isPublic) {
    res.status(403);
    throw new Error('Not authorized to access this project');
  }

  res.json({
    success: true,
    project,
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (owner only)
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this project');
  }

  const { title, description, stack, status, repository, demo, maxMembers, tags, isPublic } = req.body;

  const updates = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (stack !== undefined) updates.stack = stack;
  if (status !== undefined) updates.status = status;
  if (repository !== undefined) updates.repository = repository;
  if (demo !== undefined) updates.demo = demo;
  if (maxMembers !== undefined) updates.maxMembers = maxMembers;
  if (tags !== undefined) updates.tags = tags;
  if (isPublic !== undefined) updates.isPublic = isPublic;

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).populate('owner', 'name email avatarUrl')
   .populate('members.user', 'name email avatarUrl');

  await updatedProject.addActivity(req.user._id, 'updated', 'updated project details');

  res.json({
    success: true,
    project: updatedProject,
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (owner only)
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // For demo purposes, allow any authenticated user to delete projects
  if (project.owner.toString() !== req.user._id.toString() && process.env.NODE_ENV !== 'production') {
    // Allow deletion in non-production for demo purposes
  } else if (project.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this project');
  }

  await Project.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Project deleted successfully',
  });
});

// @desc    Archive project
// @route   PATCH /api/projects/:id/archive
// @access  Private (owner only)
export const archiveProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to archive this project');
  }

  project.status = 'archived';
  await project.save();
  await project.addActivity(req.user._id, 'archived', 'archived the project');

  const updatedProject = await Project.findById(req.params.id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl');

  res.json({
    success: true,
    project: updatedProject,
  });
});

// @desc    Join project
// @route   POST /api/projects/:id/join
// @access  Private
export const joinProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if already a member
  const isMember = project.members.some(m => m.user.toString() === req.user._id.toString());
  if (isMember) {
    res.status(400);
    throw new Error('Already a member of this project');
  }

  // Check if project is full
  if (project.members.length >= project.maxMembers) {
    res.status(400);
    throw new Error('Project is full');
  }

  project.members.push({
    user: req.user._id,
    role: 'contributor',
  });

  await project.save();
  await project.addActivity(req.user._id, 'joined', 'joined the project');

  const updatedProject = await Project.findById(req.params.id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl');

  res.json({
    success: true,
    project: updatedProject,
  });
});

// @desc    Leave project
// @route   POST /api/projects/:id/leave
// @access  Private
export const leaveProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Owner cannot leave
  if (project.owner.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Owner cannot leave the project');
  }

  project.members = project.members.filter(m => m.user.toString() !== req.user._id.toString());
  await project.save();
  await project.addActivity(req.user._id, 'left', 'left the project');

  const updatedProject = await Project.findById(req.params.id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl');

  res.json({
    success: true,
    project: updatedProject,
  });
});

// @desc    Invite developer to project
// @route   POST /api/projects/:id/invite
// @access  Private (owner/maintainer only)
export const inviteDeveloper = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is owner or maintainer
  const member = project.members.find(m => m.user.toString() === req.user._id.toString());
  if (!member || (member.role !== 'owner' && member.role !== 'maintainer')) {
    res.status(403);
    throw new Error('Not authorized to invite developers');
  }

  // Check if already invited
  const existingInvite = project.invites.find(i => i.email === email);
  if (existingInvite) {
    res.status(400);
    throw new Error('User already invited');
  }

  // Check if already a member
  const existingMember = project.members.find(m => m.user.email === email);
  if (existingMember) {
    res.status(400);
    throw new Error('User is already a member');
  }

  const token = crypto.randomBytes(32).toString('hex');
  project.invites.push({
    email,
    token,
    status: 'pending',
  });

  await project.save();
  await project.addActivity(req.user._id, 'invited', `invited ${email} to the project`);

  // TODO: Send email with invite link

  res.json({
    success: true,
    message: 'Invitation sent successfully',
    ...(process.env.NODE_ENV !== 'production' && { inviteToken: token }),
  });
});

// @desc    Accept project invite
// @route   POST /api/projects/:id/accept-invite/:token
// @access  Private
export const acceptInvite = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const invite = project.invites.find(i => i.token === token && i.status === 'pending');
  if (!invite) {
    res.status(400);
    throw new Error('Invalid or expired invite');
  }

  if (invite.email !== req.user.email) {
    res.status(403);
    throw new Error('This invite is for a different email address');
  }

  // Check if already a member
  const isMember = project.members.some(m => m.user.toString() === req.user._id.toString());
  if (isMember) {
    res.status(400);
    throw new Error('Already a member of this project');
  }

  project.members.push({
    user: req.user._id,
    role: 'contributor',
  });

  invite.status = 'accepted';
  await project.save();
  await project.addActivity(req.user._id, 'accepted_invite', 'accepted the project invitation');

  const updatedProject = await Project.findById(req.params.id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl');

  res.json({
    success: true,
    project: updatedProject,
  });
});

// @desc    Add comment to project
// @route   POST /api/projects/:id/comments
// @access  Private (members only)
export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const isMember = project.members.some(m => m.user.toString() === req.user._id.toString());
  const isOwner = project.owner.toString() === req.user._id.toString();
  const isPublic = project.isPublic;

  if (!isMember && !isOwner && !isPublic) {
    res.status(403);
    throw new Error('Not authorized to comment on this project');
  }

  project.comments.push({
    user: req.user._id,
    content,
  });

  await project.save();

  const updatedProject = await Project.findById(req.params.id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl')
    .populate('comments.user', 'name email avatarUrl');

  res.json({
    success: true,
    project: updatedProject,
  });
});

// @desc    Delete comment
// @route   DELETE /api/projects/:id/comments/:commentId
// @access  Private (comment author or owner)
export const deleteComment = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const comment = project.comments.id(req.params.commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const isCommentAuthor = comment.user.toString() === req.user._id.toString();
  const isProjectOwner = project.owner.toString() === req.user._id.toString();

  if (!isCommentAuthor && !isProjectOwner) {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  comment.deleteOne();
  await project.save();

  const updatedProject = await Project.findById(req.params.id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl')
    .populate('comments.user', 'name email avatarUrl');

  res.json({
    success: true,
    project: updatedProject,
  });
});

// @desc    Upload file to project
// @route   POST /api/projects/:id/files
// @access  Private (members only)
export const uploadFile = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const isMember = project.members.some(m => m.user.toString() === req.user._id.toString());
  const isOwner = project.owner.toString() === req.user._id.toString();

  if (!isMember && !isOwner) {
    res.status(403);
    throw new Error('Not authorized to upload files to this project');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  // TODO: Implement Cloudinary upload
  // For now, use the file path from multer
  const fileUrl = `/uploads/${req.file.filename}`;

  project.files.push({
    name: req.file.originalname,
    url: fileUrl,
    size: req.file.size,
    uploadedBy: req.user._id,
  });

  await project.save();
  await project.addActivity(req.user._id, 'uploaded_file', `uploaded file: ${req.file.originalname}`);

  const updatedProject = await Project.findById(req.params.id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl')
    .populate('files.uploadedBy', 'name email avatarUrl');

  res.json({
    success: true,
    project: updatedProject,
  });
});

// @desc    Delete file from project
// @route   DELETE /api/projects/:id/files/:fileId
// @access  Private (file uploader or owner)
export const deleteFile = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const file = project.files.id(req.params.fileId);
  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  const isUploader = file.uploadedBy.toString() === req.user._id.toString();
  const isProjectOwner = project.owner.toString() === req.user._id.toString();

  if (!isUploader && !isProjectOwner) {
    res.status(403);
    throw new Error('Not authorized to delete this file');
  }

  // TODO: Delete file from Cloudinary/storage
  file.deleteOne();
  await project.save();

  const updatedProject = await Project.findById(req.params.id)
    .populate('owner', 'name email avatarUrl')
    .populate('members.user', 'name email avatarUrl')
    .populate('files.uploadedBy', 'name email avatarUrl');

  res.json({
    success: true,
    project: updatedProject,
  });
});

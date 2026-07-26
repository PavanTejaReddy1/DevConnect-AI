import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, assignedTo, labels, dueDate, project, team } = req.body;

  const task = await Task.create({
    title,
    description: description || '',
    status: status || 'todo',
    priority: priority || 'medium',
    assignedTo: assignedTo || [],
    labels: labels || [],
    dueDate: dueDate || null,
    project: project || null,
    team: team || null,
    createdBy: req.user._id,
    position: 0,
  });

  await task.addActivity(req.user._id, 'created', `created task "${title}"`);

  const populatedTask = await Task.findById(task._id)
    .populate('createdBy', 'name email avatarUrl')
    .populate('assignedTo', 'name email avatarUrl')
    .populate('project', 'name')
    .populate('team', 'name');

  res.status(201).json({
    success: true,
    task: populatedTask,
  });
});

// @desc    Get all tasks (with search and filters)
// @route   GET /api/tasks
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
  const { search, status, priority, assignedTo, project, team, page = 1, limit = 50 } = req.query;
  const userId = req.user._id;

  // For demo purposes, return all tasks if no filters are applied
  const query = {};

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  if (assignedTo) {
    query.assignedTo = assignedTo;
  }

  if (project) {
    query.project = project;
  }

  if (team) {
    query.team = team;
  }

  if (search) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * limit;

  const tasks = await Task.find(query)
    .populate('createdBy', 'name email avatarUrl')
    .populate('assignedTo', 'name email avatarUrl')
    .populate('project', 'name')
    .populate('team', 'name')
    .sort({ status: 1, position: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Task.countDocuments(query);

  res.json({
    success: true,
    tasks,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('createdBy', 'name email avatarUrl')
    .populate('assignedTo', 'name email avatarUrl')
    .populate('comments.user', 'name email avatarUrl')
    .populate('activity.user', 'name email avatarUrl')
    .populate('attachments.uploadedBy', 'name email avatarUrl')
    .populate('project', 'name')
    .populate('team', 'name');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access (created by or assigned to)
  const isCreator = task.createdBy._id.toString() === req.user._id.toString();
  const isAssigned = task.assignedTo.some(u => u._id.toString() === req.user._id.toString());

  if (!isCreator && !isAssigned) {
    res.status(403);
    throw new Error('Not authorized to access this task');
  }

  res.json({
    success: true,
    task,
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isAssigned = task.assignedTo.some(u => u.toString() === req.user._id.toString());

  if (!isCreator && !isAssigned) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  const { title, description, status, priority, assignedTo, labels, dueDate, position } = req.body;

  const updates = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (status !== undefined) updates.status = status;
  if (priority !== undefined) updates.priority = priority;
  if (assignedTo !== undefined) updates.assignedTo = assignedTo;
  if (labels !== undefined) updates.labels = labels;
  if (dueDate !== undefined) updates.dueDate = dueDate;
  if (position !== undefined) updates.position = position;

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).populate('createdBy', 'name email avatarUrl')
   .populate('assignedTo', 'name email avatarUrl')
   .populate('project', 'name')
   .populate('team', 'name');

  if (status !== undefined && status !== task.status) {
    await updatedTask.addActivity(req.user._id, 'moved', `moved task to ${status}`);
  }

  res.json({
    success: true,
    task: updatedTask,
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Allow deletion if user is creator OR assigned to task OR for demo purposes
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isAssigned = task.assignedTo.some(u => u.toString() === req.user._id.toString());

  // For demo purposes, allow any authenticated user to delete tasks
  if (!isCreator && !isAssigned && process.env.NODE_ENV !== 'production') {
    // Allow deletion in non-production for demo purposes
  } else if (!isCreator && !isAssigned) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  await Task.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Task deleted successfully',
  });
});

// @desc    Reorder tasks (bulk update for drag-drop)
// @route   PUT /api/tasks/reorder
// @access  Private
export const reorderTasks = asyncHandler(async (req, res) => {
  const { tasks } = req.body;

  if (!Array.isArray(tasks)) {
    res.status(400);
    throw new Error('Tasks must be an array');
  }

  const bulkOps = tasks.map(({ id, position, status }) => ({
    updateOne: {
      filter: { _id: id },
      update: { position, status },
    },
  }));

  await Task.bulkWrite(bulkOps);

  res.json({
    success: true,
    message: 'Tasks reordered successfully',
  });
});

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isAssigned = task.assignedTo.some(u => u.toString() === req.user._id.toString());

  if (!isCreator && !isAssigned) {
    res.status(403);
    throw new Error('Not authorized to comment on this task');
  }

  task.comments.push({
    user: req.user._id,
    content,
  });

  await task.save();
  await task.addActivity(req.user._id, 'commented', 'added a comment');

  const updatedTask = await Task.findById(req.params.id)
    .populate('createdBy', 'name email avatarUrl')
    .populate('assignedTo', 'name email avatarUrl')
    .populate('comments.user', 'name email avatarUrl');

  res.json({
    success: true,
    task: updatedTask,
  });
});

// @desc    Delete comment
// @route   DELETE /api/tasks/:id/comments/:commentId
// @access  Private
export const deleteComment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const comment = task.comments.id(req.params.commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const isCommentAuthor = comment.user.toString() === req.user._id.toString();
  const isTaskCreator = task.createdBy.toString() === req.user._id.toString();

  if (!isCommentAuthor && !isTaskCreator) {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  comment.deleteOne();
  await task.save();

  const updatedTask = await Task.findById(req.params.id)
    .populate('createdBy', 'name email avatarUrl')
    .populate('assignedTo', 'name email avatarUrl')
    .populate('comments.user', 'name email avatarUrl');

  res.json({
    success: true,
    task: updatedTask,
  });
});

// @desc    Add checklist item
// @route   POST /api/tasks/:id/checklist
// @access  Private
export const addChecklistItem = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isAssigned = task.assignedTo.some(u => u.toString() === req.user._id.toString());

  if (!isCreator && !isAssigned) {
    res.status(403);
    throw new Error('Not authorized to modify this task');
  }

  task.checklist.push({
    text,
    completed: false,
  });

  await task.save();
  await task.addActivity(req.user._id, 'added_checklist', 'added a checklist item');

  const updatedTask = await Task.findById(req.params.id)
    .populate('createdBy', 'name email avatarUrl')
    .populate('assignedTo', 'name email avatarUrl');

  res.json({
    success: true,
    task: updatedTask,
  });
});

// @desc    Update checklist item
// @route   PUT /api/tasks/:id/checklist/:itemId
// @access  Private
export const updateChecklistItem = asyncHandler(async (req, res) => {
  const { completed } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isAssigned = task.assignedTo.some(u => u.toString() === req.user._id.toString());

  if (!isCreator && !isAssigned) {
    res.status(403);
    throw new Error('Not authorized to modify this task');
  }

  const item = task.checklist.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error('Checklist item not found');
  }

  item.completed = completed;
  if (completed) {
    item.completedAt = Date.now();
  } else {
    item.completedAt = null;
  }

  await task.save();

  const updatedTask = await Task.findById(req.params.id)
    .populate('createdBy', 'name email avatarUrl')
    .populate('assignedTo', 'name email avatarUrl');

  res.json({
    success: true,
    task: updatedTask,
  });
});

// @desc    Delete checklist item
// @route   DELETE /api/tasks/:id/checklist/:itemId
// @access  Private
export const deleteChecklistItem = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isAssigned = task.assignedTo.some(u => u.toString() === req.user._id.toString());

  if (!isCreator && !isAssigned) {
    res.status(403);
    throw new Error('Not authorized to modify this task');
  }

  const item = task.checklist.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error('Checklist item not found');
  }

  item.deleteOne();
  await task.save();

  const updatedTask = await Task.findById(req.params.id)
    .populate('createdBy', 'name email avatarUrl')
    .populate('assignedTo', 'name email avatarUrl');

  res.json({
    success: true,
    task: updatedTask,
  });
});

// @desc    Upload attachment to task
// @route   POST /api/tasks/:id/attachments
// @access  Private
export const uploadAttachment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has access
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isAssigned = task.assignedTo.some(u => u.toString() === req.user._id.toString());

  if (!isCreator && !isAssigned) {
    res.status(403);
    throw new Error('Not authorized to upload to this task');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  task.attachments.push({
    name: req.file.originalname,
    url: fileUrl,
    size: req.file.size,
    uploadedBy: req.user._id,
  });

  await task.save();
  await task.addActivity(req.user._id, 'uploaded_attachment', `uploaded file: ${req.file.originalname}`);

  const updatedTask = await Task.findById(req.params.id)
    .populate('createdBy', 'name email avatarUrl')
    .populate('assignedTo', 'name email avatarUrl')
    .populate('attachments.uploadedBy', 'name email avatarUrl');

  res.json({
    success: true,
    task: updatedTask,
  });
});

// @desc    Delete attachment from task
// @route   DELETE /api/tasks/:id/attachments/:attachmentId
// @access  Private
export const deleteAttachment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const attachment = task.attachments.id(req.params.attachmentId);
  if (!attachment) {
    res.status(404);
    throw new Error('Attachment not found');
  }

  const isUploader = attachment.uploadedBy.toString() === req.user._id.toString();
  const isTaskCreator = task.createdBy.toString() === req.user._id.toString();

  if (!isUploader && !isTaskCreator) {
    res.status(403);
    throw new Error('Not authorized to delete this attachment');
  }

  attachment.deleteOne();
  await task.save();

  const updatedTask = await Task.findById(req.params.id)
    .populate('createdBy', 'name email avatarUrl')
    .populate('assignedTo', 'name email avatarUrl')
    .populate('attachments.uploadedBy', 'name email avatarUrl');

  res.json({
    success: true,
    task: updatedTask,
  });
});

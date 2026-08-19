import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';
import Comment from '../models/Comment.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    project,
    team,
    assignee,
    status,
    priority,
    labels,
    dueDate,
    estimatedTime,
  } = req.body;

  const task = await Task.create({
    title,
    description,
    project,
    team,
    assignee,
    reporter: req.user._id,
    status: status || 'backlog',
    priority: priority || 'medium',
    labels: labels || [],
    dueDate,
    estimatedTime,
  });

  const populatedTask = await Task.findById(task._id)
    .populate('assignee', 'name username avatarUrl')
    .populate('reporter', 'name username avatarUrl')
    .populate('project', 'name')
    .populate('team', 'name');

  res.status(201).json({ success: true, data: populatedTask });
});

// @desc    Get all tasks (with filters)
// @route   GET /api/tasks
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
  const {
    project,
    team,
    assignee,
    reporter,
    status,
    priority,
    labels,
    search,
  } = req.query;

  let query = Task.find();

  // Apply filters
  if (project) query = query.where('project', project);
  if (team) query = query.where('team', team);
  if (assignee) query = query.where('assignee', assignee);
  if (reporter) query = query.where('reporter', reporter);
  if (status) query = query.where('status', status);
  if (priority) query = query.where('priority', priority);
  if (labels) {
    const labelArray = labels.split(',');
    query = query.where({ labels: { $in: labelArray } });
  }
  if (search) {
    query = query.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    });
  }

  const tasks = await query
    .populate('assignee', 'name username avatarUrl')
    .populate('reporter', 'name username avatarUrl')
    .populate('project', 'name')
    .populate('team', 'name')
    .sort({ status: 1, position: 1, createdAt: -1 });

  res.json({ success: true, data: tasks });
});

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignee', 'name username avatarUrl')
    .populate('reporter', 'name username avatarUrl')
    .populate('project', 'name')
    .populate('team', 'name');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ success: true, data: task });
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

  const {
    title,
    description,
    project,
    team,
    assignee,
    status,
    priority,
    labels,
    dueDate,
    estimatedTime,
    checklist,
  } = req.body;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (project !== undefined) task.project = project;
  if (team !== undefined) task.team = team;
  if (assignee !== undefined) task.assignee = assignee;
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (labels !== undefined) task.labels = labels;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (estimatedTime !== undefined) task.estimatedTime = estimatedTime;
  if (checklist !== undefined) task.checklist = checklist;

  // Set completedAt if task is moved to done
  if (status === 'done' && task.status !== 'done') {
    task.completedAt = new Date();
  } else if (status !== 'done') {
    task.completedAt = null;
  }

  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate('assignee', 'name username avatarUrl')
    .populate('reporter', 'name username avatarUrl')
    .populate('project', 'name')
    .populate('team', 'name');

  res.json({ success: true, data: populatedTask });
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

  // Check if user is reporter or assignee
  if (
    task.reporter.toString() !== req.user._id.toString() &&
    task.assignee?.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  await Task.findByIdAndDelete(req.params.id);
  await Comment.deleteMany({ task: req.params.id });

  res.json({ success: true, message: 'Task deleted successfully' });
});

// @desc    Update task status (for drag and drop)
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status, position } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  task.status = status;
  if (position !== undefined) task.position = position;

  // Set completedAt if task is moved to done
  if (status === 'done' && task.status !== 'done') {
    task.completedAt = new Date();
  } else if (status !== 'done') {
    task.completedAt = null;
  }

  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate('assignee', 'name username avatarUrl')
    .populate('reporter', 'name username avatarUrl')
    .populate('project', 'name')
    .populate('team', 'name');

  res.json({ success: true, data: populatedTask });
});

// @desc    Assign task to user
// @route   PATCH /api/tasks/:id/assign
// @access  Private
export const assignTask = asyncHandler(async (req, res) => {
  const { assigneeId } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  task.assignee = assigneeId;
  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate('assignee', 'name username avatarUrl')
    .populate('reporter', 'name username avatarUrl')
    .populate('project', 'name')
    .populate('team', 'name');

  res.json({ success: true, data: populatedTask });
});

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { content, mentions } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const comment = await Comment.create({
    task: req.params.id,
    author: req.user._id,
    content,
    mentions: mentions || [],
  });

  const populatedComment = await Comment.findById(comment._id)
    .populate('author', 'name username avatarUrl')
    .populate('mentions', 'name username');

  res.status(201).json({ success: true, data: populatedComment });
});

// @desc    Get task comments
// @route   GET /api/tasks/:id/comments
// @access  Private
export const getTaskComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ task: req.params.id })
    .populate('author', 'name username avatarUrl')
    .populate('mentions', 'name username')
    .sort({ createdAt: 1 });

  res.json({ success: true, data: comments });
});

// @desc    Update comment
// @route   PUT /api/tasks/:taskId/comments/:commentId
// @access  Private
export const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this comment');
  }

  comment.content = content;
  comment.edited = true;
  comment.editedAt = new Date();
  await comment.save();

  const populatedComment = await Comment.findById(comment._id)
    .populate('author', 'name username avatarUrl')
    .populate('mentions', 'name username');

  res.json({ success: true, data: populatedComment });
});

// @desc    Delete comment
// @route   DELETE /api/tasks/:taskId/comments/:commentId
// @access  Private
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  await Comment.findByIdAndDelete(req.params.commentId);

  res.json({ success: true, message: 'Comment deleted successfully' });
});

// @desc    Update checklist item
// @route   PATCH /api/tasks/:id/checklist
// @access  Private
export const updateChecklist = asyncHandler(async (req, res) => {
  const { checklist } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  task.checklist = checklist;
  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate('assignee', 'name username avatarUrl')
    .populate('reporter', 'name username avatarUrl')
    .populate('project', 'name')
    .populate('team', 'name');

  res.json({ success: true, data: populatedTask });
});

// @desc    Duplicate task
// @route   POST /api/tasks/:id/duplicate
// @access  Private
export const duplicateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const duplicatedTask = await Task.create({
    title: `${task.title} (Copy)`,
    description: task.description,
    project: task.project,
    team: task.team,
    assignee: null,
    reporter: req.user._id,
    status: 'backlog',
    priority: task.priority,
    labels: task.labels,
    checklist: task.checklist,
    dueDate: null,
    estimatedTime: task.estimatedTime,
  });

  const populatedTask = await Task.findById(duplicatedTask._id)
    .populate('assignee', 'name username avatarUrl')
    .populate('reporter', 'name username avatarUrl')
    .populate('project', 'name')
    .populate('team', 'name');

  res.status(201).json({ success: true, data: populatedTask });
});

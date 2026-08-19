import asyncHandler from 'express-async-handler';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

// @desc    Get all conversations for a user
// @route   GET /api/conversations
// @access  Private
export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
  })
    .populate('participants', 'name username avatarUrl')
    .populate('lastMessage')
    .populate('team', 'name')
    .populate('project', 'name')
    .sort({ updatedAt: -1 });

  res.json({ success: true, data: conversations });
});

// @desc    Get single conversation by ID
// @route   GET /api/conversations/:id
// @access  Private
export const getConversationById = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id)
    .populate('participants', 'name username avatarUrl')
    .populate('team', 'name')
    .populate('project', 'name');

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Check if user is a participant
  if (!conversation.participants.some(p => p._id.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to access this conversation');
  }

  res.json({ success: true, data: conversation });
});

// @desc    Create a new conversation
// @route   POST /api/conversations
// @access  Private
export const createConversation = asyncHandler(async (req, res) => {
  const { type, participants, team, project, name } = req.body;

  // For private chats, ensure only 2 participants
  if (type === 'private' && participants.length !== 2) {
    res.status(400);
    throw new Error('Private conversations must have exactly 2 participants');
  }

  // Check if private conversation already exists
  if (type === 'private') {
    const existingConversation = await Conversation.findOne({
      type: 'private',
      participants: { $all: participants, $size: 2 },
    });

    if (existingConversation) {
      return res.json({ success: true, data: existingConversation });
    }
  }

  const conversation = await Conversation.create({
    type,
    participants: [...participants, req.user._id],
    team,
    project,
    name,
    createdBy: req.user._id,
  });

  const populatedConversation = await Conversation.findById(conversation._id)
    .populate('participants', 'name username avatarUrl')
    .populate('team', 'name')
    .populate('project', 'name');

  res.status(201).json({ success: true, data: populatedConversation });
});

// @desc    Update conversation (rename group)
// @route   PUT /api/conversations/:id
// @access  Private
export const updateConversation = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Only creator can update group name
  if (conversation.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this conversation');
  }

  conversation.name = name;
  await conversation.save();

  const populatedConversation = await Conversation.findById(conversation._id)
    .populate('participants', 'name username avatarUrl')
    .populate('team', 'name')
    .populate('project', 'name');

  res.json({ success: true, data: populatedConversation });
});

// @desc    Leave conversation
// @route   POST /api/conversations/:id/leave
// @access  Private
export const leaveConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Remove user from participants
  conversation.participants = conversation.participants.filter(
    p => p.toString() !== req.user._id.toString()
  );

  await conversation.save();

  res.json({ success: true, message: 'Left conversation successfully' });
});

// @desc    Delete conversation (group owner/admin)
// @route   DELETE /api/conversations/:id
// @access  Private
export const deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Only creator can delete
  if (conversation.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this conversation');
  }

  await Conversation.findByIdAndDelete(req.params.id);
  await Message.deleteMany({ conversation: req.params.id });

  res.json({ success: true, message: 'Conversation deleted successfully' });
});

// @desc    Get messages for a conversation
// @route   GET /api/conversations/:id/messages
// @access  Private
export const getMessages = asyncHandler(async (req, res) => {
  const { limit = 50, skip = 0 } = req.query;

  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Check if user is a participant
  if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to access this conversation');
  }

  const messages = await Message.find({ 
    conversation: req.params.id,
    deleted: false,
  })
    .populate('sender', 'name username avatarUrl')
    .populate('replyTo')
    .sort({ createdAt: -1 })
    .skip(parseInt(skip))
    .limit(parseInt(limit));

  res.json({ success: true, data: messages.reverse() });
});

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
  const { conversation, text, attachments, replyTo } = req.body;

  const conv = await Conversation.findById(conversation);

  if (!conv) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Check if user is a participant
  if (!conv.participants.some(p => p.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to send messages in this conversation');
  }

  const message = await Message.create({
    conversation,
    sender: req.user._id,
    text,
    attachments: attachments || [],
    replyTo,
    readBy: [req.user._id],
  });

  // Update conversation's last message
  conv.lastMessage = message._id;
  await conv.save();

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'name username avatarUrl')
    .populate('replyTo');

  res.status(201).json({ success: true, data: populatedMessage });
});

// @desc    Edit a message
// @route   PUT /api/messages/:id
// @access  Private
export const editMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  // Only sender can edit
  if (message.sender.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this message');
  }

  message.text = text;
  message.edited = true;
  message.editedAt = new Date();
  await message.save();

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'name username avatarUrl')
    .populate('replyTo');

  res.json({ success: true, data: populatedMessage });
});

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  // Only sender can delete
  if (message.sender.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this message');
  }

  message.deleted = true;
  message.deletedAt = new Date();
  await message.save();

  res.json({ success: true, message: 'Message deleted successfully' });
});

// @desc    Mark messages as read
// @route   PUT /api/conversations/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Check if user is a participant
  if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to access this conversation');
  }

  // Mark all unread messages as read
  await Message.updateMany(
    {
      conversation: req.params.id,
      sender: { $ne: req.user._id },
      readBy: { $ne: req.user._id },
    },
    {
      $push: { readBy: req.user._id },
    }
  );

  // Reset unread count for this user
  conversation.unreadCount.set(req.user._id.toString(), 0);
  await conversation.save();

  res.json({ success: true, message: 'Messages marked as read' });
});

// @desc    Pin a message
// @route   PUT /api/messages/:id/pin
// @access  Private
export const pinMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  const conversation = await Conversation.findById(message.conversation);

  // Check if user is a participant
  if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to pin messages in this conversation');
  }

  message.pinned = !message.pinned;
  await message.save();

  // Update conversation's pinned messages
  if (message.pinned) {
    conversation.pinned.push(message._id);
  } else {
    conversation.pinned = conversation.pinned.filter(p => p.toString() !== message._id.toString());
  }
  await conversation.save();

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'name username avatarUrl')
    .populate('replyTo');

  res.json({ success: true, data: populatedMessage });
});

// @desc    Search messages
// @route   GET /api/conversations/:id/search
// @access  Private
export const searchMessages = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Check if user is a participant
  if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to search in this conversation');
  }

  const messages = await Message.find({
    conversation: req.params.id,
    text: { $regex: query, $options: 'i' },
    deleted: false,
  })
    .populate('sender', 'name username avatarUrl')
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ success: true, data: messages });
});

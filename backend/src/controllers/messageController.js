import asyncHandler from 'express-async-handler';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

// @desc    Create a new conversation
// @route   POST /api/conversations
// @access  Private
export const createConversation = asyncHandler(async (req, res) => {
  const { type, participants, project, team } = req.body;

  // For private chats, ensure exactly 2 participants
  if (type === 'private' && participants.length !== 2) {
    res.status(400);
    throw new Error('Private conversations must have exactly 2 participants');
  }

  // Check if private conversation already exists
  if (type === 'private') {
    const existing = await Conversation.findOne({
      type: 'private',
      'participants.user': { $all: participants },
    });
    if (existing) {
      return res.json({
        success: true,
        conversation: await existing.populate('participants.user', 'name email avatarUrl'),
      });
    }
  }

  const conversation = await Conversation.create({
    type,
    participants: participants.map(p => ({ user: p })),
    project: project || null,
    team: team || null,
  });

  const populatedConversation = await Conversation.findById(conversation._id)
    .populate('participants.user', 'name email avatarUrl')
    .populate('project', 'name')
    .populate('team', 'name');

  res.status(201).json({
    success: true,
    conversation: populatedConversation,
  });
});

// @desc    Get user's conversations
// @route   GET /api/conversations
// @access  Private
export const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get conversations where user is participant OR public project/team conversations
  const conversations = await Conversation.find({
    $or: [
      { 'participants.user': userId },
      { type: { $in: ['project', 'team'] } },
    ],
  })
    .populate('participants.user', 'name email avatarUrl')
    .populate('lastMessage')
    .populate('project', 'name')
    .populate('team', 'name')
    .sort({ updatedAt: -1 });

  // Calculate total unread count for this user
  let totalUnread = 0;
  for (const conv of conversations) {
    const userUnread = conv.unreadCounts.find(u => u.user.toString() === userId.toString());
    if (userUnread) {
      totalUnread += userUnread.count;
    }
  }

  res.json({
    success: true,
    conversations,
    totalUnread,
  });
});

// @desc    Get single conversation
// @route   GET /api/conversations/:id
// @access  Private
export const getConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id)
    .populate('participants.user', 'name email avatarUrl')
    .populate('project', 'name')
    .populate('team', 'name');

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Allow access if user is participant OR if it's a public project/team conversation
  const isParticipant = conversation.participants.some(
    p => p.user._id.toString() === req.user._id.toString()
  );
  const isPublicConversation = conversation.type === 'project' || conversation.type === 'team';

  if (!isParticipant && !isPublicConversation) {
    res.status(403);
    throw new Error('Not authorized to access this conversation');
  }

  res.json({
    success: true,
    conversation,
  });
});

// @desc    Get messages in a conversation
// @route   GET /api/conversations/:conversationId/messages
// @access  Private
export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Allow access if user is participant OR if it's a public project/team conversation
  const isParticipant = conversation.participants.some(
    p => p.user._id.toString() === req.user._id.toString()
  );
  const isPublicConversation = conversation.type === 'project' || conversation.type === 'team';

  if (!isParticipant && !isPublicConversation) {
    res.status(403);
    throw new Error('Not authorized to access this conversation');
  }

  const skip = (page - 1) * limit;

  const messages = await Message.find({
    conversation: conversationId,
    isDeleted: false,
  })
    .populate('sender', 'name email avatarUrl')
    .populate('replyTo')
    .populate('readBy.user', 'name email avatarUrl')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Message.countDocuments({
    conversation: conversationId,
    isDeleted: false,
  });

  res.json({
    success: true,
    messages: messages.reverse(),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
  const { conversation, content, messageType = 'text', replyTo } = req.body;

  const conv = await Conversation.findById(conversation);
  if (!conv) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  const isParticipant = conv.participants.some(
    p => p.user._id.toString() === req.user._id.toString()
  );

  if (!isParticipant) {
    res.status(403);
    throw new Error('Not authorized to send messages to this conversation');
  }

  const message = await Message.create({
    conversation,
    sender: req.user._id,
    content,
    messageType,
    replyTo: replyTo || null,
  });

  // Update conversation's last message
  conv.lastMessage = message._id;
  await conv.save();

  // Increment unread count for all participants except sender
  for (const participant of conv.participants) {
    if (participant.user.toString() !== req.user._id.toString()) {
      await conv.incrementUnread(participant.user);
    }
  }

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'name email avatarUrl')
    .populate('replyTo');

  res.status(201).json({
    success: true,
    message: populatedMessage,
  });
});

// @desc    Mark conversation as read
// @route   POST /api/conversations/:conversationId/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  const isParticipant = conversation.participants.some(
    p => p.user._id.toString() === req.user._id.toString()
  );

  if (!isParticipant) {
    res.status(403);
    throw new Error('Not authorized to access this conversation');
  }

  await conversation.markAsRead(req.user._id);

  res.json({
    success: true,
    message: 'Conversation marked as read',
  });
});

// @desc    Add reaction to message
// @route   POST /api/messages/:messageId/reaction
// @access  Private
export const addReaction = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { emoji } = req.body;

  const message = await Message.findById(messageId);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  const conversation = await Conversation.findById(message.conversation);
  const isParticipant = conversation.participants.some(
    p => p.user._id.toString() === req.user._id.toString()
  );

  if (!isParticipant) {
    res.status(403);
    throw new Error('Not authorized to react to this message');
  }

  const existingReaction = message.reactions.find(r => r.emoji === emoji);
  if (existingReaction) {
    if (!existingReaction.users.includes(req.user._id)) {
      existingReaction.users.push(req.user._id);
    }
  } else {
    message.reactions.push({ emoji, users: [req.user._id] });
  }

  await message.save();

  const populatedMessage = await Message.findById(messageId)
    .populate('sender', 'name email avatarUrl')
    .populate('reactions.users', 'name email avatarUrl');

  res.json({
    success: true,
    message: populatedMessage,
  });
});

// @desc    Remove reaction from message
// @route   DELETE /api/messages/:messageId/reaction/:emoji
// @access  Private
export const removeReaction = asyncHandler(async (req, res) => {
  const { messageId, emoji } = req.params;

  const message = await Message.findById(messageId);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  const conversation = await Conversation.findById(message.conversation);
  const isParticipant = conversation.participants.some(
    p => p.user._id.toString() === req.user._id.toString()
  );

  if (!isParticipant) {
    res.status(403);
    throw new Error('Not authorized to modify this message');
  }

  const reaction = message.reactions.find(r => r.emoji === emoji);
  if (reaction) {
    reaction.users = reaction.users.filter(u => u.toString() !== req.user._id.toString());
    if (reaction.users.length === 0) {
      message.reactions = message.reactions.filter(r => r.emoji !== emoji);
    }
  }

  await message.save();

  const populatedMessage = await Message.findById(messageId)
    .populate('sender', 'name email avatarUrl')
    .populate('reactions.users', 'name email avatarUrl');

  res.json({
    success: true,
    message: populatedMessage,
  });
});

// @desc    Edit message
// @route   PUT /api/messages/:messageId
// @access  Private
export const editMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  const message = await Message.findById(messageId);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  if (message.sender.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this message');
  }

  if (message.isDeleted) {
    res.status(400);
    throw new Error('Cannot edit a deleted message');
  }

  message.content = content;
  message.isEdited = true;
  message.editedAt = Date.now();
  await message.save();

  const populatedMessage = await Message.findById(messageId)
    .populate('sender', 'name email avatarUrl')
    .populate('replyTo');

  res.json({
    success: true,
    message: populatedMessage,
  });
});

// @desc    Delete message (soft delete)
// @route   DELETE /api/messages/:messageId
// @access  Private
export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  if (message.sender.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this message');
  }

  message.isDeleted = true;
  message.deletedAt = Date.now();
  message.deletedBy = req.user._id;
  message.content = 'This message was deleted';
  await message.save();

  res.json({
    success: true,
    message: 'Message deleted successfully',
  });
});

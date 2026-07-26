import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    // Conversation type
    type: {
      type: String,
      enum: ['private', 'project', 'team'],
      required: true,
    },
    
    // Participants
    participants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        joinedAt: { type: Date, default: Date.now },
        lastReadAt: { type: Date },
        isOnline: { type: Boolean, default: false },
      },
    ],
    
    // For private chats, store the two users
    // For project/team chats, store the project/team reference
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    
    // Typing indicators
    typingUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
    // Last message for preview
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    
    // Unread message counts per user
    unreadCounts: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        count: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

// Index for finding conversations a user is in
conversationSchema.index({ 'participants.user': 1 });

// Index for project/team conversations
conversationSchema.index({ project: 1 });
conversationSchema.index({ team: 1 });

// Method to get unread count for a user
conversationSchema.methods.getUnreadCount = function(userId) {
  const unread = this.unreadCounts.find(u => u.user.toString() === userId.toString());
  return unread ? unread.count : 0;
};

// Method to increment unread count
conversationSchema.methods.incrementUnread = function(userId) {
  const unread = this.unreadCounts.find(u => u.user.toString() === userId.toString());
  if (unread) {
    unread.count += 1;
  } else {
    this.unreadCounts.push({ user: userId, count: 1 });
  }
  return this.save();
};

// Method to mark as read for a user
conversationSchema.methods.markAsRead = function(userId) {
  const unread = this.unreadCounts.find(u => u.user.toString() === userId.toString());
  if (unread) {
    unread.count = 0;
  }
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  if (participant) {
    participant.lastReadAt = new Date();
  }
  return this.save();
};

export default mongoose.model('Conversation', conversationSchema);

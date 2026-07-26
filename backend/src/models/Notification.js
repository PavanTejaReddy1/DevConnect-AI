import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    // Recipient
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Notification type
    type: {
      type: String,
      enum: ['project', 'task', 'chat', 'ai', 'admin', 'team', 'invite', 'mention'],
      required: true,
    },
    
    // Title
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    
    // Message/content
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    
    // Related entities
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    
    // Action URL (where clicking the notification should navigate)
    actionUrl: { type: String },
    
    // Read status
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    
    // Priority
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    
    // Metadata (flexible storage for additional data)
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Index for fetching user's notifications
notificationSchema.index({ recipient: 1, createdAt: -1 });

// Index for unread notifications
notificationSchema.index({ recipient: 1, isRead: 1 });

// Index for type filtering
notificationSchema.index({ recipient: 1, type: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);

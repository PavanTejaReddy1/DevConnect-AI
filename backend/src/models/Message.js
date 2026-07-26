import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    // The conversation this message belongs to
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    
    // Sender
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Message content
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    
    // Message type
    messageType: {
      type: String,
      enum: ['text', 'file', 'system'],
      default: 'text',
    },
    
    // File attachment (if messageType is 'file')
    file: {
      name: { type: String },
      url: { type: String },
      size: { type: Number },
      mimeType: { type: String },
    },
    
    // Read receipts
    readBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        readAt: { type: Date, default: Date.now },
      },
    ],
    
    // Emoji reactions
    reactions: [
      {
        emoji: { type: String, required: true },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      },
    ],
    
    // Reply to another message
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    
    // Edited flag
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    
    // Deleted flag (soft delete)
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Index for fetching messages in a conversation
messageSchema.index({ conversation: 1, createdAt: -1 });

// Index for sender
messageSchema.index({ sender: 1 });

export default mongoose.model('Message', messageSchema);

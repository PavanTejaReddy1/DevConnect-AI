import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    type: { 
      type: String, 
      enum: ['private', 'team', 'project', 'group'], 
      required: true,
      default: 'private'
    },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
    name: { type: String, default: null }, // For group chats
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
    unreadCount: { type: Map, of: Number, default: {} }, // userId -> count
    pinned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: [] }],
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ type: 1, team: 1 });
conversationSchema.index({ type: 1, project: 1 });
conversationSchema.index({ participants: 1, type: 1 });

export default mongoose.model('Conversation', conversationSchema);

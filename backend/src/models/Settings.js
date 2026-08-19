import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    accentColor: { type: String, default: 'indigo' },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      projectInvitations: { type: Boolean, default: true },
      teamInvitations: { type: Boolean, default: true },
      taskAssignments: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
      chatMessages: { type: Boolean, default: true },
    },
    privacy: {
      showEmail: { type: Boolean, default: false },
      showLastActive: { type: Boolean, default: true },
      allowMessages: { type: Boolean, default: true },
    },
    connectedAccounts: {
      github: { type: String, default: null },
      google: { type: String, default: null },
      linkedin: { type: String, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);

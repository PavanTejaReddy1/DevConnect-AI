import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 2000 },
    stack: [{ type: String, required: true }],
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'completed', 'on-hold', 'archived'],
      default: 'planning',
    },
    repository: { type: String, default: '' },
    demo: { type: String, default: '' },
    
    // Owner and team
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['owner', 'maintainer', 'contributor'], default: 'contributor' },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    
    // Collaboration
    maxMembers: { type: Number, default: 10 },
    invites: [
      {
        email: { type: String },
        token: { type: String },
        status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    
    // Comments
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    
    // Activity timeline
    activity: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        action: { type: String, required: true },
        description: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    
    // Files
    files: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        size: { type: Number },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    
    // Tags for filtering
    tags: [{ type: String }],
    
    // Visibility
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index for search
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Add activity helper method
projectSchema.methods.addActivity = function(userId, action, description = '') {
  this.activity.push({
    user: userId,
    action,
    description,
  });
  return this.save();
};

export default mongoose.model('Project', projectSchema);

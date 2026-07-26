import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, maxlength: 500, default: '' },
    
    // Owner and members
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { 
          type: String, 
          enum: ['owner', 'admin', 'member'], 
          default: 'member' 
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    
    // Join requests
    joinRequests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { 
          type: String, 
          enum: ['pending', 'accepted', 'rejected'], 
          default: 'pending' 
        },
        message: { type: String, maxlength: 300, default: '' },
        createdAt: { type: Date, default: Date.now },
        respondedAt: { type: Date },
      },
    ],
    
    // Invites
    invites: [
      {
        email: { type: String },
        token: { type: String },
        role: { 
          type: String, 
          enum: ['admin', 'member'], 
          default: 'member' 
        },
        status: { 
          type: String, 
          enum: ['pending', 'accepted', 'declined'], 
          default: 'pending' 
        },
        invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    
    // Team statistics
    stats: {
      projectsCompleted: { type: Number, default: 0 },
      activeProjects: { type: Number, default: 0 },
      totalTasks: { type: Number, default: 0 },
      completedTasks: { type: Number, default: 0 },
    },
    
    // Activity timeline
    activity: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        action: { type: String, required: true },
        description: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    
    // Tags for categorization
    tags: [{ type: String }],
    
    // Visibility
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for search
teamSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Add activity helper method
teamSchema.methods.addActivity = function(userId, action, description = '') {
  this.activity.push({
    user: userId,
    action,
    description,
  });
  return this.save();
};

export default mongoose.model('Team', teamSchema);

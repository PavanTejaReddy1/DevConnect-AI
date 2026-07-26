import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, maxlength: 2000, default: '' },
    
    // Status/Column
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'completed'],
      default: 'todo',
    },
    
    // Priority
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    
    // Assignment
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
    // Labels/Tags
    labels: [{ type: String }],
    
    // Due date
    dueDate: { type: Date },
    
    // Attachments
    attachments: [
      {
        name: { type: String },
        url: { type: String },
        size: { type: Number },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    
    // Checklist
    checklist: [
      {
        text: { type: String, required: true },
        completed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        completedAt: { type: Date },
      },
    ],
    
    // Comments
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true },
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
    
    // Project/Team association (optional)
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    
    // Created by
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Position for drag-drop ordering
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index for search
taskSchema.index({ title: 'text', description: 'text', labels: 'text' });

// Compound index for status and position for ordering
taskSchema.index({ status: 1, position: 1 });

// Add activity helper method
taskSchema.methods.addActivity = function(userId, action, description = '') {
  this.activity.push({
    user: userId,
    action,
    description,
  });
  return this.save();
};

export default mongoose.model('Task', taskSchema);

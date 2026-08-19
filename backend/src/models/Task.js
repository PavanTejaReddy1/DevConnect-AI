import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, maxlength: 2000, default: '' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['backlog', 'todo', 'in-progress', 'review', 'done'], 
      default: 'backlog' 
    },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'critical'], 
      default: 'medium' 
    },
    labels: [{ type: String }],
    attachments: [{
      name: String,
      url: String,
      size: Number,
      uploadedAt: { type: Date, default: Date.now }
    }],
    checklist: [{
      id: String,
      text: String,
      completed: { type: Boolean, default: false }
    }],
    dueDate: { type: Date, default: null },
    estimatedTime: { type: Number, default: null }, // in hours
    completedAt: { type: Date, default: null },
    position: { type: Number, default: 0 }, // for ordering within columns
  },
  { timestamps: true }
);

taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ team: 1, status: 1 });
taskSchema.index({ assignee: 1 });
taskSchema.index({ reporter: 1 });
taskSchema.index({ status: 1, position: 1 });

export default mongoose.model('Task', taskSchema);

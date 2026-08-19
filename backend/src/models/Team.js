import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, maxlength: 500, default: '' },
    logo: { type: String, default: '' },
    banner: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    skills: [{ type: String }],
    techStack: [{ type: String }],
    openPositions: [{ type: String }],
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  },
  { timestamps: true }
);

teamSchema.index({ name: 'text', description: 'text' });
teamSchema.index({ owner: 1 });
teamSchema.index({ members: 1 });

export default mongoose.model('Team', teamSchema);

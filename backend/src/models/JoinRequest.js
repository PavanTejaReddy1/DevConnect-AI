import mongoose from 'mongoose';

const joinRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    message: { type: String, maxlength: 300, default: '' },
  },
  { timestamps: true }
);

joinRequestSchema.index({ team: 1, status: 1 });
joinRequestSchema.index({ user: 1, status: 1 });

export default mongoose.model('JoinRequest', joinRequestSchema);

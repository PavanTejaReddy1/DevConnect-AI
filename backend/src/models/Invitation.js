import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    role: { type: String, enum: ['admin', 'member', 'viewer'], default: 'member' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    message: { type: String, maxlength: 300, default: '' },
  },
  { timestamps: true }
);

invitationSchema.index({ receiver: 1, status: 1 });
invitationSchema.index({ team: 1, status: 1 });

export default mongoose.model('Invitation', invitationSchema);

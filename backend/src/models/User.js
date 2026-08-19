import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },

    // Profile
    avatarUrl: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    bio: { type: String, maxlength: 500, default: '' },
    skills: [{ 
      name: { type: String },
      level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'intermediate' },
      category: { type: String, default: '' }
    }],
    experience: [{
      company: { type: String },
      role: { type: String },
      description: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      currentlyWorking: { type: Boolean, default: false }
    }],
    education: [{
      college: { type: String },
      degree: { type: String },
      branch: { type: String },
      year: { type: Number }
    }],
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    location: { type: String, default: '' },
    availability: {
      type: String,
      enum: ['available', 'busy', 'unavailable'],
      default: 'available',
    },

    // Password reset
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12); // Increased from 10 to 12 for better security
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);

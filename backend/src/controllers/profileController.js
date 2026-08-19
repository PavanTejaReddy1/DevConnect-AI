import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get current user's profile
// @route   GET /api/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({ success: true, data: user });
});

// @desc    Update current user's profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const {
    name,
    username,
    bio,
    skills,
    experience,
    education,
    github,
    linkedin,
    twitter,
    website,
    portfolio,
    location,
    availability,
    avatarUrl,
    coverImage,
  } = req.body;

  // Update fields if provided
  if (name !== undefined) user.name = name;
  if (username !== undefined) {
    // Check if username is taken by another user
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      res.status(400);
      throw new Error('Username already taken');
    }
    user.username = username.toLowerCase();
  }
  if (bio !== undefined) user.bio = bio;
  if (skills !== undefined) user.skills = skills;
  if (experience !== undefined) user.experience = experience;
  if (education !== undefined) user.education = education;
  if (github !== undefined) user.github = github;
  if (linkedin !== undefined) user.linkedin = linkedin;
  if (twitter !== undefined) user.twitter = twitter;
  if (website !== undefined) user.website = website;
  if (portfolio !== undefined) user.portfolio = portfolio;
  if (location !== undefined) user.location = location;
  if (availability !== undefined) user.availability = availability;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  if (coverImage !== undefined) user.coverImage = coverImage;

  await user.save();

  res.json({ success: true, data: user });
});

// @desc    Get user profile by username (public)
// @route   GET /api/profile/:username
// @access  Public
export const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username.toLowerCase() })
    .select('-password -resetPasswordToken -resetPasswordExpires');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({ success: true, data: user });
});

import asyncHandler from 'express-async-handler';
import Settings from '../models/Settings.js';
import User from '../models/User.js';

// @desc    Get user settings
// @route   GET /settings
// @access  Private
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne({ user: req.user._id });

  if (!settings) {
    // Create default settings
    settings = await Settings.create({ user: req.user._id });
  }

  res.json({ success: true, data: settings });
});

// @desc    Update user settings
// @route   PUT /settings
// @access  Private
export const updateSettings = asyncHandler(async (req, res) => {
  const { theme, accentColor, language, timezone, notifications, privacy } = req.body;

  let settings = await Settings.findOne({ user: req.user._id });

  if (!settings) {
    settings = await Settings.create({ user: req.user._id });
  }

  if (theme !== undefined) settings.theme = theme;
  if (accentColor !== undefined) settings.accentColor = accentColor;
  if (language !== undefined) settings.language = language;
  if (timezone !== undefined) settings.timezone = timezone;
  if (notifications !== undefined) settings.notifications = { ...settings.notifications, ...notifications };
  if (privacy !== undefined) settings.privacy = { ...settings.privacy, ...privacy };

  await settings.save();

  res.json({ success: true, data: settings });
});

// @desc    Change password
// @route   PUT /settings/password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password changed successfully' });
});

// @desc    Connect account
// @route   PUT /settings/connect-account
// @access  Private
export const connectAccount = asyncHandler(async (req, res) => {
  const { provider, accountId } = req.body;

  let settings = await Settings.findOne({ user: req.user._id });

  if (!settings) {
    settings = await Settings.create({ user: req.user._id });
  }

  if (provider === 'github') {
    settings.connectedAccounts.github = accountId;
  } else if (provider === 'google') {
    settings.connectedAccounts.google = accountId;
  } else if (provider === 'linkedin') {
    settings.connectedAccounts.linkedin = accountId;
  }

  await settings.save();

  res.json({ success: true, data: settings });
});

// @desc    Disconnect account
// @route   DELETE /settings/connect-account/:provider
// @access  Private
export const disconnectAccount = asyncHandler(async (req, res) => {
  const { provider } = req.params;

  let settings = await Settings.findOne({ user: req.user._id });

  if (!settings) {
    res.status(404);
    throw new Error('Settings not found');
  }

  if (provider === 'github') {
    settings.connectedAccounts.github = null;
  } else if (provider === 'google') {
    settings.connectedAccounts.google = null;
  } else if (provider === 'linkedin') {
    settings.connectedAccounts.linkedin = null;
  }

  await settings.save();

  res.json({ success: true, data: settings });
});

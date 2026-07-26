import asyncHandler from 'express-async-handler';
import aiService from '../services/aiService.js';

// @desc    Generate AI project description
// @route   POST /api/ai/project-description
// @access  Private
export const generateProjectDescription = asyncHandler(async (req, res) => {
  const { projectName, projectType, context } = req.body;

  const description = await aiService.generateProjectDescription(
    projectName,
    projectType,
    context
  );

  res.json({
    success: true,
    result: description,
  });
});

// @desc    Generate AI README
// @route   POST /api/ai/readme
// @access  Private
export const generateReadme = asyncHandler(async (req, res) => {
  const { projectName, description, techStack, features } = req.body;

  const readme = await aiService.generateReadme(
    projectName,
    description,
    techStack,
    features || []
  );

  res.json({
    success: true,
    result: readme,
  });
});

// @desc    Generate AI team recommendation
// @route   POST /api/ai/team-recommendation
// @access  Private
export const recommendTeam = asyncHandler(async (req, res) => {
  const { projectDescription, requiredSkills, teamSize } = req.body;

  const recommendation = await aiService.recommendTeam(
    projectDescription,
    requiredSkills,
    teamSize
  );

  res.json({
    success: true,
    result: recommendation,
  });
});

// @desc    Generate AI task breakdown
// @route   POST /api/ai/task-breakdown
// @access  Private
export const breakdownTasks = asyncHandler(async (req, res) => {
  const { projectDescription, deadline, complexity } = req.body;

  const breakdown = await aiService.breakdownTasks(
    projectDescription,
    deadline,
    complexity || 'medium'
  );

  res.json({
    success: true,
    result: breakdown,
  });
});

// @desc    Generate AI code review
// @route   POST /api/ai/code-review
// @access  Private
export const reviewCode = asyncHandler(async (req, res) => {
  const { code, language, context } = req.body;

  const review = await aiService.reviewCode(
    code,
    language,
    context
  );

  res.json({
    success: true,
    result: review,
  });
});

// @desc    Generate AI meeting summary
// @route   POST /api/ai/meeting-summary
// @access  Private
export const summarizeMeeting = asyncHandler(async (req, res) => {
  const { transcript, meetingType } = req.body;

  const summary = await aiService.summarizeMeeting(
    transcript,
    meetingType || 'standup'
  );

  res.json({
    success: true,
    result: summary,
  });
});

// @desc    Generate AI smart search
// @route   POST /api/ai/smart-search
// @access  Private
export const smartSearch = asyncHandler(async (req, res) => {
  const { query, context } = req.body;

  const result = await aiService.smartSearch(
    query,
    context
  );

  res.json({
    success: true,
    result,
  });
});

// @desc    Generate AI productivity insights
// @route   POST /api/ai/productivity-insights
// @access  Private
export const generateProductivityInsights = asyncHandler(async (req, res) => {
  const { tasksData, timeData, goals } = req.body;

  const insights = await aiService.generateProductivityInsights(
    tasksData,
    timeData,
    goals || []
  );

  res.json({
    success: true,
    result: insights,
  });
});

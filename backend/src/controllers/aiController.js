import asyncHandler from 'express-async-handler';
import {
  generateProjectDescription,
  generateReadme,
  generateTeamRecommendation,
  generateTaskBreakdown,
  generateCodeReview,
  generateMeetingSummary,
  generateSmartSearch,
  generateProductivityInsights,
} from '../services/aiService.js';

// @desc    Generate project description
// @route   POST /ai/project-description
// @access  Private
export const generateProjectDescriptionHandler = asyncHandler(async (req, res) => {
  const { title, category, techStack } = req.body;

  const result = await generateProjectDescription(title, category, techStack, req.user._id);

  res.json({ success: true, data: result });
});

// @desc    Generate README
// @route   POST /ai/readme
// @access  Private
export const generateReadmeHandler = asyncHandler(async (req, res) => {
  const { projectName, description, techStack, features } = req.body;

  const result = await generateReadme(projectName, description, techStack, features, req.user._id);

  res.json({ success: true, data: result });
});

// @desc    Generate team recommendations
// @route   POST /ai/team-recommendation
// @access  Private
export const generateTeamRecommendationHandler = asyncHandler(async (req, res) => {
  const { userSkills, userExperience, userInterests, previousProjects } = req.body;

  const result = await generateTeamRecommendation(
    userSkills,
    userExperience,
    userInterests,
    previousProjects,
    req.user._id
  );

  res.json({ success: true, data: result });
});

// @desc    Generate task breakdown
// @route   POST /ai/task-breakdown
// @access  Private
export const generateTaskBreakdownHandler = asyncHandler(async (req, res) => {
  const { projectIdea } = req.body;

  const result = await generateTaskBreakdown(projectIdea, req.user._id);

  res.json({ success: true, data: result });
});

// @desc    Generate code review
// @route   POST /ai/code-review
// @access  Private
export const generateCodeReviewHandler = asyncHandler(async (req, res) => {
  const { code, language } = req.body;

  const result = await generateCodeReview(code, language, req.user._id);

  res.json({ success: true, data: result });
});

// @desc    Generate meeting summary
// @route   POST /ai/meeting-summary
// @access  Private
export const generateMeetingSummaryHandler = asyncHandler(async (req, res) => {
  const { meetingNotes } = req.body;

  const result = await generateMeetingSummary(meetingNotes, req.user._id);

  res.json({ success: true, data: result });
});

// @desc    Generate smart search parameters
// @route   POST /ai/search
// @access  Private
export const generateSmartSearchHandler = asyncHandler(async (req, res) => {
  const { query, context } = req.body;

  const result = await generateSmartSearch(query, context, req.user._id);

  res.json({ success: true, data: result });
});

// @desc    Generate productivity insights
// @route   GET /ai/productivity
// @access  Private
export const generateProductivityInsightsHandler = asyncHandler(async (req, res) => {
  const { projects, tasks, activity, deadlines } = req.query;

  const result = await generateProductivityInsights(
    projects,
    tasks,
    activity,
    deadlines,
    req.user._id
  );

  res.json({ success: true, data: result });
});

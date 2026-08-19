import { getModel, isConfigured } from '../config/gemini.js';
import { PROMPTS } from '../utils/prompts.js';

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Rate limiting per user
const rateLimiter = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

function getCacheKey(prompt) {
  return Buffer.from(prompt).toString('base64');
}

function getCachedResponse(prompt) {
  const key = getCacheKey(prompt);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedResponse(prompt, data) {
  const key = getCacheKey(prompt);
  cache.set(key, { data, timestamp: Date.now() });
}

function checkRateLimit(userId) {
  const now = Date.now();
  const userRequests = rateLimiter.get(userId) || [];

  // Remove requests outside the window
  const validRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);

  if (validRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  validRequests.push(now);
  rateLimiter.set(userId, validRequests);
  return true;
}

export async function generateAIResponse(prompt, userId) {
  if (!isConfigured()) {
    throw new Error('AI service is not configured. Please set GEMINI_API_KEY.');
  }

  if (!checkRateLimit(userId)) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  // Check cache
  const cached = getCachedResponse(prompt);
  if (cached) {
    return cached;
  }

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    // Cache the response
    setCachedResponse(prompt, response);

    return response;
  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error('Failed to generate AI response. Please try again.');
  }
}

export async function generateProjectDescription(title, category, techStack, userId) {
  const prompt = PROMPTS.projectDescription(title, category, techStack);
  return generateAIResponse(prompt, userId);
}

export async function generateReadme(projectName, description, techStack, features, userId) {
  const prompt = PROMPTS.readme(projectName, description, techStack, features);
  return generateAIResponse(prompt, userId);
}

export async function generateTeamRecommendation(userSkills, userExperience, userInterests, previousProjects, userId) {
  const prompt = PROMPTS.teamRecommendation(userSkills, userExperience, userInterests, previousProjects);
  return generateAIResponse(prompt, userId);
}

export async function generateTaskBreakdown(projectIdea, userId) {
  const prompt = PROMPTS.taskBreakdown(projectIdea);
  return generateAIResponse(prompt, userId);
}

export async function generateCodeReview(code, language, userId) {
  const prompt = PROMPTS.codeReview(code, language);
  return generateAIResponse(prompt, userId);
}

export async function generateMeetingSummary(meetingNotes, userId) {
  const prompt = PROMPTS.meetingSummary(meetingNotes);
  return generateAIResponse(prompt, userId);
}

export async function generateSmartSearch(query, context, userId) {
  const prompt = PROMPTS.smartSearch(query, context);
  return generateAIResponse(prompt, userId);
}

export async function generateProductivityInsights(projects, tasks, activity, deadlines, userId) {
  const prompt = PROMPTS.productivityInsights(projects, tasks, activity, deadlines);
  return generateAIResponse(prompt, userId);
}

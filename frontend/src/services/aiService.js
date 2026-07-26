import api from './api.js';

export const aiService = {
  // Generate AI project description
  generateProjectDescription: async (data) => {
    const response = await api.post('/ai/project-description', data);
    return response.data;
  },

  // Generate AI README
  generateReadme: async (data) => {
    const response = await api.post('/ai/readme', data);
    return response.data;
  },

  // Generate AI team recommendation
  recommendTeam: async (data) => {
    const response = await api.post('/ai/team-recommendation', data);
    return response.data;
  },

  // Generate AI task breakdown
  breakdownTasks: async (data) => {
    const response = await api.post('/ai/task-breakdown', data);
    return response.data;
  },

  // Generate AI code review
  reviewCode: async (data) => {
    const response = await api.post('/ai/code-review', data);
    return response.data;
  },

  // Generate AI meeting summary
  summarizeMeeting: async (data) => {
    const response = await api.post('/ai/meeting-summary', data);
    return response.data;
  },

  // Generate AI smart search
  smartSearch: async (data) => {
    const response = await api.post('/ai/smart-search', data);
    return response.data;
  },

  // Generate AI productivity insights
  generateProductivityInsights: async (data) => {
    const response = await api.post('/ai/productivity-insights', data);
    return response.data;
  },
};

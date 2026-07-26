import api from './api.js';

export const projectService = {
  // Get all projects with optional filters
  getProjects: async (params = {}) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  // Get single project by ID
  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create new project
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  // Update project
  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Archive project
  archiveProject: async (id) => {
    const response = await api.patch(`/projects/${id}/archive`);
    return response.data;
  },

  // Join project
  joinProject: async (id) => {
    const response = await api.post(`/projects/${id}/join`);
    return response.data;
  },

  // Leave project
  leaveProject: async (id) => {
    const response = await api.post(`/projects/${id}/leave`);
    return response.data;
  },

  // Invite developer to project
  inviteDeveloper: async (id, email) => {
    const response = await api.post(`/projects/${id}/invite`, { email });
    return response.data;
  },

  // Accept project invite
  acceptInvite: async (id, token) => {
    const response = await api.post(`/projects/${id}/accept-invite/${token}`);
    return response.data;
  },

  // Add comment to project
  addComment: async (id, content) => {
    const response = await api.post(`/projects/${id}/comments`, { content });
    return response.data;
  },

  // Delete comment
  deleteComment: async (id, commentId) => {
    const response = await api.delete(`/projects/${id}/comments/${commentId}`);
    return response.data;
  },

  // Upload file to project
  uploadFile: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/projects/${id}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete file from project
  deleteFile: async (id, fileId) => {
    const response = await api.delete(`/projects/${id}/files/${fileId}`);
    return response.data;
  },
};

import api from './api.js';

export const taskService = {
  // Get all tasks with optional filters
  getTasks: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // Get single task by ID
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Reorder tasks (drag-drop)
  reorderTasks: async (tasks) => {
    const response = await api.put('/tasks/reorder', { tasks });
    return response.data;
  },

  // Add comment to task
  addComment: async (id, content) => {
    const response = await api.post(`/tasks/${id}/comments`, { content });
    return response.data;
  },

  // Delete comment
  deleteComment: async (id, commentId) => {
    const response = await api.delete(`/tasks/${id}/comments/${commentId}`);
    return response.data;
  },

  // Add checklist item
  addChecklistItem: async (id, text) => {
    const response = await api.post(`/tasks/${id}/checklist`, { text });
    return response.data;
  },

  // Update checklist item
  updateChecklistItem: async (id, itemId, completed) => {
    const response = await api.put(`/tasks/${id}/checklist/${itemId}`, { completed });
    return response.data;
  },

  // Delete checklist item
  deleteChecklistItem: async (id, itemId) => {
    const response = await api.delete(`/tasks/${id}/checklist/${itemId}`);
    return response.data;
  },

  // Upload attachment to task
  uploadAttachment: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/tasks/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete attachment from task
  deleteAttachment: async (id, attachmentId) => {
    const response = await api.delete(`/tasks/${id}/attachments/${attachmentId}`);
    return response.data;
  },
};

import api from './api.js';

export const messageService = {
  // Get all conversations
  getConversations: async () => {
    const response = await api.get('/conversations');
    return response.data;
  },

  // Get single conversation
  getConversation: async (id) => {
    const response = await api.get(`/conversations/${id}`);
    return response.data;
  },

  // Create conversation
  createConversation: async (data) => {
    const response = await api.post('/conversations', data);
    return response.data;
  },

  // Get messages in conversation
  getMessages: async (conversationId, params = {}) => {
    const response = await api.get(`/conversations/${conversationId}/messages`, { params });
    return response.data;
  },

  // Send message
  sendMessage: async (data) => {
    const response = await api.post('/messages', data);
    return response.data;
  },

  // Mark conversation as read
  markAsRead: async (conversationId) => {
    const response = await api.post(`/conversations/${conversationId}/read`);
    return response.data;
  },

  // Add reaction to message
  addReaction: async (messageId, emoji) => {
    const response = await api.post(`/messages/${messageId}/reaction`, { emoji });
    return response.data;
  },

  // Remove reaction from message
  removeReaction: async (messageId, emoji) => {
    const response = await api.delete(`/messages/${messageId}/reaction/${emoji}`);
    return response.data;
  },

  // Edit message
  editMessage: async (messageId, content) => {
    const response = await api.put(`/messages/${messageId}`, { content });
    return response.data;
  },

  // Delete message
  deleteMessage: async (messageId) => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  },

  // Upload file for message
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/messages/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

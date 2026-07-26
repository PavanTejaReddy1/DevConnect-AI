import api from './api.js';

export const notificationService = {
  // Get all notifications with optional filters
  getNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  // Get single notification
  getNotification: async (id) => {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },

  // Create notification (admin only)
  createNotification: async (data) => {
    const response = await api.post('/notifications', data);
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (type = null) => {
    const response = await api.put('/notifications/read-all', type ? { type } : {});
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  // Clear all read notifications
  clearReadNotifications: async () => {
    const response = await api.delete('/notifications/clear-read');
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },
};

import api from './api.js';

export const teamService = {
  // Get all teams with optional filters
  getTeams: async (params = {}) => {
    const response = await api.get('/teams', { params });
    return response.data;
  },

  // Get single team by ID
  getTeamById: async (id) => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  },

  // Create new team
  createTeam: async (teamData) => {
    const response = await api.post('/teams', teamData);
    return response.data;
  },

  // Update team
  updateTeam: async (id, teamData) => {
    const response = await api.put(`/teams/${id}`, teamData);
    return response.data;
  },

  // Delete team
  deleteTeam: async (id) => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  },

  // Request to join team
  requestToJoin: async (id, message) => {
    const response = await api.post(`/teams/${id}/join-request`, { message });
    return response.data;
  },

  // Respond to join request
  respondToJoinRequest: async (id, requestId, status) => {
    const response = await api.put(`/teams/${id}/join-requests/${requestId}`, { status });
    return response.data;
  },

  // Invite member to team
  inviteMember: async (id, email, role = 'member') => {
    const response = await api.post(`/teams/${id}/invite`, { email, role });
    return response.data;
  },

  // Accept team invite
  acceptInvite: async (id, token) => {
    const response = await api.post(`/teams/${id}/accept-invite/${token}`);
    return response.data;
  },

  // Leave team
  leaveTeam: async (id) => {
    const response = await api.post(`/teams/${id}/leave`);
    return response.data;
  },

  // Remove member from team
  removeMember: async (id, memberId) => {
    const response = await api.delete(`/teams/${id}/members/${memberId}`);
    return response.data;
  },

  // Update member role
  updateMemberRole: async (id, memberId, role) => {
    const response = await api.put(`/teams/${id}/members/${memberId}/role`, { role });
    return response.data;
  },

  // Update team statistics
  updateTeamStats: async (id, stats) => {
    const response = await api.put(`/teams/${id}/stats`, stats);
    return response.data;
  },
};

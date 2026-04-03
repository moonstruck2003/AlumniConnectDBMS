import api from './api';

const messageService = {
  getConversations: (userId) => api.get(`/users/${userId}/conversations`),
  getMessages: (conversationId) => api.get(`/conversations/${conversationId}/messages`),
  send: (conversationId, data) => api.post(`/conversations/${conversationId}/messages`, data),
  start: (receiverId) => api.post('/conversations', { receiver_id: receiverId }),
};

export default messageService;

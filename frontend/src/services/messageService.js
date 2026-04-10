import api from './api';

const messageService = {
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (receiverId, content) => api.post('/messages', { receiver_id: receiverId, content: content }),
};

export default messageService;

import api from './api';

export const getNotifications = async () => {
  return await api.get('/notifications');
};

export const getUnreadCount = async () => {
  return await api.get('/notifications/unread-count');
};

export const markAsRead = async (id) => {
  return await api.patch(`/notifications/${id}/read`);
};

export const markAllAsRead = async () => {
  return await api.post('/notifications/mark-all-read');
};

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
};

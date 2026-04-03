import api from './api';

const userService = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (id, data) => api.put(`/users/${id}`, data),
  getAlumni: () => api.get('/alumni'),
  getStats: () => api.get('/dashboard/stats'),
};

export default userService;

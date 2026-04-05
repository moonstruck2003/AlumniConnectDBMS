import api from './api';

const userService = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  getAlumni: () => api.get('/alumni'),
  getStats: () => api.get('/dashboard/stats'),
  deleteAccount: () => api.delete('/profile'),
};

export default userService;

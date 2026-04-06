import api from './api';

const authService = {
  login: (credentials) => api.post('/login', credentials),

  register: (data) => api.post('/signup', data),

  logout: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.post('/logout');
      } catch {
        // Token may already be invalid; still clear client session
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  refreshToken: () => api.post('/auth/refresh'),

  fetchCurrentUser: async () => {
    const data = await api.get('/auth/me');
    if (data?.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data?.user;
  },

  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  },

  isAuthenticated: () => !!localStorage.getItem('token'),
};

export default authService;

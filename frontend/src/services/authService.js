import api from './api';

const authService = {
  login: (credentials) => api.post('/login', credentials),
  register: (data) => api.post('/register', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => JSON.parse(localStorage.getItem('user')),
  isAuthenticated: () => !!localStorage.getItem('token'),
};

export default authService;

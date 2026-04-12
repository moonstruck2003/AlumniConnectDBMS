import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const adminService = {
  login: async (username, password) => {
    const response = await axios.post(`${API_URL}/admin/login`, { username, password });
    if (response.data.admin_token) {
      localStorage.setItem('admin_token', response.data.admin_token);
      localStorage.setItem('admin_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  getCurrentAdmin: () => {
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  },

  getAdminToken: () => {
    return localStorage.getItem('admin_token');
  },

  getUsers: async () => {
    const token = localStorage.getItem('admin_token');
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: { 'X-Admin-Token': token }
    });
    return response.data.users;
  },

  toggleVerification: async (userId) => {
    const token = localStorage.getItem('admin_token');
    const response = await axios.patch(`${API_URL}/admin/users/${userId}/verify`, {}, {
      headers: { 'X-Admin-Token': token }
    });
    return response.data;
  },

  getJobs: async () => {
    const token = localStorage.getItem('admin_token');
    const response = await axios.get(`${API_URL}/admin/jobs`, { headers: { 'X-Admin-Token': token } });
    return response.data.jobs;
  },

  deleteJob: async (id) => {
    const token = localStorage.getItem('admin_token');
    const response = await axios.delete(`${API_URL}/admin/jobs/${id}`, { headers: { 'X-Admin-Token': token } });
    return response.data;
  },

  getEvents: async () => {
    const token = localStorage.getItem('admin_token');
    const response = await axios.get(`${API_URL}/admin/events`, { headers: { 'X-Admin-Token': token } });
    return response.data.events;
  },

  deleteEvent: async (id) => {
    const token = localStorage.getItem('admin_token');
    const response = await axios.delete(`${API_URL}/admin/events/${id}`, { headers: { 'X-Admin-Token': token } });
    return response.data;
  },

  getMentorships: async () => {
    const token = localStorage.getItem('admin_token');
    const response = await axios.get(`${API_URL}/admin/mentorships`, { headers: { 'X-Admin-Token': token } });
    return response.data.mentorships;
  },

  deleteMentorship: async (id) => {
    const token = localStorage.getItem('admin_token');
    const response = await axios.delete(`${API_URL}/admin/mentorships/${id}`, { headers: { 'X-Admin-Token': token } });
    return response.data;
  }
};

export default adminService;

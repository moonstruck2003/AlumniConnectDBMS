import api from './api';

const jobService = {
  getJobs: (params) => api.get('/jobs', { params }),
  getCategories: () => api.get('/jobs/categories'),
  postJob: (data) => api.post('/jobs', data),
  getMyJobs: () => api.get('/jobs/my-jobs'),
  toggleJob: (id) => api.post(`/jobs/${id}/toggle`),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getJobById: (id) => api.get(`/jobs/${id}`), // Note: Need verify if index/show logic is split
};

export default jobService;

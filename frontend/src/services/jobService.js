import api from './api';

const jobService = {
  getJobs: () => api.get('/jobs'),
  getJobDetails: (id) => api.get(`/jobs/${id}`),
  apply: (jobId, data) => api.post(`/jobs/${jobId}/apply`, data),
  getApplications: (userId) => api.get(`/users/${userId}/applications`),
  getCategories: () => api.get('/job-categories'),
};

export default jobService;

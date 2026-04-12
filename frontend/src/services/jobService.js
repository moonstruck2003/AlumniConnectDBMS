import api from './api';

const jobService = {
  getJobs: (params) => api.get('/jobs', { params }),
  getCategories: () => api.get('/jobs/categories'),
  postJob: (data) => api.post('/jobs', data),
  getMyJobs: () => api.get('/jobs/my-jobs'),
  toggleJob: (id) => api.post(`/jobs/${id}/toggle`),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getJobById: (id) => api.get(`/jobs/${id}`),
  applyJob: (id, formData) => api.post(`/jobs/${id}/apply`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getApplicants: (id) => api.get(`/jobs/${id}/applicants`),
  updateApplicationStatus: (id, status) => api.post(`/job-applications/${id}/status`, { status }),
};

export default jobService;

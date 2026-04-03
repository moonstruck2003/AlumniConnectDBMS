import api from './api';

const mentorshipService = {
  getMentorships: () => api.get('/mentorships'),
  getRequests: (userId) => api.get(`/users/${userId}/mentorship-requests`),
  request: (listingId, data) => api.post(`/mentorships/${listingId}/request`, data),
  getCoinBalance: (userId) => api.get(`/users/${userId}/coins`),
};

export default mentorshipService;

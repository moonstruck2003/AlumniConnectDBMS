import api from './api';

const dashboardService = {
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
  getActivities: async () => {
    try {
      const response = await api.get('/dashboard/activities');
      return response;
    } catch (error) {
      console.error('Error fetching dashboard activities:', error);
      throw error;
    }
  }
};

export default dashboardService;

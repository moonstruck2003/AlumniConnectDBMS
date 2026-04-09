import api from './api';

const alumniService = {
    /**
     * Get all alumni with profiles.
     */
    getAllAlumni: () => api.get('/alumni'),

    /**
     * Get detailed info for a single alumnus.
     */
    getAlumniById: (id) => api.get(`/alumni/${id}`),
};

export default alumniService;

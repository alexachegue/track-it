import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API calls
export const authAPI = {
    register: (userData) => api.post('/users/register', userData),
    login: (credentials) => api.post('/users/login', credentials),
    getCurrentUser: () => api.get('/users/me')
};

// Shift API calls
export const shiftAPI = {
    getAllShifts: () => api.get('/shifts'),
    getShift: (id) => api.get(`/shiftes/${id}`),
    createShift: (shiftData) => api.post('/shifts', shiftData),
    updateShift: (id, shiftData) => api.put(`/shifts/${id}`, shiftData),
    deleteShift: (id) => api.delete(`/shifts/${id}`)
};

export default api;
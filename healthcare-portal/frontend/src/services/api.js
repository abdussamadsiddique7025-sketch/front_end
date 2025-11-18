import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

export const patientAPI = {
  getDashboard: () => api.get('/patient/dashboard'),
  getProfile: () => api.get('/patient/profile'),
  updateProfile: (data) => api.put('/patient/profile', data),
  getGoals: () => api.get('/patient/goals'),
  createGoal: (data) => api.post('/patient/goals', data),
  updateGoal: (id, data) => api.put(`/patient/goals/${id}`, data),
  logGoalProgress: (id, data) => api.post(`/patient/goals/${id}/log`, data),
  getGoalLogs: (id) => api.get(`/patient/goals/${id}/logs`)
};

export const providerAPI = {
  getDashboard: () => api.get('/provider/dashboard'),
  getPatientDetails: (id) => api.get(`/provider/patients/${id}`),
  createReminder: (patientId, data) => api.post(`/provider/patients/${patientId}/reminders`, data)
};

export default api;
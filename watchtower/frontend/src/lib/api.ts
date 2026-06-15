import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('wt_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
  verifyEmail: (token: string) => api.get(`/auth/verify-email?token=${token}`),
};

// Monitors
export const monitorsApi = {
  getAll: () => api.get('/monitors'),
  getOne: (id: string) => api.get(`/monitors/${id}`),
  create: (data: any) => api.post('/monitors', data),
  update: (id: string, data: any) => api.put(`/monitors/${id}`, data),
  delete: (id: string) => api.delete(`/monitors/${id}`),
  pause: (id: string) => api.patch(`/monitors/${id}/pause`),
  stats: () => api.get('/monitors/stats'),
};

// Incidents
export const incidentsApi = {
  getAll: (params?: any) => api.get('/incidents', { params }),
  getChecks: (monitorId: string, params?: any) => api.get(`/incidents/checks/${monitorId}`, { params }),
};

// Alerts
export const alertsApi = {
  getAll: () => api.get('/alerts'),
  create: (data: any) => api.post('/alerts', data),
  update: (id: string, data: any) => api.put(`/alerts/${id}`, data),
  delete: (id: string) => api.delete(`/alerts/${id}`),
};

// Profile
export const profileApi = {
  update: (data: any) => api.put('/profile/update', data),
  changePassword: (data: any) => api.put('/profile/change-password', data),
};

import axios from 'axios';

// URL de producción (Render)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backendgridbarbers.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.reload();
    }
    if (error.response?.status === 409) {
      alert('El horario seleccionado ya no está disponible. Por favor elige otro horario.');
    }
    return Promise.reject(error);
  }
);

export const barbersAPI = {
  getAll: () => api.get('/barbers'),
  create: (barber) => api.post('/barbers', barber),
  update: (id, barber) => api.put(`/barbers/${id}`, barber),
  delete: (id) => api.delete(`/barbers/${id}`),
};

export const servicesAPI = {
  getAll: () => api.get('/services'),
};

export const appointmentsAPI = {
  create: (appointment) => api.post('/appointments', appointment),
  getByDate: (date, barberId) => api.get(`/appointments?date=${date}&barber_id=${barberId}`),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  confirm: (id) => api.put(`/appointments/${id}/confirm`),
  getAll: (date = '') => api.get(`/appointments/all${date ? `?date=${date}` : ''}`),
  getStats: () => api.get('/appointments/stats'),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};
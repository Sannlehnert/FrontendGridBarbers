import axios from 'axios';

// URL de producción (Render)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-grid-barbers-k2jy.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos timeout para cold start
});

// Interceptor para mostrar loading global
let loadingCount = 0;

api.interceptors.request.use((config) => {
  loadingCount++;
  if (loadingCount === 1) {
    // Mostrar loading global
    document.body.classList.add('loading');
  }
  
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    loadingCount--;
    if (loadingCount === 0) {
      document.body.classList.remove('loading');
    }
    return response;
  },
  (error) => {
    loadingCount--;
    if (loadingCount === 0) {
      document.body.classList.remove('loading');
    }
    
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      alert('El servidor está tardando en responder. Esto es normal la primera vez. Intenta nuevamente en 30 segundos.');
    }
    
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
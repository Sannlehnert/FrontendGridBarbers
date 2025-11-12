import axios from 'axios';

// Configuración para diferentes entornos
const getApiBaseUrl = () => {
  // En desarrollo
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  // En producción
  return import.meta.env.VITE_API_URL || 'https://backendgridbarbers.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log(`🚀 Conectando a API: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos timeout
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
    console.error('🔴 API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.error || error.message
    });

    // Manejo específico de errores
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      // Solo recargar si estamos en el panel admin
      if (window.location.pathname.includes('/admin')) {
        window.location.reload();
      }
    }
    
    if (error.response?.status === 409) {
      alert('⏰ El horario seleccionado ya no está disponible. Por favor elige otro horario.');
    }

    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
      alert('🔌 Error de conexión. Verifica tu internet o intenta más tarde.');
    }

    return Promise.reject(error);
  }
);

// Funciones de API con mejor manejo de errores
export const barbersAPI = {
  getAll: () => api.get('/barbers'),
  create: (barber) => api.post('/barbers', barber, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, barber) => api.put(`/barbers/${id}`, barber, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
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
  getAll: (date = '') => {
    const url = date ? `/appointments/all?date=${date}` : '/appointments/all';
    return api.get(url);
  },
  getStats: () => api.get('/appointments/stats'),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

// Función para verificar salud del backend
export const healthCheck = () => api.get('/health');
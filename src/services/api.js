// Mock data API for offline functionality
// All API calls now use local storage and in-memory operations

import {
  mockBarbersAPI,
  mockServicesAPI,
  mockAppointmentsAPI,
  mockAuthAPI,
  mockHealthCheck
} from './mockData.js';

console.log(`🚀 Modo OFFLINE: Usando datos simulados localmente`);

// Funciones de API con datos simulados para funcionamiento offline
export const barbersAPI = mockBarbersAPI;
export const servicesAPI = mockServicesAPI;
export const appointmentsAPI = mockAppointmentsAPI;
export const authAPI = mockAuthAPI;

// Función para verificar salud del sistema offline
export const healthCheck = mockHealthCheck;

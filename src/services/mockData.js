// Mock data service for offline functionality
// Replaces all backend API calls with local storage and in-memory operations

// Mock data structures
let mockBarbers = [
  {
    id: 1,
    name: 'Carlos Rodríguez',
    email: 'carlos@gridbarbers.com',
    phone: '+541123456789',
    image_url: '/img/logo.png', // Using the existing logo as placeholder
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Miguel Ángel',
    email: 'miguel@gridbarbers.com',
    phone: '+541123456790',
    image_url: '/img/logo.png',
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: 3,
    name: 'David López',
    email: 'david@gridbarbers.com',
    phone: '+541123456791',
    image_url: '/img/logo.png',
    created_at: '2024-01-03T00:00:00Z'
  }
];

let mockServices = [
  {
    id: 1,
    name: 'Corte Degradé',
    description: 'Corte de pelo con desvanecido perfecto',
    price: 28000,
    duration: 40
  },
  {
    id: 2,
    name: 'Corte + Barba',
    description: 'Corte con degradé y perfilado completo de barba con navaja',
    price: 38000,
    duration: 60
  },
  {
    id: 3,
    name: 'Perfilado de Barba',
    description: 'Diseño, recorte y delineado de barba a navaja y productos',
    price: 18000,
    duration: 25
  },
  {
    id: 4,
    name: 'Corte Base',
    description: 'Corte uniforme sin degradé o estilo clásico definido',
    price: 25000,
    duration: 30
  },
  {
    id: 5,
    name: 'Global (Coloración Completa)',
    description: 'Aplicación de color uniforme en toda la cabeza',
    price: 120000,
    duration: 210
  },
  {
    id: 6,
    name: 'Mechas',
    description: 'Reflejos, mechas selectivas',
    price: 65000,
    duration: 150
  }
];

let mockAppointments = [];
let mockAdminUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin'
  },
  {
    id: 2,
    username: 'staff',
    password: 'staff123',
    name: 'Staff Member',
    role: 'staff'
  }
];

// Local storage keys
const STORAGE_KEYS = {
  BARBERS: 'mock_barbers',
  SERVICES: 'mock_services',
  APPOINTMENTS: 'mock_appointments',
  ADMIN_TOKEN: 'adminToken',
  ADMIN_USER: 'adminUser'
};

// Utility functions for local storage
const loadFromStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Initialize data from localStorage or use defaults
const initializeData = () => {
  mockBarbers = loadFromStorage(STORAGE_KEYS.BARBERS, mockBarbers);
  mockServices = loadFromStorage(STORAGE_KEYS.SERVICES, mockServices);
  mockAppointments = loadFromStorage(STORAGE_KEYS.APPOINTMENTS, mockAppointments);
};

// Initialize on module load
initializeData();

// Mock API functions
export const mockBarbersAPI = {
  getAll: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: mockBarbers };
  },

  create: async (barberData) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newBarber = {
      id: Date.now(), // Simple ID generation
      ...barberData,
      created_at: new Date().toISOString()
    };

    // Handle file upload simulation
    if (barberData.image) {
      newBarber.image_url = '/img/logo.png'; // Use logo as placeholder
    }

    mockBarbers.push(newBarber);
    saveToStorage(STORAGE_KEYS.BARBERS, mockBarbers);

    return { data: newBarber };
  },

  update: async (id, barberData) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = mockBarbers.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Barbero no encontrado');
    }

    const updatedBarber = {
      ...mockBarbers[index],
      ...barberData
    };

    // Handle file upload simulation
    if (barberData.image) {
      updatedBarber.image_url = '/img/logo.png'; // Use logo as placeholder
    }

    mockBarbers[index] = updatedBarber;
    saveToStorage(STORAGE_KEYS.BARBERS, mockBarbers);

    return { data: updatedBarber };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = mockBarbers.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Barbero no encontrado');
    }

    // Check if barber has appointments
    const hasAppointments = mockAppointments.some(a => a.barber_id === id);
    if (hasAppointments) {
      throw new Error('No se puede eliminar un barbero con turnos asignados');
    }

    mockBarbers.splice(index, 1);
    saveToStorage(STORAGE_KEYS.BARBERS, mockBarbers);

    return { data: { message: 'Barbero eliminado exitosamente' } };
  }
};

export const mockServicesAPI = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { data: mockServices };
  }
};

export const mockAppointmentsAPI = {
  create: async (appointmentData) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validate barber exists
    const barber = mockBarbers.find(b => b.id === appointmentData.barber_id);
    if (!barber) {
      throw new Error('Barbero no encontrado');
    }

    // Validate service exists
    const service = mockServices.find(s => s.id === appointmentData.service_id);
    if (!service) {
      throw new Error('Servicio no encontrado');
    }

    // Check for time conflicts
    const appointmentDateTime = new Date(appointmentData.appointment_date);
    const conflictingAppointment = mockAppointments.find(a =>
      a.barber_id === appointmentData.barber_id &&
      new Date(a.appointment_date).getTime() === appointmentDateTime.getTime() &&
      a.status !== 'cancelled'
    );

    if (conflictingAppointment) {
      const error = new Error('Horario no disponible');
      error.response = { status: 409, data: { error: 'El horario seleccionado ya no está disponible. Por favor elige otro horario.' } };
      throw error;
    }

    const newAppointment = {
      id: Date.now(),
      ...appointmentData,
      status: 'pending',
      created_at: new Date().toISOString(),
      barber_name: barber.name,
      service_name: service.name,
      price: service.price,
      duration: service.duration
    };

    mockAppointments.push(newAppointment);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, mockAppointments);

    return { data: newAppointment };
  },

  getByDate: async (date, barberId) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const appointments = mockAppointments.filter(a => {
      const appointmentDate = new Date(a.appointment_date).toISOString().split('T')[0];
      return appointmentDate === date &&
             a.barber_id === barberId &&
             a.status !== 'cancelled';
    });

    return { data: appointments };
  },

  cancel: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const appointment = mockAppointments.find(a => a.id === id);
    if (!appointment) {
      throw new Error('Turno no encontrado');
    }

    appointment.status = 'cancelled';
    appointment.updated_at = new Date().toISOString();

    saveToStorage(STORAGE_KEYS.APPOINTMENTS, mockAppointments);

    return { data: appointment };
  },

  confirm: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const appointment = mockAppointments.find(a => a.id === id);
    if (!appointment) {
      throw new Error('Turno no encontrado');
    }

    appointment.status = 'confirmed';
    appointment.updated_at = new Date().toISOString();

    saveToStorage(STORAGE_KEYS.APPOINTMENTS, mockAppointments);

    return { data: appointment };
  },

  getAll: async (date = '') => {
    await new Promise(resolve => setTimeout(resolve, 300));

    let appointments = mockAppointments;

    if (date) {
      appointments = appointments.filter(a => {
        const appointmentDate = new Date(a.appointment_date).toISOString().split('T')[0];
        return appointmentDate === date;
      });
    }

    // Sort by date descending
    appointments.sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

    return { data: appointments };
  },

  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = mockAppointments.filter(a => {
      const appointmentDate = new Date(a.appointment_date).toISOString().split('T')[0];
      return appointmentDate === today;
    });

    const stats = {
      today: todayAppointments.length,
      confirmed: mockAppointments.filter(a => a.status === 'confirmed').length,
      cancelled: mockAppointments.filter(a => a.status === 'cancelled').length,
      total: mockAppointments.length
    };

    return { data: stats };
  }
};

export const mockAuthAPI = {
  login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockAdminUsers.find(u =>
      u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      const error = new Error('Credenciales inválidas');
      error.response = { status: 401, data: { error: 'Usuario o contraseña incorrectos' } };
      throw error;
    }

    // Create mock token
    const token = `mock_token_${user.id}_${Date.now()}`;

    return {
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role
        }
      }
    };
  }
};

// Mock health check
export const mockHealthCheck = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return { data: { status: 'ok', mode: 'offline' } };
};

// Export for debugging/testing
export const getMockData = () => ({
  barbers: mockBarbers,
  services: mockServices,
  appointments: mockAppointments,
  adminUsers: mockAdminUsers
});

export const resetMockData = () => {
  localStorage.removeItem(STORAGE_KEYS.BARBERS);
  localStorage.removeItem(STORAGE_KEYS.SERVICES);
  localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
  localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
  initializeData();
};

import React, { useState, useEffect } from 'react';
import BarberSelection from './components/BarberSelection';
import ServiceSelection from './components/ServiceSelection';
import DatePicker from './components/DatePicker';
import TimeSlot from './components/TimeSlot';
import AppointmentForm from './components/AppointmentForm';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import ThemeToggle from './components/ThemeToggle';
import { NotificationProvider, useNotification } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { barbersAPI, servicesAPI } from './services/api';

function AppContent() {
  const [step, setStep] = useState(1);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [view, setView] = useState('client');
  const [adminUser, setAdminUser] = useState(null);

  const { showSuccess, showError, showInfo } = useNotification();

  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      setAdminUser(JSON.parse(savedUser));
    }
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [barbersRes, servicesRes] = await Promise.all([
        barbersAPI.getAll(),
        servicesAPI.getAll()
      ]);
      setBarbers(barbersRes.data);
      setServices(servicesRes.data);
      showSuccess('Datos cargados correctamente', 3000);
    } catch (error) {
      console.error('Error loading data:', error);
      showError('Error al cargar los datos. Inténtalo de nuevo.');
    }
  };

  // Navegación intuitiva - un solo paso a la vez
  const handleBarberSelect = (barber) => {
    setSelectedBarber(barber);
    setStep(2);
    showInfo(`Barbero seleccionado: ${barber.name}`, 2000);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(3);
    showInfo(`Servicio seleccionado: ${service.name}`, 2000);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setStep(4);
    showInfo(`Fecha seleccionada: ${new Date(date).toLocaleDateString('es-ES')}`, 2000);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(5);
    showInfo(`Horario seleccionado: ${time}`, 2000);
  };

  const handleAppointmentSuccess = () => {
    setStep(6);
    showSuccess('¡Tu turno ha sido reservado exitosamente!', 5000);
  };

  const reset = () => {
    setStep(1);
    setSelectedBarber(null);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    showInfo('Reserva reiniciada', 2000);
  };

  const handleAdminLogin = (user) => {
    setAdminUser(user);
    setView('admin');
    showSuccess(`Bienvenido, ${user.name}!`, 3000);
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    setView('client');
    reset();
    showInfo('Sesión cerrada correctamente', 2000);
  };

  // Vista cliente - DISEÑO INTUITIVO PREMIUM
  if (view === 'client') {
    return (
      <div className="min-h-screen bg-barberCream dark:bg-gray-900 py-4 sm:py-6 fade-in">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header con identidad de barbería */}
          <div className="text-center mb-8 slide-up">
            {/* Logo Barbería Clásica */}
            <div className="flex justify-center items-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-barberRed rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                  <img
                    src="/img/logo.png"
                    alt="Grid Barbers Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-bold text-barberDark dark:text-white mb-2">
              Grid Barbers
            </h1>
            <p className="text-barberGray dark:text-gray-300 text-base sm:text-lg max-w-md mx-auto leading-relaxed px-2">
              Reserva tu corte perfecto en 5 minutos
            </p>

            {/* Progreso Visual Mejorado */}
            <div className="mt-6 sm:mt-8 max-w-2xl mx-auto px-2">
              <div className="flex items-center justify-between mb-2">
                {['Barbero', 'Servicio', 'Fecha', 'Hora', 'Listo'].map((label, index) => (
                  <div key={label} className="text-center flex-1">
                    <div className={`text-xs sm:text-sm font-medium ${step > index + 1 ? 'text-barberBlue' :
                        step === index + 1 ? 'text-barberRed' : 'text-barberGray'
                      }`}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <React.Fragment key={s}>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-500 ${step >= s
                        ? 'bg-barberRed text-barberWhite shadow-lg transform scale-110'
                        : 'bg-white text-barberGray border-2 border-barberGray'
                      }`}>
                      {s}
                    </div>
                    {s < 5 && (
                      <div className={`flex-1 h-1 transition-all duration-500 ${step > s ? 'bg-barberRed' : 'bg-gray-200'
                        }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Acceso Admin Discreto */}
            <div className="mt-6 flex justify-center items-center gap-4">
              <button
                onClick={() => setView('admin')}
                className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-barberGray dark:text-gray-300 text-sm transition-all duration-300 border border-barberGray border-opacity-30 hover:border-barberBlue px-4 py-2 rounded-full hover-lift"
              >
                🛠️ Acceso Staff
              </button>
            </div>
          </div>

          {/* Contenido de Pasos con Transiciones Suaves */}
          <div className="slide-up">
            {step === 1 && (
              <BarberSelection barbers={barbers} onSelect={handleBarberSelect} />
            )}

            {step === 2 && (
              <ServiceSelection
                services={services}
                onSelect={handleServiceSelect}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <DatePicker
                onSelect={handleDateSelect}
                onBack={() => setStep(2)}
              />
            )}

            {step === 4 && (
              <TimeSlot
                barber={selectedBarber}
                service={selectedService}
                date={selectedDate}
                onSelect={handleTimeSelect}
                onBack={() => setStep(3)}
              />
            )}

            {step === 5 && (
              <AppointmentForm
                barber={selectedBarber}
                service={selectedService}
                date={selectedDate}
                time={selectedTime}
                onSuccess={handleAppointmentSuccess}
                onBack={() => setStep(4)}
              />
            )}

            {step === 6 && (
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 text-center border border-barberCream hover-lift">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-barberRed to-barberBlue rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <span className="text-2xl sm:text-3xl text-barberWhite">✓</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-barberDark mb-4">
                  ¡Reserva Confirmada!
                </h2>

                <div className="bg-barberCream rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-barberDark">
                    <div className="space-y-2">
                      <p className="text-sm sm:text-base"><strong className="text-barberRed">Barbero:</strong> {selectedBarber?.name}</p>
                      <p className="text-sm sm:text-base"><strong className="text-barberRed">Servicio:</strong> {selectedService?.name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm sm:text-base"><strong className="text-barberRed">Fecha:</strong> {selectedDate}</p>
                      <p className="text-sm sm:text-base"><strong className="text-barberRed">Hora:</strong> {selectedTime}</p>
                      <p className="text-sm sm:text-base"><strong className="text-barberRed">Precio:</strong> ${selectedService?.price?.toLocaleString('es-ES')}</p>
                    </div>
                  </div>
                </div>

                <p className="text-barberGray mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base px-2">
                  Te esperamos en nuestra barbería. Por favor llega 5 minutos antes.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button
                    onClick={reset}
                    className="bg-barberRed hover:bg-barberRed/90 text-barberWhite px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift shadow-lg text-sm sm:text-base"
                  >
                    Nueva Reserva
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="bg-barberBlue hover:bg-barberBlue/90 text-barberWhite px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift shadow-lg text-sm sm:text-base"
                  >
                    Imprimir
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer con estilo clásico */}
          <div className="text-center mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-barberGray border-opacity-20">
            <p className="text-barberGray text-xs sm:text-sm px-2">
              Grid Barbers • Desde 2024
            </p>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <ThemeToggle />
      </div>
    );
  }

  // Vista administrador
  if (view === 'admin') {
    if (!adminUser) {
      return (
        <div className="min-h-screen bg-barberCream py-4 sm:py-6 fade-in">
          <AdminLogin onLogin={handleAdminLogin} onBack={() => setView('client')} />
          <ThemeToggle />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-barberCream py-4 sm:py-6 fade-in">
        <AdminPanel onBack={handleAdminLogout} user={adminUser} />
        <ThemeToggle />
      </div>
    );
  }
}

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;

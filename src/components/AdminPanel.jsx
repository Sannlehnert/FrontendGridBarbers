import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { appointmentsAPI, barbersAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

const AdminPanel = ({ onBack, user }) => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBarbers, setLoadingBarbers] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState({ today: 0, confirmed: 0, cancelled: 0, total: 0 });

  // Estados para gestión de barberos
  const [showBarberForm, setShowBarberForm] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);
  const [barberForm, setBarberForm] = useState({
    name: '',
    email: '',
    phone: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    if (activeTab === 'appointments') {
      loadAppointments();
      loadStats();
    } else if (activeTab === 'barbers') {
      loadBarbers();
    }
  }, [activeTab, selectedDate]);

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await appointmentsAPI.getAll(selectedDate);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error loading appointments:', error);
      showError('Error al cargar los turnos');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, showError]);

  const loadBarbers = useCallback(async () => {
    try {
      setLoadingBarbers(true);
      const response = await barbersAPI.getAll();
      setBarbers(response.data);
    } catch (error) {
      console.error('Error loading barbers:', error);
      showError('Error al cargar los barberos');
    } finally {
      setLoadingBarbers(false);
    }
  }, [showError]);

  const loadStats = useCallback(async () => {
    try {
      const response = await appointmentsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar este turno?')) {
      try {
        await appointmentsAPI.cancel(appointmentId);
        await loadAppointments();
        await loadStats();
        showSuccess('Turno cancelado exitosamente');
      } catch (error) {
        console.error('Error canceling appointment:', error);
        showError('Error al cancelar el turno');
      }
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    if (window.confirm('¿Estás seguro de que quieres confirmar este turno?')) {
      try {
        await appointmentsAPI.confirm(appointmentId);
        await loadAppointments();
        await loadStats();
        showSuccess('Turno confirmado exitosamente');
      } catch (error) {
        console.error('Error confirming appointment:', error);
        showError('Error al confirmar el turno');
      }
    }
  };

  // Funciones para gestión de barberos
  const handleBarberSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', barberForm.name);
      formData.append('email', barberForm.email);
      formData.append('phone', barberForm.phone);
      if (barberForm.image) {
        formData.append('image', barberForm.image);
      }

      if (editingBarber) {
        await barbersAPI.update(editingBarber.id, formData);
        showSuccess('Barbero actualizado exitosamente');
      } else {
        await barbersAPI.create(formData);
        showSuccess('Barbero creado exitosamente');
      }
      setShowBarberForm(false);
      setEditingBarber(null);
      setBarberForm({ name: '', email: '', phone: '', image: null });
      setImagePreview(null);
      loadBarbers();
    } catch (error) {
      console.error('Error saving barber:', error);
      showError('Error al guardar el barbero');
    }
  };

  const handleEditBarber = (barber) => {
    setEditingBarber(barber);
    setBarberForm({
      name: barber.name,
      email: barber.email,
      phone: barber.phone,
      image: null
    });

    // Manejar URL de imagen
    let imageUrl = barber.image_url;
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/img/')) {
      imageUrl = `${import.meta.env.VITE_API_URL?.replace('/api', '')}${barber.image_url}`;
    } else if (imageUrl && imageUrl.startsWith('/img/')) {
      // Si es una ruta local, la dejamos así
      imageUrl = imageUrl;
    }
    setImagePreview(imageUrl);
    setShowBarberForm(true);
  };

  const handleDeleteBarber = async (barberId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este barbero?')) {
      try {
        await barbersAPI.delete(barberId);
        showSuccess('Barbero eliminado exitosamente');
        loadBarbers();
      } catch (error) {
        console.error('Error deleting barber:', error);
        showError(error.response?.data?.error || 'Error al eliminar el barbero');
      }
    }
  };

  const resetBarberForm = () => {
    setShowBarberForm(false);
    setEditingBarber(null);
    setBarberForm({ name: '', email: '', phone: '', image: null });
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-barberCream dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-barberDark dark:text-white">
              Panel Administrador
            </h1>
            <p className="text-barberGray dark:text-gray-300 text-sm sm:text-base">
              Bienvenido, {user?.name} |{' '}
              <span className="text-xs sm:text-sm ml-2 text-barberGray dark:text-gray-400">
                {user?.username}
              </span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <button
              onClick={onBack}
              className="bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800 text-black dark:text-white px-4 sm:px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover-lift text-sm sm:text-base"
            >
              ← Volver al Sistema
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                onBack();
              }}
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover-lift text-sm"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6 border border-barberCream dark:border-gray-700">
          <div className="border-b border-barberCream dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-4 px-6 text-center border-b-2 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'appointments'
                    ? 'border-barberRed text-barberRed dark:text-red-400 dark:border-red-400'
                    : 'border-transparent text-barberGray dark:text-gray-400 hover:text-barberDark dark:hover:text-gray-300 hover:border-barberGray dark:hover:border-gray-600'
                }`}
              >
                📅 Gestión de Turnos
              </button>
              <button
                onClick={() => setActiveTab('barbers')}
                className={`py-4 px-6 text-center border-b-2 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'barbers'
                    ? 'border-barberRed text-barberRed dark:text-red-400 dark:border-red-400'
                    : 'border-transparent text-barberGray dark:text-gray-400 hover:text-barberDark dark:hover:text-gray-300 hover:border-barberGray dark:hover:border-gray-600'
                }`}
              >
                👨‍💼 Gestión de Barberos
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido de las tabs */}
        {activeTab === 'appointments' && (
          <>
            {/* Filtros */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-6 border border-barberCream dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-semibold text-barberDark dark:text-gray-200 mb-2">
                    Filtrar por fecha
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full sm:w-auto p-3 bg-white dark:bg-gray-700 border-2 border-barberCream dark:border-gray-600 rounded-xl focus:border-barberBlue focus:outline-none text-barberDark dark:text-white"
                  />
                </div>
                <button
                  onClick={loadAppointments}
                  className="bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800 text-black dark:text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift w-full sm:w-auto"
                >
                  🔄 Actualizar
                </button>
              </div>
            </div>

            {/* Lista de Turnos */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-barberCream dark:border-gray-700">
              <h2 className="text-xl sm:text-2xl font-display font-semibold text-barberDark dark:text-white mb-4">
                Turnos del {new Date(selectedDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="loading-spinner mx-auto mb-4"></div>
                  <p className="text-barberGray dark:text-gray-400">Cargando turnos...</p>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-8 text-barberGray dark:text-gray-400">
                  <p className="text-base sm:text-lg">No hay turnos para la fecha seleccionada</p>
                  <p className="text-xs sm:text-sm mt-2">
                    Los turnos aparecerán aquí cuando los clientes hagan reservas
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm sm:text-base">
                    <thead>
                      <tr className="bg-barberCream dark:bg-gray-700">
                        <th className="px-2 sm:px-4 py-3 text-left text-barberDark dark:text-gray-200 font-semibold">
                          Cliente
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-barberDark dark:text-gray-200 font-semibold">
                          Barbero
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-barberDark dark:text-gray-200 font-semibold">
                          Servicio
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-barberDark dark:text-gray-200 font-semibold">
                          Fecha/Hora
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-barberDark dark:text-gray-200 font-semibold">
                          Estado
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-barberDark dark:text-gray-200 font-semibold">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr
                          key={appointment.id}
                          className="border-b border-barberCream dark:border-gray-700 hover:bg-barberCream dark:hover:bg-gray-700"
                        >
                          <td className="px-2 sm:px-4 py-3">
                            <div>
                              <p className="font-semibold text-barberDark dark:text-gray-200 text-sm sm:text-base">
                                {appointment.customer_name}
                              </p>
                              <p className="text-xs sm:text-sm text-barberGray dark:text-gray-400">
                                {appointment.customer_phone}
                              </p>
                              {appointment.customer_email && (
                                <p className="text-xs sm:text-sm text-barberGray dark:text-gray-400">
                                  {appointment.customer_email}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-barberDark dark:text-gray-200 text-sm sm:text-base">
                            {appointment.barber_name}
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            <div>
                              <p className="font-semibold text-barberDark dark:text-gray-200 text-sm sm:text-base">
                                {appointment.service_name}
                              </p>
                              <p className="text-xs sm:text-sm text-barberGray dark:text-gray-400">
                                ${appointment.price.toLocaleString('es-ES')} - {appointment.duration}min
                              </p>
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-barberDark dark:text-gray-200 text-sm sm:text-base">
                            {new Date(appointment.appointment_date).toLocaleString('es-ES', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            <span
                              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                                appointment.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                  : appointment.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }`}
                            >
                              {appointment.status === 'confirmed'
                                ? 'Confirmado'
                                : appointment.status === 'pending'
                                ? 'Pendiente'
                                : 'Cancelado'}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                              {appointment.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleConfirmAppointment(appointment.id)}
                                    className="bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800 text-black dark:text-white px-2 sm:px-3 py-1 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 hover-lift"
                                  >
                                    Confirmar
                                  </button>
                                  <button
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                    className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800 text-black dark:text-white px-2 sm:px-3 py-1 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 hover-lift"
                                  >
                                    Cancelar
                                  </button>
                                </>
                              )}
                              {appointment.status === 'confirmed' && (
                                <button
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                  className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800 text-black dark:text-white px-2 sm:px-3 py-1 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 hover-lift"
                                >
                                  Cancelar
                                </button>
                              )}
                              {appointment.status === 'cancelled' && (
                                <span className="text-barberGray dark:text-gray-400 text-xs sm:text-sm">
                                  Acciones no disponibles
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border border-barberCream dark:border-gray-700">
                <div className="text-3xl font-bold text-barberBlue dark:text-blue-400">{stats.today}</div>
                <div className="text-barberGray dark:text-gray-400">Turnos Hoy</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border border-barberCream dark:border-gray-700">
                <div className="text-3xl font-bold text-green-500 dark:text-green-400">{stats.confirmed}</div>
                <div className="text-barberGray dark:text-gray-400">Confirmados</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border border-barberCream dark:border-gray-700">
                <div className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">
                  {appointments.filter(a => a.status === 'pending').length}
                </div>
                <div className="text-barberGray dark:text-gray-400">Pendientes</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border border-barberCream dark:border-gray-700">
                <div className="text-3xl font-bold text-red-500 dark:text-red-400">{stats.cancelled}</div>
                <div className="text-barberGray dark:text-gray-400">Cancelados</div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'barbers' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-barberCream dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-semibold text-barberDark dark:text-white">
                Gestión de Barberos
              </h2>
              <button
                onClick={() => setShowBarberForm(true)}
                className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800 text-black dark:text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover-lift"
              >
                ➕ Agregar Barbero
              </button>
            </div>

            {/* Formulario de Barbero */}
            {showBarberForm && (
              <div className="mb-6 p-6 bg-barberCream dark:bg-gray-700 rounded-2xl border border-barberCream dark:border-gray-600">
                <h3 className="text-lg font-display font-semibold text-barberDark dark:text-white mb-4">
                  {editingBarber ? 'Editar Barbero' : 'Nuevo Barbero'}
                </h3>
                <form onSubmit={handleBarberSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-barberDark dark:text-gray-200 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={barberForm.name}
                      onChange={(e) => setBarberForm({ ...barberForm, name: e.target.value })}
                      required
                      className="w-full p-3 bg-white dark:bg-gray-800 border-2 border-barberCream dark:border-gray-600 rounded-xl focus:border-barberBlue focus:outline-none text-barberDark dark:text-white"
                      placeholder="Ej: Carlos Rodríguez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-barberDark dark:text-gray-200 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={barberForm.email}
                      onChange={(e) => setBarberForm({ ...barberForm, email: e.target.value })}
                      className="w-full p-3 bg-white dark:bg-gray-800 border-2 border-barberCream dark:border-gray-600 rounded-xl focus:border-barberBlue focus:outline-none text-barberDark dark:text-white"
                      placeholder="Ej: carlos@barberia.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-barberDark dark:text-gray-200 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={barberForm.phone}
                      onChange={(e) => setBarberForm({ ...barberForm, phone: e.target.value })}
                      className="w-full p-3 bg-white dark:bg-gray-800 border-2 border-barberCream dark:border-gray-600 rounded-xl focus:border-barberBlue focus:outline-none text-barberDark dark:text-white"
                      placeholder="Ej: +541123456789"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-barberDark dark:text-gray-200 mb-2">
                      Foto de perfil
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setBarberForm({ ...barberForm, image: file });
                          const reader = new FileReader();
                          reader.onload = (e) => setImagePreview(e.target.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full p-3 bg-white dark:bg-gray-800 border-2 border-barberCream dark:border-gray-600 rounded-xl focus:border-barberBlue focus:outline-none text-barberDark dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-barberBlue file:text-white hover:file:bg-blue-700"
                    />
                    {imagePreview && (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-xl border-2 border-barberCream dark:border-gray-600"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-end space-x-2">
                    <button
                      type="submit"
                      className="bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800 text-black dark:text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift"
                    >
                      {editingBarber ? '💾 Actualizar' : '✅ Crear'}
                    </button>
                    <button
                      type="button"
                      onClick={resetBarberForm}
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-black dark:text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lista de Barberos */}
            {loadingBarbers ? (
              <div className="text-center py-8">
                <div className="loading-spinner mx-auto mb-4"></div>
                <p className="text-barberGray dark:text-gray-400">Cargando barberos...</p>
              </div>
            ) : barbers.length === 0 ? (
              <div className="text-center py-8 text-barberGray dark:text-gray-400">
                <p>No hay barberos registrados</p>
                <p className="text-sm mt-2">
                  Agrega el primer barbero usando el botón "Agregar Barbero"
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {barbers.map((barber) => (
                  <div
                    key={barber.id}
                    className="bg-white dark:bg-gray-800 border-2 border-barberCream dark:border-gray-700 hover:border-barberBlue dark:hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 hover-lift"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {barber.image_url ? (
                          <img
                            src={
                              barber.image_url.startsWith('http')
                                ? barber.image_url
                                : barber.image_url.startsWith('/img/')
                                ? barber.image_url
                                : `/img/logo.png`
                            }
                            alt={barber.name}
                            className="w-16 h-16 object-cover rounded-xl border-2 border-barberCream dark:border-gray-600 flex-shrink-0"
                            onError={(e) => {
                              e.target.src = '/img/logo.png';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-blue-100 dark:from-red-900/30 dark:to-blue-900/30 rounded-xl border-2 border-barberCream dark:border-gray-600 flex items-center justify-center text-2xl">
                            👨‍💼
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-display text-xl font-semibold text-barberDark dark:text-white">
                            {barber.name}
                          </h3>
                          {barber.email && (
                            <p className="text-barberGray dark:text-gray-400 text-sm mt-1">
                              {barber.email}
                            </p>
                          )}
                          {barber.phone && (
                            <p className="text-barberGray dark:text-gray-400 text-sm">{barber.phone}</p>
                          )}
                          <p className="text-barberGray dark:text-gray-400 text-xs mt-2">
                            Creado: {new Date(barber.created_at).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 ml-4">
                        <button
                          onClick={() => handleEditBarber(barber)}
                          className="bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800 text-black dark:text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover-lift w-full sm:w-auto"
                          title="Editar barbero"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeleteBarber(barber.id)}
                          className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800 text-black dark:text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover-lift w-full sm:w-auto"
                          title="Eliminar barbero"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

AdminPanel.propTypes = {
  onBack: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
};

export default AdminPanel;
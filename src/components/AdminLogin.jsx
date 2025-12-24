import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNotification } from '../contexts/NotificationContext';

const AdminLogin = ({ onLogin, onBack }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showSuccess, showError } = useNotification();

  // Datos de prueba para desarrollo
  const mockUsers = [
    { username: 'admin', password: 'admin123', name: 'Administrador', role: 'admin' },
    { username: 'staff', password: 'staff123', name: 'Staff Member', role: 'staff' },
    { username: 'barber', password: 'barber123', name: 'Barbero Master', role: 'barber' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulamos delay de red
      await new Promise(resolve => setTimeout(resolve, 800));

      // Buscar usuario en datos mock
      const user = mockUsers.find(u => 
        u.username === formData.username && u.password === formData.password
      );

      if (!user) {
        throw new Error('Usuario o contraseña incorrectos');
      }

      // Crear token mock
      const token = `mock_token_${user.username}_${Date.now()}`;
      
      // Guardar en localStorage
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify({
        id: Date.now(),
        username: user.username,
        name: user.name,
        role: user.role
      }));

      showSuccess(`¡Bienvenido ${user.name}!`);
      onLogin({
        id: Date.now(),
        username: user.username,
        name: user.name,
        role: user.role
      });

    } catch (error) {
      const errorMessage = error.message || 'Error de conexión';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-barberCream via-white to-barberCream dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-8 fade-in">
      <div className="max-w-md w-full mx-4">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-barberGray dark:text-gray-300 hover:text-barberRed dark:hover:text-red-400 transition-all duration-300 group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300">←</span>
          <span className="ml-2 font-semibold">Volver al Sistema</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-barberCream dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-barberRed to-barberBlue rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl text-white">🔐</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-barberDark dark:text-white mb-2">
              Panel Administrador
            </h1>
            <p className="text-barberGray dark:text-gray-400">Acceso exclusivo para el equipo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-barberDark dark:text-gray-200 mb-2">
                Usuario
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full p-4 bg-white dark:bg-gray-700 border-2 border-barberCream dark:border-gray-600 rounded-xl focus:outline-none focus:border-barberBlue focus:ring-2 focus:ring-barberBlue text-barberDark dark:text-white placeholder-barberGray dark:placeholder-gray-400"
                placeholder="Ingresa tu usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-barberDark dark:text-gray-200 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-4 bg-white dark:bg-gray-700 border-2 border-barberCream dark:border-gray-600 rounded-xl focus:outline-none focus:border-barberBlue focus:ring-2 focus:ring-barberBlue text-barberDark dark:text-white placeholder-barberGray dark:placeholder-gray-400"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${
                loading
                  ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-barberGray dark:text-gray-400'
                  : 'bg-gradient-to-r from-barberRed to-barberBlue hover:from-red-600 hover:to-blue-700 text-white hover-lift'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verificando...
                </span>
              ) : (
                '🔐 Acceder al Panel'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

AdminLogin.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default AdminLogin;
import { useState } from 'react';
import PropTypes from 'prop-types';
import { authAPI } from '../services/api';

const AdminLogin = ({ onLogin, onBack }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const response = await authAPI.login(formData);
      
      if (response.data) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        onLogin(response.data.user);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-barberCream flex items-center justify-center py-8 fade-in">
      <div className="max-w-md w-full mx-4">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-barberGray hover:text-barberRed transition-all duration-300 group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300">←</span>
          <span className="ml-2 font-semibold">Volver al Sistema</span>
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-barberCream">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-barberRed to-barberBlue rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl text-white">🔐</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-barberDark">Panel Administrador</h1>
            <p className="text-barberGray mt-2">Acceso exclusivo para el equipo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-barberDark mb-2">
                Usuario
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full p-4 bg-white border-2 border-barberCream rounded-xl focus:outline-none focus:border-barberBlue focus:ring-2 focus:ring-barberBlue text-barberDark placeholder-barberGray"
                placeholder="Ingresa tu usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-barberDark mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-4 bg-white border-2 border-barberCream rounded-xl focus:outline-none focus:border-barberBlue focus:ring-2 focus:ring-barberBlue text-barberDark placeholder-barberGray"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                loading
                  ? 'bg-gray-100 cursor-not-allowed text-black'
                  : 'bg-red-100 hover:bg-red-200 text-black hover-lift shadow-lg'
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
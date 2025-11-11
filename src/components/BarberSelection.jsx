import React, { useState, useEffect } from 'react';
import { barbersAPI } from '../services/api';

const BarberSelection = ({ onSelect }) => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadBarbers();
  }, [retryCount]);

  const loadBarbers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await barbersAPI.getAll();
      setBarbers(response.data);
    } catch (error) {
      console.error('Error loading barbers:', error);
      setError('El servidor está despertando... Esto puede tomar hasta 60 segundos.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-barberCream fade-in">
        <div className="text-center py-12">
          <div className="loading-spinner loading-spinner-large mx-auto mb-4"></div>
          <p className="text-barberGray mb-2">Cargando nuestro equipo...</p>
          <p className="text-barberGray text-sm">⏰ Esto puede tomar hasta 60 segundos la primera vez</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-barberCream fade-in">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">😴</div>
          <h3 className="text-xl font-display font-bold text-barberDark mb-2">Servidor en reposo</h3>
          <p className="text-barberGray mb-4">{error}</p>
          <p className="text-barberGray text-sm mb-6">
            Los servicios gratuitos se duermen después de 15 minutos de inactividad
          </p>
          <button
            onClick={handleRetry}
            className="bg-red-100 hover:bg-red-200 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift"
          >
            🔄 Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-barberCream fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-barberDark mb-3">
          Nuestros Barberos
        </h2>
        <p className="text-barberGray text-lg">
          Elige al especialista para tu estilo
        </p>
      </div>
      
      {barbers.length === 0 ? (
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-barberGray">Cargando nuestro equipo...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="group bg-white rounded-xl p-6 border-2 border-barberCream hover:border-barberRed cursor-pointer transition-all duration-300 hover-lift"
              onClick={() => onSelect(barber)}
            >
              <div className="text-center">
                {/* Avatar del barbero */}
                {barber.image_url ? (
                  <img
                    src={`https://tu-backend.vercel.app${barber.image_url}`}
                    alt={barber.name}
                    className="w-20 h-20 object-cover rounded-full mx-auto mb-4 shadow-lg border-2 border-barberCream"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-black text-2xl shadow-lg">
                    👨‍💼
                  </div>
                )}
                
                <h3 className="font-display text-xl font-semibold text-barberDark mb-2">
                  {barber.name}
                </h3>
                
                {barber.email && (
                  <p className="text-barberGray text-sm mb-1 truncate">{barber.email}</p>
                )}
                {barber.phone && (
                  <p className="text-barberBlue text-sm font-medium">{barber.phone}</p>
                )}
                
                <button className="mt-4 w-full bg-red-100 hover:bg-red-200 text-black py-3 rounded-xl font-semibold transition-all duration-300 group-hover:scale-105 shadow-md">
                  Seleccionar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-barberGray text-sm">
          Paso 1 de 5 • Elige tu barbero
        </p>
      </div>
    </div>
  );
};

export default BarberSelection;
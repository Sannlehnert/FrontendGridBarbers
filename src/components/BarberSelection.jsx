import React from 'react';

const BarberSelection = ({ barbers, onSelect }) => {
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
                    src={`https://backendgridbarbers.onrender.com${barber.image_url}`}
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
                
                {/* Botón de selección mejorado */}
                <button className="mt-4 w-full bg-red-100 hover:bg-red-200 text-black py-3 rounded-xl font-semibold transition-all duration-300 group-hover:scale-105 shadow-md">
                  Seleccionar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Indicador visual de progreso */}
      <div className="mt-8 text-center">
        <p className="text-barberGray text-sm">
          Paso 1 de 5 • Elige tu barbero
        </p>
      </div>
    </div>
  );
};

export default BarberSelection;
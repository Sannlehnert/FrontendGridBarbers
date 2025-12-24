import React from 'react';

const BarberSelection = ({ barbers, onSelect }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-barberCream dark:border-gray-700 fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-barberDark dark:text-white mb-3">
          Nuestros Barberos
        </h2>
        <p className="text-barberGray dark:text-gray-300 text-lg">
          Elige al especialista para tu estilo
        </p>
      </div>
      
      {barbers.length === 0 ? (
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-barberGray dark:text-gray-400">Cargando nuestro equipo...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="group bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-barberCream dark:border-gray-700 hover:border-barberRed dark:hover:border-red-500 cursor-pointer transition-all duration-300 hover-lift"
              onClick={() => onSelect(barber)}
            >
              <div className="text-center">
                {/* Avatar por defecto */}
                <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-blue-100 dark:from-red-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-black dark:text-white text-2xl shadow-lg border-2 border-barberCream dark:border-gray-600">
                  👨‍💼
                </div>
                
                <h3 className="font-display text-xl font-semibold text-barberDark dark:text-white mb-2">
                  {barber.name}
                </h3>
                
                {barber.email && (
                  <p className="text-barberGray dark:text-gray-400 text-sm mb-1 truncate">{barber.email}</p>
                )}
                {barber.phone && (
                  <p className="text-barberBlue dark:text-blue-400 text-sm font-medium">{barber.phone}</p>
                )}
                
                <button className="mt-4 w-full bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800 text-black dark:text-white py-3 rounded-xl font-semibold transition-all duration-300 group-hover:scale-105 shadow-md">
                  Seleccionar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-barberGray dark:text-gray-400 text-sm">
          Paso 1 de 5 • Elige tu barbero
        </p>
      </div>
    </div>
  );
};

export default BarberSelection;
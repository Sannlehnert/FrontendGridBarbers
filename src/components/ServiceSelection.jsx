import React from 'react';

const ServiceSelection = ({ services, onSelect, onBack }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-barberCream fade-in">
      {/* Header con navegación intuitiva */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-barberGray hover:text-barberRed transition-all duration-300 group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300">←</span>
          <span className="ml-2 font-semibold">Volver</span>
        </button>
        
        <div className="text-barberBlue text-sm font-medium">
          Paso 2 de 5
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-barberDark mb-3">
          Nuestros Servicios
        </h2>
        <p className="text-barberGray text-lg">
          Elige el servicio que necesitas
        </p>
      </div>
      
      {services.length === 0 ? (
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-barberGray">Cargando servicios...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-xl p-6 border-2 border-barberCream hover:border-barberBlue cursor-pointer transition-all duration-300 hover-lift"
              onClick={() => onSelect(service)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-barberDark mb-2">
                        {service.name}
                      </h3>
                      <p className="text-barberGray leading-relaxed mb-3">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="bg-barberCream text-barberBlue px-3 py-1 rounded-full text-sm font-medium">
                          ⏱ {service.duration} min
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <p className="text-2xl font-display font-bold text-barberRed mb-3">
                        ${service.price?.toLocaleString('es-ES')}
                      </p>
                <button className="bg-blue-100 hover:bg-blue-200 text-black px-6 py-2 rounded-xl font-semibold transition-all duration-300 group-hover:scale-105 shadow-md">
                        Elegir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
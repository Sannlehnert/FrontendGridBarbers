import React, { useState } from 'react';

const DatePicker = ({ onSelect, onBack }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
  };

  const handleSubmit = () => {
    if (selectedDate) {
      onSelect(selectedDate);
    }
  };

  // Fechas disponibles (hoy + próximos 60 días)
  const today = new Date();
  const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const maxDate = new Date(todayLocal);
  maxDate.setDate(todayLocal.getDate() + 60);

  const todayString = todayLocal.toISOString().split('T')[0];
  const maxDateString = maxDate.toISOString().split('T')[0];

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-barberCream fade-in">
      {/* Navegación intuitiva */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-barberGray hover:text-barberRed transition-all duration-300 group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300">←</span>
          <span className="ml-2 font-semibold">Volver</span>
        </button>
        
        <div className="text-barberBlue text-sm font-medium">
          Paso 3 de 5
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-barberDark mb-3">
          ¿Cuándo vienes?
        </h2>
        <p className="text-barberGray text-lg">
          Elige el día de tu cita
        </p>
      </div>

      <div className="max-w-md mx-auto">
        {/* Información de horarios */}
        <div className="bg-barberCream rounded-xl p-6 mb-8 border border-barberCream">
          <div className="flex items-center justify-around text-barberDark">
            <div className="text-center">
              <div className="text-2xl mb-2">🕘</div>
              <p className="font-semibold text-sm">9:00 - 18:00</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📅</div>
              <p className="font-semibold text-sm">Lun - Sáb</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🚫</div>
              <p className="font-semibold text-sm">Dom Cerrado</p>
            </div>
          </div>
        </div>

        {/* Selector de fecha intuitivo */}
        <div className="text-center">
          <label className="block text-barberDark font-semibold mb-4 text-lg">
            Selecciona una fecha:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={todayString}
            max={maxDateString}
            className="w-full p-4 bg-white border-2 border-barberCream rounded-xl text-barberDark text-lg font-medium mb-6 focus:border-barberBlue focus:outline-none transition-all duration-300"
          />
          
          {selectedDate && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-100 to-blue-100 rounded-xl text-black">
              <p className="font-semibold text-lg">
                {formatDate(selectedDate)}
              </p>
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={!selectedDate}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${
              selectedDate
                ? 'bg-red-100 hover:bg-red-200 text-black hover-lift transform hover:scale-105'
                : 'bg-barberCream text-barberGray cursor-not-allowed'
            }`}
          >
            {selectedDate ? `Continuar - ${formatDate(selectedDate)}` : 'Selecciona una fecha'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
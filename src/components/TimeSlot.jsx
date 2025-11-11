import React, { useState, useEffect } from 'react';
import { appointmentsAPI } from '../services/api';

const TimeSlot = ({ barber, service, date, onSelect, onBack }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [busySlots, setBusySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showNoAvailability, setShowNoAvailability] = useState(false);

  useEffect(() => {
    if (barber && date) {
      loadBusySlots();
    }
  }, [barber, date]);

  const loadBusySlots = async () => {
    try {
      setLoading(true);
      setShowNoAvailability(false);
      
      const response = await appointmentsAPI.getByDate(date, barber.id);
      setBusySlots(response.data);
      
      generateTimeSlots(response.data);
      
    } catch (error) {
      console.error('Error loading busy slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = (busyAppointments = []) => {
    const slots = [];
    const startHour = 9;
    const endHour = 18;
    const interval = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotDateTime = createLocalDate(date, timeString);
        
        const isBusy = busyAppointments.some(appointment => {
          const appointmentTime = new Date(appointment.appointment_date);
          return appointmentTime.getTime() === slotDateTime.getTime();
        });

        const now = new Date();
        const isValid = slotDateTime > now;
        const isSunday = slotDateTime.getDay() === 0;
        const isBusinessHours = hour >= 9 && hour < 18;

        slots.push({
          time: timeString,
          datetime: slotDateTime,
          available: !isBusy && isValid && !isSunday && isBusinessHours,
          isSunday: isSunday
        });
      }
    }

    setTimeSlots(slots);
    
    // Verificar si hay ALGÚN horario disponible
    const hasAvailableSlots = slots.some(slot => slot.available);
    setShowNoAvailability(!hasAvailableSlots);
  };

  const createLocalDate = (dateString, timeString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  const handleTimeSelect = (slot) => {
    if (slot.available) {
      setSelectedSlot(slot.time);
      onSelect(slot.time);
    }
  };

  const formatSelectedDate = () => {
    const [year, month, day] = date.split('-').map(Number);
    const selectedDateObj = new Date(year, month - 1, day);
    return selectedDateObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-barberCream fade-in">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-barberGray hover:text-barberRed transition-all duration-300 group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span className="ml-2 font-semibold">Volver</span>
          </button>
          <div className="text-barberBlue text-sm font-medium">Paso 4 de 5</div>
        </div>
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-barberGray">Cargando horarios disponibles...</p>
        </div>
      </div>
    );
  }

  if (showNoAvailability) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-barberCream fade-in">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-barberGray hover:text-barberRed transition-all duration-300 group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span className="ml-2 font-semibold">Volver</span>
          </button>
          <div className="text-barberBlue text-sm font-medium">Paso 4 de 5</div>
        </div>

        <div className="text-center py-8">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-display font-bold text-barberDark mb-4">Sin horarios disponibles</h3>
          <p className="text-barberGray mb-2">
            El barbero <strong className="text-barberRed">{barber?.name}</strong> no tiene disponibilidad para:
          </p>
          <p className="text-barberDark text-lg font-medium mb-6">{formatSelectedDate()}</p>
          
          <div className="bg-barberCream rounded-xl p-6 mb-6 max-w-md mx-auto">
            <p className="text-barberGray text-sm mb-4">
              💡 <strong>Puedes intentar:</strong>
            </p>
            <ul className="text-barberGray text-sm space-y-2 text-left">
              <li>• Seleccionar otra fecha</li>
              <li>• Elegir otro barbero</li>
              <li>• Contactarnos directamente</li>
            </ul>
          </div>
          
          <button
            onClick={onBack}
            className="bg-red-100 hover:bg-red-200 text-black px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift shadow-lg"
          >
            Elegir otra fecha
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-barberCream fade-in">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-barberGray hover:text-barberRed transition-all duration-300 group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300">←</span>
          <span className="ml-2 font-semibold">Volver</span>
        </button>
        <div className="text-barberBlue text-sm font-medium">Paso 4 de 5</div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-barberDark mb-3">
          Elige tu horario
        </h2>
        <p className="text-barberGray text-lg">
          Selecciona la hora de tu cita
        </p>
      </div>

      <div className="mb-6 p-6 bg-barberCream rounded-xl border border-barberCream">
        <p className="text-barberDark text-lg text-center">
          <strong className="text-barberRed">{barber?.name}</strong> - {service?.name} - {formatSelectedDate()}
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        {timeSlots.map((slot) => (
          <button
            key={slot.time}
            onClick={() => handleTimeSelect(slot)}
            disabled={!slot.available}
            className={`p-4 rounded-xl text-center font-semibold transition-all duration-300 ${
              selectedSlot === slot.time
                ? 'bg-barberRed text-white scale-105 shadow-lg'
                : slot.available
                ? 'bg-white text-barberDark border-2 border-barberCream hover:border-barberBlue hover:scale-105 hover:shadow-md'
                : 'bg-barberCream text-barberGray cursor-not-allowed'
            }`}
          >
            {slot.time}
          </button>
        ))}
      </div>

      {selectedSlot && (
        <div className="bg-gradient-to-r from-red-100 to-blue-100 rounded-xl p-6 text-center text-black shadow-lg">
          <p className="text-xl font-semibold mb-2">
            ✅ Horario seleccionado: <strong>{selectedSlot}</strong>
          </p>
          <p className="text-white text-opacity-90">
            Continúa para confirmar tu reserva
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlot;
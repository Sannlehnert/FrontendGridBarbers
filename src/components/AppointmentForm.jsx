import React, { useState } from 'react';
import { appointmentsAPI } from '../services/api';

const AppointmentForm = ({ barber, service, date, time, onSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'El nombre es obligatorio';
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'El teléfono es obligatorio';
    } else if (!/^\d{10,15}$/.test(formData.customer_phone.replace(/\D/g, ''))) {
      newErrors.customer_phone = 'Ingresa un teléfono válido';
    }

    if (formData.customer_email && !/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = 'Ingresa un email válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);
      
      const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);
      
      await appointmentsAPI.create({
        barber_id: barber.id,
        service_id: service.id,
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_email: formData.customer_email.trim(),
        appointment_date: appointmentDateTime.toISOString()
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Error al crear el turno: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const appointmentDate = new Date(
    parseInt(date.split('-')[0]),
    parseInt(date.split('-')[1]) - 1,
    parseInt(date.split('-')[2]),
    parseInt(time.split(':')[0]),
    parseInt(time.split(':')[1])
  );

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
        <div className="text-barberBlue text-sm font-medium">Paso 5 de 5</div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-barberDark mb-3">
          Confirmar Reserva
        </h2>
        <p className="text-barberGray text-lg">
          Completa tus datos para finalizar
        </p>
      </div>

      {/* Resumen de la reserva */}
      <div className="bg-barberCream rounded-xl p-6 mb-8 border border-barberCream">
        <h3 className="font-display text-xl font-semibold text-barberDark mb-4 text-center">Resumen de tu reserva</h3>
        <div className="grid md:grid-cols-2 gap-4 text-barberDark">
          <div className="space-y-2">
            <p><strong className="text-barberRed">Barbero:</strong> {barber?.name}</p>
            <p><strong className="text-barberRed">Servicio:</strong> {service?.name}</p>
            <p><strong className="text-barberRed">Duración:</strong> {service?.duration} minutos</p>
          </div>
          <div className="space-y-2">
            <p><strong className="text-barberRed">Fecha:</strong> {appointmentDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong className="text-barberRed">Hora:</strong> {time}</p>
            <p><strong className="text-barberRed">Precio:</strong> ${service?.price?.toLocaleString('es-ES')}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-barberDark font-semibold mb-2">
            Nombre completo *
          </label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            required
            className={`w-full p-4 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.customer_name 
                ? 'border-barberRed focus:ring-barberRed' 
                : 'border-barberCream focus:border-barberBlue focus:ring-barberBlue'
            }`}
            placeholder="Ingresa tu nombre completo"
          />
          {errors.customer_name && (
            <p className="text-barberRed text-sm mt-1">{errors.customer_name}</p>
          )}
        </div>

        <div>
          <label className="block text-barberDark font-semibold mb-2">
            Teléfono *
          </label>
          <input
            type="tel"
            name="customer_phone"
            value={formData.customer_phone}
            onChange={handleChange}
            required
            className={`w-full p-4 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.customer_phone 
                ? 'border-barberRed focus:ring-barberRed' 
                : 'border-barberCream focus:border-barberBlue focus:ring-barberBlue'
            }`}
            placeholder="Ej: 1122334455"
          />
          {errors.customer_phone && (
            <p className="text-barberRed text-sm mt-1">{errors.customer_phone}</p>
          )}
        </div>

        <div>
          <label className="block text-barberDark font-semibold mb-2">
            Email (opcional)
          </label>
          <input
            type="email"
            name="customer_email"
            value={formData.customer_email}
            onChange={handleChange}
            className={`w-full p-4 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.customer_email 
                ? 'border-barberRed focus:ring-barberRed' 
                : 'border-barberCream focus:border-barberBlue focus:ring-barberBlue'
            }`}
            placeholder="tu@email.com"
          />
          {errors.customer_email && (
            <p className="text-barberRed text-sm mt-1">{errors.customer_email}</p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-barberCream hover:bg-barberGray hover:text-black text-barberGray py-4 rounded-xl font-semibold transition-all duration-300 hover-lift"
          >
            Atrás
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-4 rounded-xl font-semibold text-black transition-all duration-300 hover-lift shadow-lg ${
              loading
                ? 'bg-gray-100 cursor-not-allowed'
                : 'bg-red-100 hover:bg-red-200'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Confirmando...
              </span>
            ) : (
              '✅ Confirmar Reserva'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-barberCream rounded-xl border border-barberCream">
        <p className="text-barberGray text-sm text-center">
          💡 <strong>Importante:</strong> El pago se realiza en el local. Por favor llega 5 minutos antes.
        </p>
      </div>
    </div>
  );
};

export default AppointmentForm;
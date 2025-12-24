import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-700 shadow-xl shadow-green-200/30 dark:shadow-green-900/20';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-700 shadow-xl shadow-red-200/30 dark:shadow-red-900/20';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-700 shadow-xl shadow-yellow-200/30 dark:shadow-yellow-900/20';
      case 'info':
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-700 shadow-xl shadow-blue-200/30 dark:shadow-blue-900/20';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`min-w-[320px] max-w-[400px] rounded-2xl border-l-4 p-4 transform transition-all duration-300 hover:scale-105 shadow-2xl ${getTypeStyles()}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-2xl">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold leading-relaxed break-words">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white/80 hover:text-white focus:outline-none rounded-full p-1 transition-colors duration-200 text-lg"
          aria-label="Cerrar notificación"
        >
          ×
        </button>
      </div>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number
};

export default Notification;
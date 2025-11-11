// Health check para mantener el servidor despierto
let healthCheckInterval = null;

export const startHealthCheck = () => {
  // Solo en producción
  if (import.meta.env.PROD) {
    healthCheckInterval = setInterval(async () => {
      try {
        await fetch('https://backendgridbarbers.onrender.com/api/health');
        console.log('Health check realizado - Servidor activo');
      } catch (error) {
        console.log('Health check falló - Servidor puede estar dormido');
      }
    }, 10 * 60 * 1000); // Cada 10 minutos
  }
};

export const stopHealthCheck = () => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
};
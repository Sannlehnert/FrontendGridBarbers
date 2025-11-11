import { useState, useEffect } from 'react';

const useServerHealth = () => {
  const [serverReady, setServerReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  const checkServerHealth = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 segundos

      const response = await fetch('https://backendgridbarbers.onrender.com/api/health', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setServerReady(true);
        setLastChecked(new Date());
      } else {
        setServerReady(false);
      }
    } catch (error) {
      console.log('Servidor no disponible:', error.message);
      setServerReady(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkServerHealth();
    
    // Intentar cada 2 minutos si no está listo
    const interval = setInterval(() => {
      if (!serverReady && !loading) {
        checkServerHealth();
      }
    }, 120000);

    return () => clearInterval(interval);
  }, [serverReady, loading]);

  return { serverReady, loading, lastChecked, retry: checkServerHealth };
};

export default useServerHealth;
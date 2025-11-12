import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Manejo global de errores
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleError = (error) => {
      console.error('🔴 Error global:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-barberCream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-barberRed mb-4">Algo salió mal</h1>
          <p className="text-barberGray mb-4">Por favor recarga la página</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-barberRed text-white px-6 py-2 rounded-lg"
          >
            Recargar
          </button>
        </div>
      </div>
    );
  }

  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
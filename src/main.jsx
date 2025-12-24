import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Error Boundary mejorado
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🔴 Error en la aplicación:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-barberCream dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😢</div>
            <h1 className="text-2xl font-bold text-barberRed dark:text-red-400 mb-4">
              Algo salió mal
            </h1>
            <p className="text-barberGray dark:text-gray-400 mb-6">
              La aplicación encontró un error. No te preocupes, puedes recargar la página.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-barberRed to-barberBlue text-white px-6 py-3 rounded-xl font-semibold hover-lift shadow-lg"
            >
              Recargar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
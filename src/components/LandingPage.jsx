import React from 'react';

const LandingPage = ({ onRetry, loading }) => {
    return (
        <div className="min-h-screen bg-barberCream flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                {/* Logo */}
                <div className="w-24 h-24 bg-barberRed rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <img
                        src="/img/logo.png"
                        alt="Grid Barbers Logo"
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>

                <h1 className="text-4xl font-display font-bold text-barberDark mb-4">
                    Grid Barbers
                </h1>

                <p className="text-barberGray text-lg mb-2">
                    Barbería de élite
                </p>

                {loading ? (
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-barberCream">
                        <div className="loading-spinner loading-spinner-large mx-auto mb-4"></div>
                        <h3 className="text-xl font-semibold text-barberDark mb-2">
                            Iniciando servidor...
                        </h3>
                        <p className="text-barberGray mb-4">
                            Esto puede tomar hasta 60 segundos la primera vez
                        </p>
                        <div className="w-full bg-barberCream rounded-full h-2 mb-4">
                            <div className="bg-barberRed h-2 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-sm text-barberGray">
                            Los servicios gratuitos se activan tras 30-60 segundos de inactividad
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-barberCream">
                        <div className="text-6xl mb-4">😴</div>
                        <h3 className="text-xl font-semibold text-barberDark mb-2">
                            Servidor en reposo
                        </h3>
                        <p className="text-barberGray mb-4">
                            El servidor se ha dormido por inactividad
                        </p>
                        <button
                            onClick={onRetry}
                            className="w-full bg-red-100 hover:bg-red-200 text-black py-4 rounded-xl font-semibold transition-all duration-300 hover-lift shadow-lg text-lg"
                        >
                            🔄 Despertar Servidor
                        </button>
                        <p className="text-xs text-barberGray mt-4">
                            Esto iniciará el servidor (30-60 segundos)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPage;
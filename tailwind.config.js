/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Barbería Clásica
        barberRed: '#DC2626',    // Rojo vibrante
        barberBlue: '#1E40AF',   // Azul clásico
        barberWhite: '#FFFFFF',   // Blanco puro
        barberCream: '#FEF3C7',   // Crema para fondos
        barberGray: '#374151',    // Gris para textos secundarios
        barberDark: '#111827',    // Negro suave para fondos
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],    // Elegante para títulos
        'body': ['Inter', 'system-ui', 'sans-serif'], // Legible para textos
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
}
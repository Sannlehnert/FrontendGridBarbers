/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Barbería Clásica
        barberRed: '#DC2626',
        barberBlue: '#1E40AF',
        barberWhite: '#FFFFFF',
        barberCream: '#FEF3C7',
        barberGray: '#374151',
        barberDark: '#111827',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slideInRight': 'slideInRight 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'premium': '0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 8px 16px -8px rgba(0, 0, 0, 0.1)',
        'premium-lg': '0 32px 64px -12px rgba(0, 0, 0, 0.2), 0 16px 32px -8px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
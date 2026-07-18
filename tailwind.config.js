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
        brand: {
          dark: '#0b0e14',
          card: '#151b26',
          border: '#262f3d',
          'border-focus': '#3b82f6',
          primary: '#2563eb',
          'primary-hover': '#1d4ed8',
          text: '#f3f4f6',
          muted: '#9ca3af',
          green: '#10b981',
          yellow: '#f59e0b',
          red: '#ef4444',
          teal: '#14b8a6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

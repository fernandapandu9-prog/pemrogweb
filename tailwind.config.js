/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#1e40af', light: '#3b82f6', dark: '#1d4ed8' },
        accent: { DEFAULT: '#f59e0b', dark: '#d97706' },
      },

    },
  },
  plugins: [],
}
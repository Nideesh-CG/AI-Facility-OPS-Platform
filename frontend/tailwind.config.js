/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'var(--bg-primary)',
          sec: 'var(--bg-secondary)',
          card: 'var(--bg-card)',
          border: 'var(--border-color)',
          text: 'var(--text-primary)',
          textSec: 'var(--text-secondary)',
          accent: 'var(--accent-color)',
          success: 'var(--success-color)',
          warning: 'var(--warning-color)',
          danger: 'var(--danger-color)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      }
    },
  },
  plugins: [],
}

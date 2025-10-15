/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#22d3ee', // Cyan
          500: '#06b6d4',
          600: '#0891b2',
        },
        accent: {
          400: '#a3e635', // Lime
          500: '#84cc16',
          600: '#65a30d',
        },
        dark: {
          100: '#1e293b',
          200: '#1a2332',
          300: '#141b28',
          400: '#0f1419',
          500: '#0a0a0d',
        },
        error: '#ef4444',
        warning: '#f59e0b',
        success: '#84cc16',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.4)',
        'glow-lime': '0 0 20px rgba(132, 204, 22, 0.4)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}

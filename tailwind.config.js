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
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
        },
        light: {
          50: '#fefefe',
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#efefef',
          400: '#e5e5e5',
        }
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-soft': 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)',
        'gradient-sky': 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
        'gradient-peach': 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)',
        'gradient-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-blue': 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
        'gradient-pink': 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(102, 126, 234, 0.4)',
        'glow-pink': '0 0 20px rgba(233, 121, 249, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
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
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

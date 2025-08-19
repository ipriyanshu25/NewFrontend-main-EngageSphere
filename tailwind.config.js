/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        blue: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#bae0ff',
          300: '#7cc8ff',
          400: '#38afff',
          500: '#0096ff',
          600: '#0077e6',
          700: '#0062c4',
          800: '#0050a0',
          900: '#004282',
        },
        gold: {
          50: '#fffceb',
          100: '#fff8c6',
          200: '#fff089',
          300: '#ffe44c',
          400: '#fed52a',
          500: '#ffc107',
          600: '#e29400',
          700: '#bb6902',
          800: '#985108',
          900: '#7c430c',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
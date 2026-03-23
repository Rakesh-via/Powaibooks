/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff8d9',
          100: '#fff0a8',
          200: '#ffe57a',
          300: '#ffd84d',
          400: '#ffc726',
          500: '#ffb703',
          600: '#fb8500',
          700: '#e76f00',
          800: '#b85a00',
          900: '#7a3a00',
        },
        skyPop: {
          50: '#f0fbff',
          100: '#d9f4ff',
          200: '#b8ebff',
          300: '#7dd3fc',
          400: '#4cc3f7',
          500: '#38bdf8',
          600: '#0ea5e9',
          700: '#0284c7',
          800: '#0369a1',
          900: '#0c4a6e',
        },
        berry: {
          50: '#fff4fb',
          100: '#ffe0f2',
          200: '#ffc2e3',
          300: '#ff8cc6',
          400: '#ff69b4',
          500: '#ff4fa3',
          600: '#ec4899',
          700: '#db2777',
          800: '#9d174d',
          900: '#831843',
        },
      },
    },
  },
  plugins: [],
};

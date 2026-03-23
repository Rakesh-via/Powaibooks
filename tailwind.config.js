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
          300: '#ffd84d',
          500: '#ffb703',
          600: '#fb8500',
          700: '#e76f00',
        },
        skyPop: {
          100: '#d9f4ff',
          300: '#7dd3fc',
          500: '#38bdf8',
          700: '#0284c7',
        },
        berry: {
          100: '#ffe0f2',
          300: '#ff8cc6',
          500: '#ff4fa3',
          700: '#db2777',
        },
      },
    },
  },
  plugins: [],
};

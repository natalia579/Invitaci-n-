/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F8F5ED',
        cream: '#F0E8DA',
        beige: '#D9C8B2',
        cafe: '#6B5143',
        cocoa: '#49372F',
        mist: '#A8B7C0',
        gold: '#B5A082',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Garamond', 'Georgia', 'serif'],
        serif: ['Montserrat', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        sans: ['Montserrat', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      letterSpacing: { label: '0.32em' },
    },
  },
  plugins: [],
};

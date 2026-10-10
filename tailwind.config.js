/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F6EFE0',
        gold: {
          DEFAULT: '#B08D3C',
          dark: '#8D6F2B',
        },
        'gold-dark': '#8D6F2B',
        brown: {
          DEFAULT: '#3B2F1E',
          soft: '#6B5A3A',
        },
        'brown-soft': '#6B5A3A',
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
      },
    },
  },
  plugins: [],
};

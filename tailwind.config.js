/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        comesBlue: '#003366',
        comesGold: '#FFD700',
      },
      fontFamily: {
        comes: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

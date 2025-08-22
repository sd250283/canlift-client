/** @type {import('tailwindcss').Config} */
const { blackA, grass, gray, green } = require('@radix-ui/colors');

module.exports = {
  darkMode: 'class',
  content: [
    './public/index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ...blackA,
        ...grass,
        ...gray,
        ...green,
      },
    },
  },
  plugins: [],
};

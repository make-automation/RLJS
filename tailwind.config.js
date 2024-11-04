/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: {
          700: '#808000',
        },
        navy: {
          800: '#000080',
        },
      },
    },
  },
  plugins: [],
};
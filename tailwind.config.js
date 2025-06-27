// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        spinCustom: {
          '0%': { transform: 'rotate(0)' },
          '50%': { transform: 'rotate(3.1415rad)' },
          '100%': { transform: 'rotate(720deg)' },
        },
      },
      animation: {
        spinCustom: 'spinCustom 1s linear infinite',
      },
    },
  },
  plugins: [],
};

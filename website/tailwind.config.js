/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'background': '#333',
        'card': '#121212'
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      }
    }
  },
  plugins: [require('daisyui')],
};
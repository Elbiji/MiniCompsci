 /** @type {import('tailwindcss').Config} */
export default {
   content: ['./public/**/*.{html,js}','./src/**/*.js'],
   theme: {
     extend: {
      keyframes: {
        'border-spin': {
          '100%': {
            transform: 'rotate(-360deg)',
          },
        },
      },
      animation: {
        'border-spin': 'border-spin 7s linear infinite',
      }
     },
   },
   plugins: [],
 }
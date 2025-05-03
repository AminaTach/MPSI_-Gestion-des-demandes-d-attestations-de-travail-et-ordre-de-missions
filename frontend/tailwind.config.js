/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vos couleurs personnalisées (ajoutées SANS écraser les couleurs Tailwind)
        bleu_bg: '#E7EDF4',
        blue_nav: '#1A3852',
        blue_top: '#C9DEF6',
        bleu_selected: "#0086CA",
        title: '#303133',
        text: '#272525',
        blue: '#0086CA',
        grey: '#121212',
        green: '#10A142',
        red: {
          100: '#fee2e2',
          500: '#ef4444',
          700: '#b91c1c',
        },
        orange: '#F29425',
        violet: '#2D5F8B'
      },
      fontFamily: {
        nunito: ['Nunito'],
        poppins: ['Poppins'],
      },
      screens: {
        xs: '430px'
      }
    },
  },
  plugins: [],
}
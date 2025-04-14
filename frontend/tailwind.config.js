/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bleu_bg: '#E7EDF4',
        blue_nav: '#1A3852',
        blue_top: '#C9DEF6',
        bleu_selected: "#0086CA",
        title:'#303133',
        text:'#272525',
        blue:'#0086CA',
       
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      
      },

    },
  },
  plugins: [],
}

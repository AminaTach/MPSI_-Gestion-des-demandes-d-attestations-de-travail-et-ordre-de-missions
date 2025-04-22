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
        grey:'#121212',
        green:'#10A142',
        red:'#E54F53', 
        orange: '#F29425',
        violet: '#2D5F8B'
       
      },
      fontFamily: {
        nunito: ['Nunito'],
        poppins: ['Poppins'],
      
      },
      screens :{
        xs: '430px'
      }


    },
  },
  plugins: [],
}

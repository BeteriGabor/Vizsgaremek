/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        "defbg":"url(./components/assets/bgimage.jpg)",
        "slotbg":"url(./components/assets/slotbackground.png)",
        "blackjackbg":"url(./components/assets/blackjack.jpg)",
        "chickenmap":"url(./components/assets/chickenbackground.png)",
        "roulette":"url(./components/assets/roulette.png)",
        "og":"url(./components/assets/othergamesbg.png)",
        "chickencover":"url(./components/assets/chickencover.png)",
        "aviatorcover":"url(./components/assets/aviatorcover.png)",
        "bank":"url(./components/assets/bankbg.png)",

      },
      
      
    },
  },
  plugins: [],
  
}

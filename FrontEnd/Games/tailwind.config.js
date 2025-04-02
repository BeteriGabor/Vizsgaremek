/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'landscape': { 'raw': '(orientation: landscape)' },
        'portrait': { 'raw': '(orientation: portrait)' },
      },
      backgroundImage:{
        "defbg":"url(./components/assets/bgimage.jpg)",
        "slotbg":"url(./components/assets/slotbackground.png)",
        "blackjackbg":"url(./components/assets/blackjack.jpg)",
        "chickenbg":"url(./components/assets/chickenbackground.png)",
        "chicken":"url(./components/assets/chicken.png)",
        "roulette":"url(./components/assets/roulette.png)",
        "car":"url(./components/assets/car.png)",
        "og":"url(./components/assets/othergamesbg.png)",
        "chickencover":"url(./components/assets/chickencover.png)",
        "aviatorcover":"url(./components/assets/aviatorcover.png)",
        "logo":"url(./components/assets/aviatorcover.png)",
      },
    },
  },
  plugins: [],
  
}

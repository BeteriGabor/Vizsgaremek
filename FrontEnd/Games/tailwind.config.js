/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        "slotbg":"url(./components/assets/slotbackground.png)",
        "blackjackbg":"url(./components/assets/blackjack.png)",
        "chickenbg":"url(./components/assets/chickenbackground.png)",
        "chicken":"url(./components/assets/chicken.png)",
        "car":"url(./components/assets/car.png)"
      }
      
    },
  },
  plugins: [],
  
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "defbg":"url(./components/assets/bgimage.png)",
        "slotbg":"url(./components/assets/slotbg.png)",
        "blackjackbg":"url(./components/assets/blackjackbg.png)",
        "chickenmap":"url(./components/assets/chickenbg.png)",
        "roulette":"url(./components/assets/roulette.png)",
        "og":"url(./components/assets/othergamesbg.png)",
        "chickencover":"url(./components/assets/chickencover.png)",
        "aviatorcover":"url(./components/assets/aviatorcover.png)",
        "bank":"url(./components/assets/bankbg.png)",
        "aviatorgamebg":"url(./components/assets/aviatorgamebg.png)",
        "aviatorbg":"url(./components/assets/aviatorbg.png)",
      },
      fontFamily: {
        press: ['"Press Start 2P"', "cursive"], 
      },
    },
  },
  plugins: [],
};

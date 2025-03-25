/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        "slotbg":"url(./components/assets/slotbackground.png)"
      }
      
    },
  },
  plugins: [],
  
}

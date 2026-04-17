/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
         fontFamily: {
         primary: ["Poppins", "sans-serif"],
         secondary: ["Roboto", "sans-serif"],
         mono: ["monospace"],
      },
      fontWeight:{
      primary:{
        lig:100,
      }
    }
    
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/UI_Components/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFDE42",      // Bright Yellow / Gold
        secondary: "#4C5C2D",    // Muted Olive Green
        tertiary: "#313E17",     // Dark Forest Green
        background: "#1B0C0C",   // Deep Dark Espresso / Near Black
      },
      fontFamily: {
        headings: ["'Array-Regular'", "sans-serif"],
        body: ["'Sentient-Medium'", "sans-serif"],
      },
    },
  },
  plugins: [],
}

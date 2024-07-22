/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'bahnschrift': ['Bahnschrift', 'sans-serif'],
        'sans': ['PT Sans', 'sans-serif']
      }
    },
  },
  plugins: [],
}
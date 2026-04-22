/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#F4872B",
        secondary: "#1A56DB",
        accent: "#22C55E",
        yellow: "#FACC15",
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [
    require("nativewind/preset"),
  ],

  theme: {
    extend: {
      colors: {
        feedants: {
          teal: "#078895",
          darkTeal: "#087681",
          navy: "#14284B",
          light: "#EEF9FA",
          background: "#F8FBFC",
        },
      },
    },
  },

  plugins: [],
};
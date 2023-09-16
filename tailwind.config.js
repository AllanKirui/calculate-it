/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      fontFamily: {
        viga: ["Viga"],
      },
      colors: {
        "navajo-white": "#fedaaa",
        "mango-tango": "#f28e40",
        liver: "#6b321e",
        "sandy-brown": "#f2a05e",
        "seal-brown": "#492513",
        "pearl-copper": "#7d3c28",
      },
    },
  },
  plugins: [],
};

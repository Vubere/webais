/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "280px",
        smb: "360px",
        bmb: "428px",
        stbt: "640px",
        btbt: "768px",
        slp: "1024px",
        blp: "1280px",
      },
    },
  },
  plugins: [],
};

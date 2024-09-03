// tailwind.config.js
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#151924",
            foreground: "#11181C",
            primary: {
              foreground: "#FFFFFF",
              DEFAULT: "white",
            },
            secondary: {
              //... 50 to 900
              DEFAULT: "#7A0A2D",
            },
            tertiary: {
              DEFAULT: "black"
            }
          },
        },
        dark: {
          colors: {
            foreground: "white",
            primary: {
              DEFAULT: "#111213",
            },
            secondary: {
              //... 50 to 900
              DEFAULT: "#484217",
            },
            tertiary: {
              DEFAULT: "#7A0A2D"
            },
            dmWhite: {
              DEFAULT: "white"
            }
          },
        },
      },
    }),
  ],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-high": "#201f1f",
        "surface": "#0e0e0e",
        "surface-container-highest": "#262626",
        "background": "#0e0e0e",
        "surface-variant": "#262626",
        "surface-container-low": "#131313",
        "surface-container": "#1a1919",
        "surface-container-lowest": "#000000",
        "inverse-surface": "#fcf9f8",
        "primary-container": "#ff7576",
        "primary": "#ff8d8c",
        "surface-bright": "#2c2c2c",
        "on-surface": "#ffffff",
        "on-background": "#ffffff",
        "primary-dim": "#ff7072",
        "error": "#ff7351",
        "on-surface-variant": "#adaaaa",
        "on-primary": "#640010",
        "outline-variant": "#484847",
      },
      fontFamily: {
        "headline": ["Epilogue", "sans-serif"],
        "body": ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}

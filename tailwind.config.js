/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],


  theme: {
    extend: {
      backgroundImage: {
        'pattern': "url('/src/assets/images/BG.svg')",
        'patternprimary': "url('/src/assets/images/BG primary.svg')",
        'wave': "url('/src/assets/images/wave.svg')",
        'gradient': "url('/src/assets/images/gradient.jpg')",
      },
      colors: {
        'primary': '#207da9',
        'secondary': '#115579',
        'base-color': '#f3f7fa',
      },
      fontFamily: {
        // Ubuntu Fonts
        'ubuntu': ['"Ubuntu"', 'sans-serif'],
        'ubuntu-bold': ['"Ubuntu Bold"', 'sans-serif'],
        'ubuntu-bold-italic': ['"Ubuntu Bold Italic"', 'sans-serif'],
        'ubuntu-light': ['"Ubuntu Light"', 'sans-serif'],
        'ubuntu-light-italic': ['"Ubuntu Light Italic"', 'sans-serif'],
        'ubuntu-medium': ['"Ubuntu Medium"', 'sans-serif'],
        'ubuntu-medium-italic': ['"Ubuntu Medium Italic"', 'sans-serif'],
        'ubuntu-regular': ['"Ubuntu Regular"', 'sans-serif'],

        // Helvetica Fonts
        helvetica: ['"Helvetica"', "sans-serif"],
        "helvetica-bold": ['"Helvetica Bold"', "sans-serif"],
        "helvetica-bold-oblique": [
          '"Helvetica Bold Oblique"',
          "sans-serif",
        ],
        "helvetica-compressed": [
          '"Helvetica Compressed"',
          "sans-serif",
        ],
        "helvetica-light": ['"Helvetica Light"', "sans-serif"],
        "helvetica-oblique": ['"Helvetica Oblique"', "sans-serif"],
        "helvetica-rounded-bold": [
          '"Helvetica Rounded Bold"',
          "sans-serif",
        ],

        // Uni Sans Fonts
        "uni-sans-heavy": ['"Uni Sans Heavy"', "sans-serif"],
        "uni-sans-heavy-italic": [
          '"Uni Sans Heavy Italic"',
          "sans-serif",
        ],
        "uni-sans-thin": ['"Uni Sans Thin"', "sans-serif"],
        "uni-sans-thin-italic": [
          '"Uni Sans Thin Italic"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}


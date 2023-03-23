/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./_site/**/*.{html,webc}"],
  theme: {
    extend: {
      colors: {
        brown: {
          lightest: "#f9f2ec",
          light: "#ecd9c6",
          DEFAULT: "#996633",
        },
      },
    },
  },
  plugins: [],
};

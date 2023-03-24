/** @type {import('tailwindcss').Config} */
const contentRoot = process.env.ELEVENTY_PRODUCTION ? "site" : "_site";
module.exports = {
  content: [`./${contentRoot}/**/*.{html,webc}`],
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

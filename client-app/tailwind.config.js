module.exports = {
  content: ["./src/**/*.{jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brown: {
          lightest: "#f9f2ec",
          light: "#ecd9c6",
          DEFAULT: "#996633",
        },
        gold: {
          DEFAULT: "#dab574",
        },
      },
      maxHeight: {
        0: "0",
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
      },
    },
  },
  plugins: [],
  corePlugins: require("tailwind-rn/unsupported-core-plugins"),
};

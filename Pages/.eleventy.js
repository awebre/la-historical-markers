const pluginWebc = require("@11ty/eleventy-plugin-webc");

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./styles/tailwind.config.js");
  eleventyConfig.addWatchTarget("./styles/tailwind.css");

  eleventyConfig.addPassthroughCopy({ "./_tmp/style.css": "./style.css" });

  eleventyConfig.addPlugin(pluginWebc, {
    components: ["src/_components/**/*.webc", "src/_components/*.webc"],
  });

  return { dir: { input: "src", output: "_site" } };
};

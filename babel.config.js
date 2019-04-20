module.exports = {
  plugins: ["transform-vue-jsx"],
  presets: [
    ["@vue/app", {
      useBuiltIns: "entry",
    }],
  ],
};

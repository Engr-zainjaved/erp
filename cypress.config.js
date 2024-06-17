const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // Add chromeWebSecurity configuration
  // chromeWebSecurity: false
  e2e: {
    projectId: "yjko4u",

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://www.google.com/",
    viewportHeight: 1200,
    viewportWidth: 700,
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});

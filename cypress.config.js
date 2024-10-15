const { defineConfig } = require('cypress');
const cucumber = require('cypress-cucumber-preprocessor').default;

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("file:preprocessor", cucumber())
    },
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    baseUrl: 'https://example.cypress.io',
    defaultCommandTimeout: 8000,
    reporter: 'mochawesome',
    video: false,
  },
});

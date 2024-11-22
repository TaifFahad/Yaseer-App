// export default {
//   e2e: {
//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//     },
//   },
// };
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8100', // Update to your Ionic app's local server URL
    supportFile: 'cypress/support/e2e.ts',
  },
});




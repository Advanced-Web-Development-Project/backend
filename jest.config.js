module.exports = {
  testEnvironment: 'node', // Environment under which the tests will be executed
  testMatch: ['<rootDir>/test/*.test.js'], // Matches any files ending with .test.js in the test directory
  setupFilesAfterEnv: ['<rootDir>/test/utils/testSetup.js'], // Path to your setup file
};
// Add this if coverage isn't showing all files
// collectCoverageFrom: [
// 	"src/**/*.js",
// 	"!src/app.js",
// 	"!**/node_modules/**",
// ],
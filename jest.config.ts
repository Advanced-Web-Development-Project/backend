export default {
  preset: 'ts-jest',
  testEnvironment: 'node', // Environment under which the tests will be executed
  testMatch: ['<rootDir>/test/*.test.ts'], // Matches any files ending with .test.js in the test directory
  setupFilesAfterEnv: ['<rootDir>/test/utils/testSetup.ts'], // Path to your setup file
	coveragePathIgnorePatterns: [
    "<rootDir>/src/utils/",
		"<rootDir>/src/config/googleStrategy.ts",
  ],
};
// Add this if coverage isn't showing all files
// collectCoverageFrom: [
// 	"src/**/*.js",
// 	"!src/app.js",
// 	"!**/node_modules/**",
// ],

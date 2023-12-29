const dbHandler = require('./dbHandler');
const { createApp } = require('../../src/app');

const app = createApp();

beforeAll(async () => {
  await dbHandler.connect();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

const clearDatabase = async () => {
  await dbHandler.clearDatabase();
};

module.exports = app;

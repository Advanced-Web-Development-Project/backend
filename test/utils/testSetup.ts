import dbHandler from './dbHandler';
import { createApp } from '../../src/app';

const app = createApp();

beforeAll(async () => {
	await dbHandler.connect();
});

afterAll(async () => {
	await dbHandler.closeDatabase();
});

// const clearDatabase = async () => {
// 	await dbHandler.clearDatabase();
// };

export default app;

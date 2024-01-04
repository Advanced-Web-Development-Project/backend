import request from 'supertest';
import app from './utils/testSetup';
import generator from './utils/dataGenerator';

describe('Users API test', () => {
	const generatedUserData = [generator.generateValidUserData(), generator.generateValidUserData(), generator.generateValidUserData()];
	const loginData = [
		{ email: generatedUserData[0].email, 
			password: generatedUserData[0].password 
		}, 
		{ email: generatedUserData[1].email, 
			password: generatedUserData[1].password
		},
		{
			email: generatedUserData[2].email,
			password: generatedUserData[2].password
		}];
	const userIds = [];
	const tokens = [];

	beforeAll(async () => {
		await request(app).post('/auth/register').send(generatedUserData[0]);
		await request(app).post('/auth/register').send(generatedUserData[1]);
		await request(app).post('/auth/register').send(generatedUserData[2]);

		const res1 = await request(app).post('/auth/login').send(loginData[0]);
		const res2 = await request(app).post('/auth/login').send(loginData[1]);
		const res3 = await request(app).post('/auth/login').send(loginData[2]);

		userIds.push(res1.body.data.userInfo.id);
		userIds.push(res2.body.data.userInfo.id);
		userIds.push(res3.body.data.userInfo.id);
		
		tokens.push(res1.body.data.token);
		tokens.push(res2.body.data.token);
		tokens.push(res3.body.data.token);
	});

	it('should get all users', async () => {
		const res = await request(app).get('/users');
		expect(res.statusCode).toEqual(200);
		expect(res.body.data).toHaveLength(3);
	});

	it('should get a user by username', async () => {
		const res = await request(app).get(`/users/${generatedUserData[0].username}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.data.username).toEqual(generatedUserData[0].username);
	});

	it('should not get a user by username if the user does not exist', async () => {
		const res = await request(app).get(`/users/${generator.generateValidUserData().username}`);
		expect(res.statusCode).toEqual(404);
	});

	it ('should update a user', async () => {
		const updatedUserData = generator.generateValidUserData();
		const res = await request(app).patch(`/users/${generatedUserData[0].username}`).set('token', `${tokens[0]}`).send(updatedUserData);
		expect(res.statusCode).toEqual(200);
		expect(res.body.data.username).toEqual(updatedUserData.username);

		// return the user to its original state
		await request(app).patch(`/users/${updatedUserData.username}`).set('token', `${tokens[0]}`).send(generatedUserData[0]);
	});

	it ('should not update a user if the user is not the same user requesting the update', async () => {
		const updatedUserData = generator.generateValidUserData();
		const res = await request(app).patch(`/users/${generatedUserData[0].username}`).set('token', `${tokens[1]}`).send(updatedUserData);
		expect(res.statusCode).toEqual(403);
	});

	it ('should not update a user if the user does not exist', async () => {
		const updatedUserData = generator.generateValidUserData();
		const res = await request(app).patch(`/users/${generator.generateValidUserData().username}`).set('token', `${tokens[0]}`).send(updatedUserData);
		expect(res.statusCode).toEqual(404);
	});

	it('should delete a user', async () => {
		const res = await request(app).delete(`/users/${userIds[2]}`).set('token', `${tokens[2]}`);
		expect(res.statusCode).toEqual(200);

		// check that the user has been deleted
		const res2 = await request(app).get(`/users/${generatedUserData[2].username}`);
		expect(res2.statusCode).toEqual(404);


		// check that only 2 users are left from the original 3
		const res3 = await request(app).get('/users');
		expect(res3.statusCode).toEqual(200);
		expect(res3.body.data).toHaveLength(2);
	});

	it('should not delete a user if the user is not the same user requesting the delete', async () => {
		const res = await request(app).delete(`/users/${userIds[0]}`).set('token', `${tokens[1]}`);
		expect(res.statusCode).toEqual(403);

		// check that the user has not been deleted
		const res2 = await request(app).get(`/users/${generatedUserData[0].username}`);
		expect(res2.statusCode).toEqual(200);

		// check that still there are only 2 users
		const res3 = await request(app).get('/users');
		expect(res3.statusCode).toEqual(200);
		expect(res3.body.data).toHaveLength(2);
	});

	it('should not delete a user if the user does not exist', async () => {
		// use the previously deleted user's credentials and be unauthorized
		const res = await request(app).delete(`/users/${userIds[2]}`).set('token', `${tokens[2]}`);
		expect(res.statusCode).toEqual(401);

		// check that still there are only 2 users
		const res2 = await request(app).get('/users');
		expect(res2.statusCode).toEqual(200);
		expect(res2.body.data).toHaveLength(2);
	});

});
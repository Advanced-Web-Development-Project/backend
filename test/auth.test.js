const request = require('supertest');
const app = require('./utils/testSetup');

describe('auth API Test', () => {
  it('should register a new user', async () => {
    const userData = {
      email: 'test12@gmail.com',
      password: 'test12',
      username: 'test12',
      name: 'test12',
    };

    const res = await request(app).post('/auth/register').send(userData);
    expect(res.statusCode).toEqual(201); // 201 for successful creation
  });

  it('should log in the created user', async () => {
    const loginData = {
      email: 'test12@gmail.com',
      password: 'test12',
    };
    const res = await request(app).post('/auth/login').send(loginData);
    expect(res.statusCode).toEqual(200); // 200 for successful login
    expect(res.body).toHaveProperty('token'); // Assuming the response should have a token property
  });

  it('should not register a new user with an existing email', async () => {
    const userData = {
      email: 'test12@gmail.com',
      password: 'test123',
      username: 'test123',
      name: 'test123',
    };
    const res = await request(app).post('/auth/register').send(userData);
    expect(res.statusCode).toEqual(409); // 409 for conflict
  });
});

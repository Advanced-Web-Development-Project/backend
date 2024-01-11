import request from 'supertest';
import app from './utils/testSetup';
import generator from './utils/dataGenerator';

describe('local auth API Test', () => {
  const validUser = generator.generateValidUserData();
  it('should register a new user', async () => {
    const res = await request(app).post('/auth/register').send(validUser);
    expect(res.statusCode).toEqual(201); // 201 for successful creation
  });

  const invalidEmailUser = generator.generateInvalidEmailUserData();
  it('should not register a new user with an invalid email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(invalidEmailUser);
    expect(res.statusCode).toEqual(400); // 400 for bad request
  });

  const duplicateEmailUser =
    generator.generateDuplicateEmailUserData(validUser);
  it('should not register a new user with an existing email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(duplicateEmailUser);
    expect(res.statusCode).toEqual(409); // 409 for conflict
  });

  const duplicateUsernameUser =
    generator.generateDuplicateUsernameUserData(validUser);
  it('should not register a new user with an existing username', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(duplicateUsernameUser);
    expect(res.statusCode).toEqual(409); // 409 for conflict
  });

  it('should log in the created user', async () => {
    const loginData = {
      email: validUser.email,
      password: validUser.password,
    };
    const res = await request(app).post('/auth/login').send(loginData);
    expect(res.statusCode).toEqual(200); // 200 for successful login
    expect(res.body.data).toHaveProperty('token'); // Check if token is returned
  });

  it('should not log in a user with invalid credentials', async () => {
    const loginData = {
      email: validUser.email,
      password: validUser.password + 'invalid',
    };
    const res = await request(app).post('/auth/login').send(loginData);
    expect(res.statusCode).toEqual(401); // 401 for unauthorized
  });

  it('should log out a user', async () => {
    const res = await request(app).post('/auth/logout');
    expect(res.statusCode).toEqual(200); // 200 for successful logout
  });

  it('should not try to log in a user with an invalid email', async () => {
    const loginData = {
      email: invalidEmailUser.email,
      password: invalidEmailUser.password,
    };
    const res = await request(app).post('/auth/login').send(loginData);
    expect(res.statusCode).toEqual(400); // 400 for bad request
  });


});

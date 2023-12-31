import request from 'supertest';
import app from './utils/testSetup';
import generator from './utils/dataGenerator';

describe('post API Test', () => {
  const validUser = generator.generateValidUserData();
  let token: string;

  beforeAll(async () => {
    await request(app).post('/auth/register').send(validUser);
    const loginData = {
      email: validUser.email,
      password: validUser.password,
    };
    const res = await request(app).post('/auth/login').send(loginData);
    token = res.body.data.token;
  });

  it('should create a new post', async () => {
    const postData = generator.generateValidPostData();
    const res = await request(app)
      .post('/posts')
      .set('token', `${token}`)
      .send(postData);
    expect(res.statusCode).toEqual(201); // 201 for successful creation
  });

});
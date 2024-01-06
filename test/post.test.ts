import request from 'supertest';
import app from './utils/testSetup';
import generator from './utils/dataGenerator';

describe('post API Test', () => {
  const validUser = generator.generateValidUserData();
  let token: string;
	const createdPosts = [];

  beforeAll(async () => {
    await request(app).post('/auth/register').send(validUser);
    const loginData = {
      email: validUser.email,
      password: validUser.password,
    };
    const res = await request(app).post('/auth/login').send(loginData);
    token = res.body.data.token;
  });

  it('should create a new post with image', async () => {
    const postData = generator.generateValidPostData(); // With image
    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postData);

    expect(res.statusCode).toEqual(201); // 201 for successful creation
    expect(res.body.data.imagePath).toEqual(postData.imagePath);
		createdPosts.push(res.body.data._id);
  });

  it('should create a new post without image and use default image', async () => {
    const postData = generator.generateValidPostDataWithoutImage();
    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postData);

    expect(res.statusCode).toEqual(201); // 201 for successful creation
    expect(res.body.data.imagePath).toEqual(
      'public/images/default/default-post-image.png'
    );
		createdPosts.push(res.body.data._id);
  });

	it('should get all posts', async () => {
		const res = await request(app).get('/posts');

		expect(res.statusCode).toEqual(200); // 200 for successful request
		expect(res.body.data.length).toEqual(2); // there should be 2 posts from previous tests
	});

	it('should not create a new post for unauthenticated user', async () => {
		const postData = generator.generateValidPostData();
		const res = await request(app)
			.post('/posts')
			.send(postData);

		expect(res.statusCode).toEqual(401); // 401 for unauthorized
		const numberOfPosts = await request(app).get('/posts');
		expect(numberOfPosts.body.data.length).toEqual(2); // there should be 2 posts from previous tests
	});

	it('should not create a new post with no title', async () => {
		const postData = generator.generateValidPostData();
		postData.title = '';
		const res = await request(app)
			.post('/posts')
			.set('Authorization', `Bearer ${token}`)
			.send(postData);

		expect(res.statusCode).toEqual(400); // 400 for invalid data bad request
		const numberOfPosts = await request(app).get('/posts');
		expect(numberOfPosts.body.data.length).toEqual(2); // there should be 2 posts from previous tests
	});

	it('should not create a new post with no content', async () => {
		const postData = generator.generateValidPostData();
		postData.content = '';
		const res = await request(app)
			.post('/posts')
			.set('Authorization', `Bearer ${token}`)
			.send(postData);

		expect(res.statusCode).toEqual(400); // 400 for invalid data bad request
		const numberOfPosts = await request(app).get('/posts');
		expect(numberOfPosts.body.data.length).toEqual(2); // there should be 2 posts from previous tests
	});

	it('should get a single post', async () => {
		const postId = createdPosts[0];
		const singlePost = await request(app).get(`/posts/${postId}`);

		expect(singlePost.statusCode).toEqual(200); // 200 for successful request
		expect(singlePost.body.data._id).toEqual(postId);
	});

	it('should not get a single post with invalid postId', async () => {
		const postId = 'invalidPostId';
		const singlePost = await request(app).get(`/posts/${postId}`);

		expect(singlePost.statusCode).toEqual(404); // 500 for server error
	});

	it('should update a post', async () => {
		const postId = createdPosts[0];
		const postData = generator.generateValidPostData();
		const res = await request(app)
			.put(`/posts/${postId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(postData);

		expect(res.statusCode).toEqual(200); // 200 for successful request
		expect(res.body.data._id).toEqual(postId);
		expect(res.body.data.title).toEqual(postData.title);
		expect(res.body.data.content).toEqual(postData.content);
	});

	it('should not update a post with invalid postId', async () => {
		const postId = 'invalidPostId';
		const postData = generator.generateValidPostData();
		const res = await request(app)
			.put(`/posts/${postId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(postData);

		expect(res.statusCode).toEqual(400); // 400 for invalid data
	});

	it('should delete a post', async () => {
		const postId = createdPosts[1];
		const res = await request(app)
			.delete(`/posts/${postId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toEqual(200); // 200 for successful request
		expect(res.body.data._id).toEqual(postId);
		const numberOfPosts = await request(app).get('/posts');
		expect(numberOfPosts.body.data.length).toEqual(1); // there should be 1 post from previous tests
		createdPosts.pop(); // remove deleted post from array
	});

	it('should not delete a post with invalid postId', async () => {
		const postId = 'invalidPostId';
		const res = await request(app)
			.delete(`/posts/${postId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toEqual(400); // 400 for invalid data
		const numberOfPosts = await request(app).get('/posts');
		expect(numberOfPosts.body.data.length).toEqual(1); // there should be 1 post from previous tests
	});

	it('should like a post', async () => {
		const postId = createdPosts[0];
		const res = await request(app)
			.patch(`/posts/${postId}/like`)
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toEqual(200); // 200 for successful request
		expect(res.body.data._id).toEqual(postId);
		expect(res.body.data.likes.length).toEqual(1);
	});

	it('should remove like from a post if already liked', async () => {
		const postId = createdPosts[0];
		const res = await request(app)
			.patch(`/posts/${postId}/like`)
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toEqual(200); // 200 for successful request
		expect(res.body.data._id).toEqual(postId);
		expect(res.body.data.likes.length).toEqual(0);
	});

	it ('should dislike a post', async () => {
		const postId = createdPosts[0];
		const res = await request(app)
			.patch(`/posts/${postId}/dislike`)
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toEqual(200); // 200 for successful request
		expect(res.body.data._id).toEqual(postId);
		expect(res.body.data.dislikes.length).toEqual(1);
	});

	it ('should remove dislike from a post if already disliked', async () => {
		const postId = createdPosts[0];
		const res = await request(app)
			.patch(`/posts/${postId}/dislike`)
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toEqual(200); // 200 for successful request
		expect(res.body.data._id).toEqual(postId);
		expect(res.body.data.dislikes.length).toEqual(0);
	});

	it ('should like a post and remove dislike if already disliked', async () => {
		const postId = createdPosts[0];
		await request(app).patch(`/posts/${postId}/dislike`).set('Authorization', `Bearer ${token}`); // dislike post
		const res = await request(app)
			.patch(`/posts/${postId}/like`)
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toEqual(200); // 200 for successful request
		expect(res.body.data._id).toEqual(postId);
		expect(res.body.data.likes.length).toEqual(1);
		expect(res.body.data.dislikes.length).toEqual(0);
	});

	it ('should dislike a post and remove like if already liked', async () => {
		const postId = createdPosts[0];
		await request(app).patch(`/posts/${postId}/like`).set('Authorization', `Bearer ${token}`); // like post
		const res = await request(app)
			.patch(`/posts/${postId}/dislike`)
			.set('Authorization', `Bearer ${token}`);

		expect(res.statusCode).toEqual(200); // 200 for successful request
		expect(res.body.data._id).toEqual(postId);
		expect(res.body.data.likes.length).toEqual(0);
		expect(res.body.data.dislikes.length).toEqual(1);
	});

});

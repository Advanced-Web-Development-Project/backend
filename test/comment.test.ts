import request from 'supertest';
import app from './utils/testSetup';
import generator from './utils/dataGenerator';

describe('Comments API test', () => {
	const generatedUserData = [generator.generateValidUserData(), generator.generateValidUserData()];
	const loginData = [
		{ email: generatedUserData[0].email, 
			password: generatedUserData[0].password 
		}, 
		{ email: generatedUserData[1].email, 
			password: generatedUserData[1].password
		},
	];
	const userIds = [];
	const tokens = [];

	const generatedPostData = [generator.generateValidPostData(), generator.generateValidPostData()];
	const postIds = [];

	// const generatedCommentData = [generator.generateValidCommentData(), generator.generateValidCommentData()];

	beforeAll(async () => {
		await request(app).post('/auth/register').send(generatedUserData[0]);
		await request(app).post('/auth/register').send(generatedUserData[1]);

		const loginResponse1 = await request(app).post('/auth/login').send(loginData[0]);
		const loginResponse2 = await request(app).post('/auth/login').send(loginData[1]);

		userIds.push(loginResponse1.body.data.userInfo.id);
		userIds.push(loginResponse2.body.data.userInfo.id);

		tokens.push(loginResponse1.body.data.accessToken);
		tokens.push(loginResponse2.body.data.accessToken);

		const postResponse1 = await request(app).post('/posts').set('Authorization', `Bearer ${tokens[0]}`).send(generatedPostData[0]);
		const postResponse2 = await request(app).post('/posts').set('Authorization', `Bearer ${tokens[1]}`).send(generatedPostData[1]);

		postIds.push(postResponse1.body.data._id);
		postIds.push(postResponse2.body.data._id);

	});

	it('should create a comment', async () => {
		const commentData = generator.generateValidCommentData();
		const res = await request(app).post(`/posts/${postIds[0]}/comments`).set('Authorization', `Bearer ${tokens[0]}`).send(commentData);
		expect(res.statusCode).toEqual(201);

		// get the comment and make sure that it has the correct content
		const post = await request(app).get(`/posts/${postIds[0]}/comments`);
		expect(post.body.data[0].content).toEqual(commentData.content);
	});

	it('should add the comment to the post', async () => {
		const res = await request(app).get(`/posts/${postIds[0]}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.data.comments).toHaveLength(1);
	});

	it('should add the comment to the user', async () => {
		const res = await request(app).get(`/users/${generatedUserData[0].username}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.data.comments).toHaveLength(1);
	});

	it('should not create a comment with invalid post ID', async () => {
		const commentData = generator.generateValidCommentData();
		const res = await request(app).post(`/posts/123/comments`).set('Authorization', `Bearer ${tokens[0]}`).send(commentData);
		expect(res.statusCode).toEqual(400);
	});

	it('should not create a comment with invalid token', async () => {
		const commentData = generator.generateValidCommentData();
		const res = await request(app).post(`/posts/${postIds[0]}/comments`).set('Authorization', `Bearer ${tokens[0]}123`).send(commentData);
		expect(res.statusCode).toEqual(401);
	});

	it('should not create a comment with invalid content', async () => {
		const commentData = generator.generateInvalidCommentData();
		const res = await request(app).post(`/posts/${postIds[0]}/comments`).set('Authorization', `Bearer ${tokens[0]}`).send(commentData);
		expect(res.statusCode).toEqual(400);
	});

	it('should get all comments on a post', async () => {
		const res = await request(app).get(`/posts/${postIds[0]}/comments`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.data).toHaveLength(1);

		// add another comment by the other user and check if it is returned too
		const commentData = generator.generateValidCommentData();
		await request(app).post(`/posts/${postIds[0]}/comments`).set('Authorization', `Bearer ${tokens[0]}`).send(commentData);
		const res2 = await request(app).get(`/posts/${postIds[0]}/comments`);
		expect(res2.statusCode).toEqual(200);
		expect(res2.body.data).toHaveLength(2);
	});

	it('should correctly display the comment\'s author', async () => {
		const res = await request(app).get(`/posts/${postIds[0]}/comments`);
		expect(res.statusCode).toEqual(200);
		expect(res.body.data[0].username).toEqual(generatedUserData[0].username);
		expect(res.body.data[1].username).toEqual(generatedUserData[0].username);
	});

	it('should not get comments on a post with invalid post ID', async () => {
		const res = await request(app).get(`/posts/123/comments`);
		expect(res.statusCode).toEqual(400);
	});

	it('should update a comment', async () => {
		// create a comment on the post with no comments yet
		const commentData = generator.generateValidCommentData();
		const res = await request(app).post(`/posts/${postIds[1]}/comments`).set('Authorization', `Bearer ${tokens[0]}`).send(commentData);
		expect(res.statusCode).toEqual(201);

		// update the comment
		const commentId = res.body.data.commentId;
		const updatedCommentData = generator.generateValidCommentData();
		const res2 = await request(app).patch(`/posts/${postIds[1]}/comments/${commentId}`).set('Authorization', `Bearer ${tokens[0]}`).send(updatedCommentData);

		// check if the comment was updated
		expect(res2.statusCode).toEqual(200);
		const res3 = await request(app).get(`/posts/${postIds[1]}/comments`);
		expect(res3.body.data[0].content).toEqual(updatedCommentData.content);
	});

	it('should not update a comment that doesn\'t exist', async () => {
		const commentData = generator.generateValidCommentData();
		const res = await request(app).patch(`/posts/${postIds[1]}/comments/123`).set('Authorization', `Bearer ${tokens[0]}`).send(commentData);
		expect(res.statusCode).toEqual(404);
	});

	it('should not update a comment of another user', async () => {
		// create a comment
		const commentData = generator.generateValidCommentData();
		const res = await request(app).post(`/posts/${postIds[1]}/comments`).set('Authorization', `Bearer ${tokens[0]}`).send(commentData);
		expect(res.statusCode).toEqual(201);

		// update the comment with the other user's token
		const commentId = res.body.data.commentId;
		const updatedCommentData = generator.generateValidCommentData();
		const res2 = await request(app).patch(`/posts/${postIds[1]}/comments/${commentId}`).set('Authorization', `Bearer ${tokens[1]}`).send(updatedCommentData);
		expect(res2.statusCode).toEqual(403);
	});

	it('should not update a comment with invalid post ID', async () => {
		const commentData = generator.generateValidCommentData();
		const res = await request(app).patch(`/posts/123/comments/123`).set('Authorization', `Bearer ${tokens[0]}`).send(commentData);
		expect(res.statusCode).toEqual(400);
	});

	it('should delete a comment, and remove the references in post and user', async () => {
		// create a comment
		const commentData = generator.generateValidCommentData();
		const res = await request(app).post(`/posts/${postIds[0]}/comments`).set('Authorization', `Bearer ${tokens[0]}`).send(commentData);
		expect(res.statusCode).toEqual(201);

		// delete the comment
		const commentId = res.body.data.commentId;
		const res2 = await request(app).delete(`/posts/${postIds[0]}/comments/${commentId}`).set('Authorization', `Bearer ${tokens[0]}`);
		expect(res2.statusCode).toEqual(200);

		// check if the comment was removed from the post
		const res3 = await request(app).get(`/posts/${postIds[0]}`);
		expect(res3.body.data.comments).not.toContain(commentId);

		// check if the comment was removed from the user
		const res4 = await request(app).get(`/users/${generatedUserData[0].username}`);
		expect(res4.body.data.comments).not.toContain(commentId);
	});

	it('should not delete a comment from another post', async () => {
		// create a comment on one post
		const commentData = generator.generateValidCommentData();
		const res = await request(app).post(`/posts/${postIds[0]}/comments`).set('Authorization', `Bearer ${tokens[0]}`).send(commentData);
		expect(res.statusCode).toEqual(201);

		// delete the comment from another post
		const commentId = res.body.data.commentId;
		const res2 = await request(app).delete(`/posts/${postIds[1]}/comments/${commentId}`).set('Authorization', `Bearer ${tokens[0]}`);
		expect(res2.statusCode).toEqual(404);
	});

	it('should not delete a comment that doesn\'t exist', async () => {
		const res = await request(app).delete(`/posts/${postIds[0]}/comments/123`).set('Authorization', `Bearer ${tokens[0]}`);
		expect(res.statusCode).toEqual(404);
	});

	it('should not delete a comment with invalid post ID', async () => {
		// create a comment
		const commentData = generator.generateValidCommentData();
		const res = await request(app).post(`/posts/${postIds[0]}/comments`).set('Authorization', `Bearer ${tokens[0]}`).send(commentData);
		expect(res.statusCode).toEqual(201);

		// try to delete the comment, but with an invalid post ID
		const commentId = res.body.data.commentId;
		const res2 = await request(app).delete(`/posts/123/comments/${commentId}`).set('Authorization', `Bearer ${tokens[0]}`);
		expect(res2.statusCode).toEqual(400);
	});
	
	it('should not delete a comment with invalid comment ID', async () => {
		const res = await request(app).delete(`/posts/${postIds[0]}/comments/123`).set('Authorization', `Bearer ${tokens[0]}`);
		expect(res.statusCode).toEqual(404);
	});

	it('should not delete a comment with invalid token', async () => {
		// create a comment
		const commentData = generator.generateValidCommentData();
		const res = await request(app).post(`/posts/${postIds[0]}/comments`).set('Authorization', `Bearer ${tokens[0]}`).send(commentData);
		expect(res.statusCode).toEqual(201);

		// try to delete the comment, but with an invalid token
		const commentId = res.body.data.commentId;
		const res2 = await request(app).delete(`/posts/${postIds[0]}/comments/${commentId}`).set('Authorization', `Bearer ${tokens[0]}123`);
		expect(res2.statusCode).toEqual(401);
	});
	
	it('should not delete a comment with another user\'s token', async () => {
		// create a comment
		const commentData = generator.generateValidCommentData();
		const res = await request(app).post(`/posts/${postIds[0]}/comments`).set('Authorization', `Bearer ${tokens[0]}`).send(commentData);
		expect(res.statusCode).toEqual(201);

		// try to delete the comment, but with another user's token
		const commentId = res.body.data.commentId;
		const res2 = await request(app).delete(`/posts/${postIds[0]}/comments/${commentId}`).set('Authorization', `Bearer ${tokens[1]}`);
		expect(res2.statusCode).toEqual(403);
	});
});
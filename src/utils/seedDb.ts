import axios from 'axios';
import dataGenerator from '../../test/utils/dataGenerator';
import { startServer } from '../../src/app';
import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const registerUser = async (userData) => {
  try {
    const response = await axios.post('http://localhost:8000/auth/register', userData, {
      headers: { 
				'Content-Type': 'application/json' 
			}
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response ? error.response.data : error.message);
  }
};

const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      'http://localhost:8000/auth/login', userData,  {
				headers: { 
					'Content-Type': 'application/json' 
				}
			});
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error.message);
  }
};

const createPost = async (token) => {
  try {
    const postData = dataGenerator.generateValidPostDataWithoutImage();
    const response = await axios.post('http://localhost:8000/posts', postData,  {
			headers: { 
				'Content-Type': 'application/json',
				'token': `${token}`
			},
		});
    return response.data.data;
  } catch (error) {
    console.error('Error creating post:', error.message);
  }
};

const createComment = async (token, postId) => {
  try {
    const commentData = dataGenerator.generateValidCommentData();
    const response = await axios.post(
      `http://localhost:8000/posts/${postId}/comments`, commentData, {
        headers: { 
					'Content-Type': 'application/json',
					'token': `${token}`
				},
      });
    return response.data.data;
  } catch (error) {
    console.error('Error creating comment:', error.message);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const likePost = async (token, postId) => {
  try {
    const response = await axios.patch(`http://localhost:8000/posts/${postId}/like`, {}, {
			headers: { 
				'Content-Type': 'application/json',
				'token': `${token}`
			}
    });
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error.message);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dislikePost = async (token, postId) => {
  try {
    const response = await axios.patch(`http://localhost:8000/posts/${postId}/dislike`, {}, {
			headers: { 
				'Content-Type': 'application/json',
				'token': `${token}`
			}
    });
    return response.data;
  } catch (error) {
    console.error('Error disliking post:', error.message);
  }
};

const seedDb = async () => {
  startServer();
  await sleep(7000);
  console.log('Seeding database...');

	console.log('Deleting all previous data from database...');
  await Comment.deleteMany({});
  await Post.deleteMany({});
  await User.deleteMany({});

  const users = [];
  const posts = [];

	// add console logs to see the progress of the seeding
  for (let i = 0; i < 5; i++) {
    const validUserData = dataGenerator.generateValidUserData();
		console.log(`Registering user ${i + 1}...`);
    await registerUser(validUserData);
    const loginResponse = await loginUser({
      email: validUserData.email,
      password: validUserData.password,
    });
    const userToken = loginResponse.data.token;
    users.push({ ...loginResponse.userInfo, token: userToken });

    for (let j = 0; j < 2; j++) {
			console.log(`Creating post ${j + 1} for user ${i + 1}...`);
      const post = await createPost(userToken);
      posts.push(post);
    }
  }

  for (const post of posts) {
		console.log(`Creating comments for post ${post._id}...`);
    for (const user of users) {
      await createComment(user.token, post._id);
      await createComment(user.token, post._id);

      // Randomly decide to like or dislike
      if (Math.random() < 0.5) {
        await likePost(user.token, post._id);
      } else {
        await dislikePost(user.token, post._id);
      }
    }
  }

	console.log('Database seeded!');
	process.exit();
};

seedDb();

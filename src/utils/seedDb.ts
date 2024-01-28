import axios from 'axios';
import dataGenerator from '../../test/utils/dataGenerator';
import { startServer } from '../../src/app';
import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';
import newsGenerator from './newsGenerator';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      'http://localhost:8000/auth/register',
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error registering user:',
      error.response ? error.response.data : error.message
    );
  }
};

const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      'http://localhost:8000/auth/login',
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error.message);
  }
};

const createPost = async (token) => {
  try {
    const postData = dataGenerator.generateValidPostDataWithoutImage();
    const response = await axios.post('http://localhost:8000/posts', postData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
      `http://localhost:8000/posts/${postId}/comments`,
      commentData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error creating comment:', error.message);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const likePost = async (token, postId) => {
  try {
    const response = await axios.patch(
      `http://localhost:8000/posts/${postId}/like`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error.message);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dislikePost = async (token, postId) => {
  try {
    const response = await axios.patch(
      `http://localhost:8000/posts/${postId}/dislike`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error disliking post:', error.message);
  }
};

const createTest123user = async () => {
  const userData = {
    email: 'test123@gmail.com',
    password: 'test123',
    username: 'test123',
    name: 'test123',
  };
  await registerUser(userData);
  console.log('Created test123 user');
};

const createAPIusers = async () => {
  const sportsNewsUser = {
    email: 'sportsNews@gmail.com',
    password: 'sportsNews',
    username: 'sportsNews',
    name: 'sportsNews',
  };
	const technologyNewsUser = {
    email: 'technologyNews@gmail.com',
    password: 'technologyNews',
    username: 'technologyNews',
    name: 'technologyNews',
  };
	const scienceNewsUser = {
    email: 'scienceNews@gmail.com',
    password: 'scienceNews',
    username: 'scienceNews',
    name: 'scienceNews',
  };

  await registerUser(sportsNewsUser);
  console.log('Created sportsNews user');
  await registerUser(technologyNewsUser);
  console.log('Created technologyNews user');
  await registerUser(scienceNewsUser);
  console.log('Created scienceNews user');
};

const createDeletedUser = async () => {
	const userData = {
		email: 'deletedUser@gmail.com',
		password: 'deletedUser',
		username: 'deletedUser',
		name: 'deletedUser'
	}

	await registerUser(userData);
	console.log('Created deletedUser');
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
    const userToken = loginResponse.data.accessToken;
    users.push({ ...loginResponse.userInfo, token: userToken });

    for (let j = 0; j < 2; j++) {
      console.log(`Creating post ${j + 1} for user ${i + 1}...`);
      const post = await createPost(userToken);
      posts.push(post);
    }
  }

  for (const post of posts) {
    console.log(`Creating comments for post ${post.postId}...`);
    for (const user of users) {
      await createComment(user.token, post.postId);
      await createComment(user.token, post.postId);

      // Randomly decide to like or dislike
      if (Math.random() < 0.5) {
        await likePost(user.token, post.postId);
      } else {
        await dislikePost(user.token, post.postId);
      }
    }
  }

  await createTest123user();
  await createAPIusers();
	await createDeletedUser();

	await newsGenerator.run();

  console.log('Database seeded!');
  process.exit();
};

seedDb();

const Post = require('../models/Post'); // Assuming you have a Mongoose model for Post

// This file handles the logic for interacting with the database and returning the data.
// Any changes / formatting of the data should be done here.

const getAllPosts = async () => {
  try {
		return await Post.find(); // return all posts
  } catch (error) {
		throw new Error('Error fetching posts, error: ', error.message || error); // if error.message is undefined, use error instead
  }
};

module.exports = { getAllPosts };

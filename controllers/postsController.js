const postService = require('../services/postsService');

// This file handles the logic for handling the requests and sending back the responses.
// The database interaction is handled by the service file.

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts); // default status is 200
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

module.exports = { getAllPosts };

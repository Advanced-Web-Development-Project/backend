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

const getPost = async (postId) => {

  try {
    return await Post.findById(postId)
  } catch (error) {
    throw new Error('Error getting post, error: ', error.message || error)
  }
};

const createPost = async (post) => {
  try {
    console.log("got to create")
    console.log("body post: ", post)
    return await Post.create(post);
  } catch (error) {
    console.log(error)
    throw new Error('Error creating post, error: ', error)
  }
};

const updatePost = async (postId, post) => {
  try {
    console.log("post - ", post)
    console.log("postId - ", postId)
    return await Post.findByIdAndUpdate(postId, post, { new: true });
  } catch (error) {
    throw new Error('Error updating post, error: ', error.message || error)
  }
};

const deletePost = async (postId) => {
  try {
    return await Post.findByIdAndDelete(postId);
  } catch (error) {
    throw new Error('Error deleting post, error: ', error.message || error)
  }
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};

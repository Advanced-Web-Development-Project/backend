const postService = require('../services/postsService');
const mongoose = require('mongoose');

// This file handles the logic for handling the requests and sending back the responses.
// The database interaction is handled by the service file.

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts); // default status is 200
  } catch (error) {
    return next(error);
  }
}

const getPost = async (req, res, next) => {
  try {
    console.log(req.params)
    const postId = req.params.postId
    const post = await postService.getPost(postId)
    res.json({ post: post })
  } catch (error) {
    return next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const postData = req.body
    const newPost = await postService.createPost(postData);
    res.json({ newPost: newPost })
  } catch (error) {
    return next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {

    const postId = req.params.postId
    const post = req.body

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid postId' });
    }

    const updatedPost = await postService.updatePost(postId, post);
    if (!updatedPost) return res.status(404).json({ errors: 'Post not found' });

    res.status(200).json({ updatedPost: updatedPost })
  } catch (error) {
    return next(error);
  }
};


const deletePost = async (req, res, next) => {
  try {

    const postId = req.params.postId

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid postId' });
    }

    const postInDb = await postService.getPost(postId)
    if (!postInDb) return res.status(404).json({ errors: 'Post not found' });

    const deletedPost = await postService.deletePost(postId);

    res.status(200).json({ deletedPost: deletedPost })
  } catch (error) {
    return next(error);
  }
};



module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};


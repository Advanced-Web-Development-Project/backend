const postService = require('../services/postsService');
const mongoose = require('mongoose');
const { postSchema, validateSchema } = require('../utils/validators');
const HttpResponse = require('../utils/httpResponse');

// This file handles the logic for handling the requests and sending back the responses.
// The database interaction is handled by the service file.

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();

    let response = new HttpResponse()
      .withStatusCode(200)
      .withData(posts)
      .withMessage("Successfully fetched all posts")
      .build();

    res.status(200).json(response);

  } catch (error) {

    let response = new HttpResponse()
      .withStatusCode(500)
      .withMessage('Server Error - get all posts')
      .build();

    res.status(500).json(response);
  }
}

const getPost = async (req, res) => {
  try {

    const postId = req.params.postId
    const post = await postService.getPost(postId)
    res.json({ post: post })
  } catch (error) {

    let response = new HttpResponse()
      .withStatusCode(500)
      .withMessage('Server Error - get  post')
      .build();

    res.status(500).json(response);

  }
};

const createPost = async (req, res, next) => {

  try {

    const postData = req.body

    const response = validateSchema(postSchema, postData)

    if (response !== null) return res.status(422).json(response);

    const newPost = await postService.createPost(postData);
    res.status(200).json({ newPost: newPost })

  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Invalid create post' });
  }
};

const updatePost = async (req, res, next) => {
  try {

    const postId = req.params.postId
    const post = req.body

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid postId' });
    }

    const response = validateSchema(postSchema, post)
    if (response !== null) return res.status(422).json(response);

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
  }
}

const upvotePost = async (req, res) => {
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
  }
};



module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  upvotePost
};


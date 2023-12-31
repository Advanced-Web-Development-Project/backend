const postService = require('../services/postsService');
const mongoose = require('mongoose');
const { postSchema, validateSchema } = require('../utils/validators');
const HttpResponse = require('../utils/httpResponse');

// This file handles the logic for handling the requests and sending back the responses.
// The database interaction is handled by the service file.

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    posts.forEach(post => {
      post['id'] = post._id;
      delete post._id;
    });
    console.log("@@@@", posts)
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

    const errorMessages = validateSchema(postSchema, postData)
    if (errorMessages) {
      const response = new HttpResponse().withStatusCode(422).addError(errorMessages).build();
      return res.status(422).json(response);
    }

    const newPost = await postService.createPost(postData);
    const response = new HttpResponse().withStatusCode(200).addError(errorMessages).withData(newPost).build();
    return res.status(200).json(response);

  } catch (error) {
    console.log(error)
    const response = new HttpResponse().withStatusCode(500).addError(`Invalid create post`).build();
    return res.status(500).json(response);
  }
};

const updatePost = async (req, res, next) => {
  try {

    const postId = req.params.postId
    const post = req.body

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid postId' });
    }

    const errorMessages = validateSchema(postSchema, post)
    if (errorMessages) {
      const response = new HttpResponse().withStatusCode(422).addError(errorMessages).build();
      return res.status(422).json(response);
    }

    const updatedPost = await postService.updatePost(postId, post);
    if (!updatedPost) {
      const response = new HttpResponse().withStatusCode(422).addError('Post not found').build();
      return res.status(404).json(response);
    }

    const response = new HttpResponse().withStatusCode(200).withData(updatedPost).build();
    return res.status(200).json(response);

  } catch (error) {
    const response = new HttpResponse().withStatusCode(500).addError(`Invalid update post`).build();
    return res.status(500).json(response);
  }
};


const deletePost = async (req, res, next) => {
  try {

    const postId = req.params.postId

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      const response = new HttpResponse().withStatusCode(400).addError(`Invalid post id`).build();
      return res.status(400).json(response);
    }

    const postInDb = await postService.getPost(postId)
    if (!postInDb) {
      const response = new HttpResponse().withStatusCode(400).addError('Post not found').build();
      return res.status(404).json(response);
    }

    const deletedPost = await postService.deletePost(postId);
    const response = new HttpResponse().withStatusCode(200).withData(deletedPost).build();
    return res.status(200).json(response);

  } catch (error) {
    const response = new HttpResponse().withStatusCode(500).addError(`Invalid delete post`).build();
    return res.status(500).json(response);
  }
}

const updatePostFields = async (req, res) => {

  try {

    const postId = req.params.postId
    const updatedLikes = req.body.likes

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      const response = new HttpResponse().withStatusCode(400).addError(`Invalid post id`).build();
      return res.status(400).json(response);
    }

    const postInDb = await postService.getPost(postId)
    if (!postInDb) {
      const response = new HttpResponse().withStatusCode(400).addError('Post not found').build();
      return res.status(404).json(response);
    }

    const updateFields = {
      likes: updatedLikes,
    };

    const updatedPost = await postService.updatePostFields(postId, updateFields);

    const response = new HttpResponse().withStatusCode(200).withData(updatedPost).build();
    return res.status(200).json(response);

  } catch (error) {
    const response = new HttpResponse().withStatusCode(500).addError(`Invalid upvote post`).build();
    return res.status(500).json(response);
  }
};



module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  updatePostFields
};


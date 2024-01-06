import postService from '../services/postsService';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { postSchema, validateSchema } from '../utils/validators';
import HttpResponse from '../utils/httpResponse';

// This file handles the logic for handling the requests and sending back the responses.
// The database interaction is handled by the service file.

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await postService.getAllPosts();

    const response = new HttpResponse().withStatusCode(200).withData(posts).withMessage('Successfully fetched all posts').build();

    res.status(200).json(response);
  } catch (error) {
    const response = new HttpResponse().withStatusCode(500).addError('Server Error - get all posts').build();

    res.status(500).json(response);
  }
};

const getPost = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  try {
    const post = await postService.getPost(postId);
		if (!post) {
			const response = new HttpResponse().withStatusCode(404).addError('Post not found').build();
			return res.status(404).json(response);
		}
    const response = new HttpResponse().withStatusCode(200).withMessage('Post fetched successfully').withData(post).build();

    return res.status(200).json(response);
  } catch (error) {
    const response = new HttpResponse().withStatusCode(500).addError("Internal Server Error").build();

    return res.status(500).json(response);
  }
};

const createPost = async (req: Request, res: Response) => {
	const postData = req.body;
	const errorMessages = validateSchema(postSchema, postData);
	if (errorMessages) {
		const response = new HttpResponse().withStatusCode(400).addError(errorMessages).build();
		return res.status(400).json(response);
	}

  try {
    // add post fields that are not in the request body
    postData.user = req.user._id;
    if (req.file) {
      postData.imagePath = req.file.path;
    }
    const newPost = await postService.createPost(req.user._id, postData);
    const response = new HttpResponse().withStatusCode(201).withMessage("Post created successfully").withData(newPost).build();

    return res.status(201).json(response);
  } catch (error) {
    const response = new HttpResponse().withStatusCode(500).addError(`Error while trying to create post: ${error.message}`).build();
    return res.status(500).json(response);
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid postId' });
    }

    const errorMessages = validateSchema(postSchema, post);
    if (errorMessages) {
      const response = new HttpResponse().withStatusCode(422).addError(errorMessages).build();
      return res.status(422).json(response);
    }

    const updatedPost = await postService.updatePost(postId, post);
    if (!updatedPost) {
      const response = new HttpResponse().withStatusCode(404).addError('Post not found').build();
      return res.status(404).json(response);
    }

    const response = new HttpResponse().withStatusCode(200).withMessage("Post updated successfully").withData(updatedPost).build();
    return res.status(200).json(response);
  } catch (error) {
    const response = new HttpResponse().withStatusCode(500).addError(`Invalid update post`).build();
    return res.status(500).json(response);
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      const response = new HttpResponse().withStatusCode(400).addError(`Invalid post id`).build();
      return res.status(400).json(response);
    }

    const postInDb = await postService.getPost(postId);
    if (!postInDb) {
      const response = new HttpResponse().withStatusCode(400).addError('Post not found').build();
      return res.status(404).json(response);
    }

    const deletedPost = await postService.deletePost(postId);
    const response = new HttpResponse().withStatusCode(200).withMessage("Post deleted successfully").withData(deletedPost).build();
    return res.status(200).json(response);
  } catch (error) {
    const response = new HttpResponse().withStatusCode(500).addError(`Invalid delete post`).build();
    return res.status(500).json(response);
  }
};

const likePost = async (req: Request, res: Response) => {
	updatePostReaction(req, res, 'like');
};

const dislikePost = async (req: Request, res: Response) => {
	updatePostReaction(req, res, 'dislike');
};

const updatePostReaction = async (req: Request, res: Response, action) => {
    const postId = req.params.postId;
    const userId = req.user._id;
    try {
        const post = await postService.getPost(postId);
        if (!post) {
            const response = new HttpResponse().withStatusCode(404).addError('Post not found').build();
            return res.status(404).json(response);
        }
        const userHasAlreadyLiked = post.likes.includes(userId);
        const userHasAlreadyDisliked = post.dislikes.includes(userId);

        let update = {};
        switch (action) {
						// like the post if user has not already liked it, otherwise remove the like
						// if user has already disliked the post, remove the dislike
            case 'like':
                update = userHasAlreadyLiked ? { $pull: { likes: userId } } : { $push: { likes: userId } };
                if (userHasAlreadyDisliked) {
                    await postService.updatePostFields(postId, { $pull: { dislikes: userId } });
                }
                break;
						// dislike the post if user has not already disliked it, otherwise remove the dislike
						// if user has already liked the post, remove the like
            case 'dislike':
                update = userHasAlreadyDisliked ? { $pull: { dislikes: userId } } : { $push: { dislikes: userId } };
                if (userHasAlreadyLiked) {
                    await postService.updatePostFields(postId, { $pull: { likes: userId } });
                }
                break;
        }

        const updatedPost = await postService.updatePostFields(postId, update);
        const response = new HttpResponse().withStatusCode(200).withMessage("Posts updated successfully").withData(updatedPost).build();
        return res.status(200).json(response);
    } catch (error) {
        const response = new HttpResponse().withStatusCode(500).addError('Error updating post').build();
        return res.status(500).json(response);
    }
};

export default {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
	dislikePost,
};

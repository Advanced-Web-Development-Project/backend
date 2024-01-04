import { Request, Response, NextFunction } from 'express';
import Post from '../models/Post';
import mongoose from 'mongoose';
import HttpResponse from '../utils/httpResponse';

// Middleware to check if a post exists
async function requirePostExists(req: Request, res: Response, next: NextFunction) {
	const postId = req.params.postId;
	if (!mongoose.Types.ObjectId.isValid(postId)) {
		const response = new HttpResponse().withStatusCode(400).addError('Invalid post ID').build();
		return res.status(400).json(response);
	}
  try {
    const post = await Post.findById(postId);
    if (!post) {
			const response = new HttpResponse().withStatusCode(404).addError('Post not found').build();
      return res.status(404).json(response);
    }
		
    next();
  } catch (error) {
		const response = new HttpResponse().withStatusCode(500).addError("Internal Server Error").build();
		return res.status(500).json(response);
  }
}

export default requirePostExists;

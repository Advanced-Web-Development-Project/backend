import commentService from '../services/commentsService';
import { RequestWithPost } from '../../types/requestWithPost';
import { Response } from 'express';
import { commentSchema, validateSchema } from '../utils/validators';
import HttpResponse from '../utils/httpResponse';

const createComment = async (req: RequestWithPost, res: Response) => {
	// Validate request body
	const errorMessages = validateSchema(commentSchema, req.body);
	if (errorMessages) {
		const response = new HttpResponse().withStatusCode(400).addError(errorMessages).build();
		return res.status(400).json(response);
	}

	const userId = req.user._id;
	const postId = req.post;
	const content = req.body.content;

	try {
		const comment = await commentService.createComment(userId, postId, content);
		const response = new HttpResponse().withStatusCode(201).withMessage("Comment created successfully").withData(comment).build();
		return res.status(201).json(response);
	} catch (error) {
		const response = new HttpResponse().withStatusCode(500).addError(`Error while trying to create the comment: ${error.message}`).build();
		return res.status(500).json(response);
	}
};

const getComments = async (req: RequestWithPost, res: Response) => {
	const postId = req.post._id;
	try {
		const comments = await commentService.getCommentsByPostId(postId);
		const response = new HttpResponse().withStatusCode(200).withData(comments).build();
		return res.status(200).json(response);
	} catch (error) {
		const response = new HttpResponse().withStatusCode(500).addError(`Error while trying to get the comments: ${error.message}`).build();
		return res.status(500).json(response);
	}
};

// const updateComment = async (req: Request, res: Response) => {
// 	const userId = req.user._id;
// 	const postId = req.params.postId;
// 	const commentId = req.params.commentId;
// 	const content = req.body.content;

// 	// Make sure that post exists, then make sure that the comment exists on the post

// 	// Make sure that the person updating the comment is the author of the comment
// 	if (comment.user.toString() !== userId.toString()) {
// 		const response = new HttpResponse().withStatusCode(403).addError('You are not authorized to update this comment').build();
// 		return res.status(403).json(response);
// 	}

// 	// Validate request body
// 	const errorMessages = validateSchema(commentSchema, req.body);
// 	if (errorMessages) {
// 		const response = new HttpResponse().withStatusCode(400).addError(errorMessages).build();
// 		return res.status(400).json(response);
// 	}

// 	try {
// 		const updatedComment = await commentService.updateComment(commentId, content);
// 		const response = new HttpResponse().withStatusCode(200).withMessage("Comment updated successfully").withData(updatedComment).build();
// 		return res.status(200).json(response);
// 	} catch (error) {
// 		const response = new HttpResponse().withStatusCode(500).addError(`Error while trying to update the comment: ${error.message}`).build();
// 		return res.status(500).json(response);
// 	}

// };

// const deleteComment = async (req: Request, res: Response) => {
// };

export default {
	createComment,
	getComments,
	// updateComment,
	// deleteComment,
};
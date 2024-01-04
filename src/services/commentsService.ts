import Comment, { IComment } from '../models/Comment';
import Post from '../models/Post';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

const createComment = async (userId, postId, content: string) => {
  const comment = new Comment({
    user: userId,
    post: postId,
    content,
  });
  await comment.save();

  const post = await Post.findById(postId);
  post.comments.push(comment._id);
  await post.save();

  const user = await User.findById(userId);
  user.comments.push(comment._id);
  await user.save();

  return comment;
};

const getCommentsByPostId = async (postId) => {
  const post = await Post.findById(postId).populate('comments');
  if (!post) {
    throw new Error('Post not found');
  }

  const populatedComments = await Comment.populate(post.comments, {
    path: 'user',
  });
  // map the populated comments to a json object with the author's username, the comment's content, and the creation / modification dates
  const comments = populatedComments.map((comment: IComment) => {
    const user = comment.user as IUser;
    return {
      username: user.username,
      content: comment.content,
      createdAt: comment.createdAt,
			updatedAt: comment.updatedAt,
    };
  });

  return comments;
};

const getCommentById = async (commentId) => {
	if (!mongoose.Types.ObjectId.isValid(commentId)) {
		return null; // invalid comment ids will not be found
	}
	try {
		return await Comment.findById(commentId);
	} catch (error) {
		throw new Error(`Error fetching comment: ${error.message}`);
	}
};

const updateComment = async (commentId, content) => {
	try {
		return Comment.findOneAndUpdate({ _id: commentId }, { content }, { new: true });
	} catch (error) {
		throw new Error(`Error updating comment: ${error.message}`);
	}
};

export default {
  createComment,
  getCommentsByPostId,
	getCommentById,
	updateComment,
};

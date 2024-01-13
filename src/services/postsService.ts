import Post, { IPost } from '../models/Post'; 
import User, { IUser } from '../models/User';
import Comment from '../models/Comment';
import mongoose from 'mongoose';

const getAllPosts = async () => {
	return getPostsByCategory('general');
};

const formatPost = (populatedPost: IPost) => {
	const user = populatedPost.user as IUser;
	return {
			postId: populatedPost._id,
			username: user.username,
			title: populatedPost.title,
			content: populatedPost.content,
			imagePath: populatedPost.imagePath,
			createdAt: populatedPost.createdAt,
			updatedAt: populatedPost.updatedAt,
			likes: populatedPost.likes,
			dislikes: populatedPost.dislikes,
			comments: populatedPost.comments,
	};
};

const getPostsByCategory = async (category: string) => {
	try {
		const populatedPosts = await Post.find({ category }).populate('user');
		const posts = populatedPosts.map((post: IPost) => formatPost(post));
    return posts;
  } catch (error) {
    throw new Error(`Error fetching posts: ${error.message}`);
  }
};

const getPostById = async (postId) => {
	if (!mongoose.Types.ObjectId.isValid(postId)) {
		return null; // invalid post ids will not be found
	}
  try {
		const populatedPost = await Post.findById(postId).populate('user');
		const post = formatPost(populatedPost);
    return post;
  } catch (error) {
    throw new Error(`Error fetching single post: ${error.message}`);
  }
};

const createPost = async (userId, postData) => {
  try {
    const post = await Post.create(postData);
		const user = await User.findById(userId);
		user.posts.push(post._id);
		await user.save();
		const populatedPost = await Post.findById(post._id).populate('user');
		return formatPost(populatedPost);
  } catch (error) {
    throw new Error(`Error creating post: ${error.message}`);
  }
};

const updatePost = async (postId, post) => {
  try {
		const populatedPost = await Post.findByIdAndUpdate(postId, post, { new: true });
		return formatPost(populatedPost);
  } catch (error) {
    throw new Error(`Error updating post: ${error.message}`);
  }
};

const updatePostFields = async (postId, fieldsToUpdate) => {
  try {
    // Check if fieldsToUpdate contains $push or $pull keys (This is for the likes / dislikes arrays)
		let populatedPost: IPost;
    if ('$push' in fieldsToUpdate || '$pull' in fieldsToUpdate) {
      populatedPost = await Post.findByIdAndUpdate(postId, fieldsToUpdate, { new: true }).populate('user');
    } else {
      populatedPost = await Post.findByIdAndUpdate(postId, { $set: fieldsToUpdate }, { new: true });
		}
		return formatPost(populatedPost);
  } catch (error) {
    throw new Error(`Error updating post fields: ${error.message}`);
  }
};


const deletePost = async (postId) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return null; // invalid post ids will not be found
  }
  try {
    // Find the post with the given ID
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Delete all comments associated with the post 
		const commentIds = post.comments;
		Comment.deleteMany({ _id: { $in: commentIds } });

		// Remove comment references from all users' comments array
		await User.updateMany(
			{ comments: { $in: post.comments } },
			{ $pullAll: { comments: post.comments } }
		);

		// Pull the post from the user's posts array
		const user = await User.findById(post.user);
		user.posts.pull(postId);
		await user.save();

    // Delete the post itself
    await Post.findByIdAndDelete(postId);

    return { message: 'Post and associated comments deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting post: ${error.message}`);
  }
};



export default {
	getAllPosts,
	getPostsByCategory,
  getPostById,
  createPost,
  updatePost,
  updatePostFields,
  deletePost,
};

import Post from '../models/Post'; 
import User from '../models/User';

const getAllPosts = async () => {
  try {
    return await Post.find().populate('user'); // return all posts
  } catch (error) {
    throw new Error(`Error fetching all posts: ${error.message}`);
  }
};

const getPost = async (postId) => {
  try {
    return await Post.findById(postId).populate('user');
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
		return post;
  } catch (error) {
    throw new Error(`Error creating post: ${error.message}`);
  }
};

const updatePost = async (postId, post) => {
  try {
    return await Post.findByIdAndUpdate(postId, post, { new: true });
  } catch (error) {
    throw new Error(`Error updating post: ${error.message}`);
  }
};

const updatePostFields = async (postId, fieldsToUpdate) => {
  try {
    // Check if fieldsToUpdate contains $push or $pull keys (This is for the likes / dislikes arrays)
    if ('$push' in fieldsToUpdate || '$pull' in fieldsToUpdate) {
      // Directly use the fieldsToUpdate for $push or $pull operations
      return await Post.findByIdAndUpdate(postId, fieldsToUpdate, { new: true });
    } else {
      // Use $set for other types of updates
      return await Post.findByIdAndUpdate(postId, { $set: fieldsToUpdate }, { new: true });
    }
  } catch (error) {
    throw new Error(`Error updating post fields: ${error.message}`);
  }
};


const deletePost = async (postId) => {
  try {
    return await Post.findByIdAndDelete(postId);
  } catch (error) {
    throw new Error(`Error deleting post: ${error.message}`);
  }
};



export default {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  updatePostFields,
  deletePost,
};

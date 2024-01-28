import Comment from '../models/Comment';
import Post from '../models/Post';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';

const createUser = async (userData: IUser) => {
  const user = await new User(userData).save();
  return user;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });
  return user;
};

const getUserByUsername = async (username: string) => {
  const user = await User.findOne({ username });
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({}).sort({ createdAt: -1 }); // sort by most recent
  return users;
};

const deleteUserById = async (userId) => {
	const deletedUser = await getUserByUsername("deletedUser");
	await Post.updateMany({ user: userId }, { $set: { user: deletedUser._id }});
	await Comment.updateMany({ user: userId }, { $set: { user: deletedUser._id }});
	const user = await User.findByIdAndDelete(userId);
	return user;
};

const updateUser = async (username: string, updatedUserInfo: IUser) => {
	// Make sure that unique fields are not already taken
	const { email, username: newUsername } = updatedUserInfo;
	const existingUser = await User.findOne({ $or: [{ email }, { username: newUsername }] });
	if (existingUser) {
		if (existingUser.email === email) {
			throw new Error("Email already taken");
		} else if (existingUser.username === newUsername) {
			throw new Error("Username already taken");
		}
	}

	// Find the user by username
	const user = await User.findOne({ username });
	if (!user) {
		throw new Error("User not found");
	}

	// Update user fields
  Object.keys(updatedUserInfo).forEach(field => {
		user[field] = updatedUserInfo[field];
	});
	
	// Save the user to trigger pre-save middleware
	return await user.save();
};

const getUserByRefreshToken = async (refreshToken: string) => {
	const decoded = jwt.verify(refreshToken, process.env.AUTH_REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
	const user = await User.findById(decoded.id);
	return user;
};

export default {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  getAllUsers,
	deleteUserById,
	updateUser,
	getUserByRefreshToken,
};

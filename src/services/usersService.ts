import User, { IUser } from '../models/User';

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

export default {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  getAllUsers,
	deleteUserById,
	updateUser,
};

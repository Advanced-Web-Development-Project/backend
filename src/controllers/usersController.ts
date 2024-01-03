import userService from '../services/usersService';
import HttpResponse from '../utils/httpResponse';
import { Request, Response } from 'express';
import { updateUserSchema, validateSchema } from '../utils/validators';


const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await userService.getAllUsers();
		const response = new HttpResponse().withStatusCode(200).withData(users).build();
		return res.status(200).json(response);
	} catch (error) {
		const response = new HttpResponse().withStatusCode(500).withMessage("Internal server error").build();
		return res.status(500).json(response);
	}
};

const getUserByUsername = async (req: Request, res: Response) => {
	try {
		const user = await userService.getUserByUsername(req.params.username);
		if (!user) {
			const response = new HttpResponse().withStatusCode(404).withMessage("User not found").build();
			return res.status(404).json(response);
		}
		const response = new HttpResponse().withStatusCode(200).withData(user.toJSON).build();
		return res.status(200).json(response);
	} catch (error) {
		const response = new HttpResponse().withStatusCode(500).withMessage("Internal server error").build();
		return res.status(500).json(response);
	}
};

const updateUser = async (req: Request, res: Response) => {
	// Make sure that the user requesting the update is the same user that is being updated
	if (req.user.username !== req.params.username) {
		const response = new HttpResponse().withStatusCode(403).withMessage("You are not authorized to update this user").build();
		return res.status(403).json(response);
	}
	const updatedUserInfo = req.body;
	const errorMessages = validateSchema(updateUserSchema, updatedUserInfo);
	if (errorMessages) {
		const response = new HttpResponse().withStatusCode(400).addError(errorMessages).build();
		return res.status(400).json(response);
	}

	if (req.file) {
		updatedUserInfo.avatar = req.file.path;
	}

	try {
		const user = await userService.updateUser(req.params.username, updatedUserInfo);
		const response = new HttpResponse().withStatusCode(200).withMessage("User has been updated successfully").withData(user.toJSON).build();
		return res.status(200).json(response);
	} catch (error) {
		const response = new HttpResponse().withStatusCode(400).addError(error.message).build();
		return res.status(400).json(response);
	}

};

const deleteUser = async (req: Request, res: Response) => {
	// A user can only delete their own account
	if (req.user._id.toString() !== req.params.id) {
		const response = new HttpResponse().withStatusCode(403).withMessage("You are not authorized to delete this user").build();
		return res.status(403).json(response);
	}
	try {
		await userService.deleteUserById(req.params.id);
		const response = new HttpResponse().withStatusCode(200).withMessage("User has been deleted").build();
		return res.status(200).json(response);
	} catch (error) {
		const response = new HttpResponse().withStatusCode(404).withMessage("User not found").build();
		return res.status(404).json(response);
	}
};

export default {
	getAllUsers,
  getUserByUsername,
  updateUser,
  deleteUser,
};

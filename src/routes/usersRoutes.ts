import { Router } from 'express';
import userController from '../controllers/usersController';
import requireJwtAuth from '../middlewares/requireJwtAuth';
import upload from '../utils/multer/imageUpload';
import multerErrorHandler from '../utils/multer/errorHandler';

const router = Router();


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Internal Server Error
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: Retrieve a user by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user to retrieve
 *     responses:
 *       200:
 *         description: A user object
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:username', userController.getUserByUsername);

/**
 * @swagger
 * /users/{username}:
 *   patch:
 *     summary: Update a user's information
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               avatar:
 *                 type: image file
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad Request
 *       403:
 *         description: Forbidden - not authorized to update this user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:username', requireJwtAuth, [upload.single("avatar"), multerErrorHandler], userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Bad Request
 *       403:
 *         description: Forbidden - not authorized to delete this user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', requireJwtAuth, userController.deleteUser);



export default router;
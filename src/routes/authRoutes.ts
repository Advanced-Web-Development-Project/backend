import { Router } from 'express';
import authenticateRequest from '../middlewares/requireLocalAuth';
import authController from '../controllers/authController';
import passport from 'passport';

const router = Router();

/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         email: "bob@gmail.com"
 *         password: "123456"
 *     
 *     RegisterUser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - username
 *         - name
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         username:
 *           type: string
 *         name:
 *           type: string
 *       example:
 *         email: "bob@gmail.com"
 *         password: "123456"
 *         username: "bob"
 *         name: "Bob"
 * 
 *     Tokens:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *       example:
 *         accessToken: "0GEJgVqhpsesgyEQwiKSOAVzfN3AqdsC"
 *         refreshToken: "RnREB0f3f2pU3sQA9oWdbkfhETofE2m5"
 */



/**
* @swagger
* /auth/login:
*   post:
*     summary: Login to the application
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: Successful login
*       401:
*         description: Unauthorized
*       500:
*         description: Internal Server Error
*/
router.post('/login', authenticateRequest, authController.login);


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register to the application
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: Successful registration
 *       400:
 *         description: Bad Request
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal Server Error
 */
router.post('/register', authController.register);


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout from the application
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful logout
 *       500:
 *         description: Internal Server Error
 */
router.post('/logout', authController.logout);


/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Authenticate using Google OAuth
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google's OAuth 2.0 server
 *       500:
 *         description: Internal Server Error
 */
router.get('/google', passport.authenticate('google', { 
	scope: ['profile', 'email'] })
);


/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback endpoint
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful authentication with Google
 *       401:
 *         description: Unauthorized - Failed to authenticate with Google
 *       500:
 *         description: Internal Server Error
 */
router.get('/google/callback', passport.authenticate('google', { 
	failureRedirect: '/', session: false,}),
  authController.login
); 

export default router;

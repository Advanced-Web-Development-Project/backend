import { Router } from 'express';
import postController from '../controllers/postsController';
import requireJwtAuth from '../middlewares/requireJwtAuth';
import requirePostExists from '../middlewares/requirePostExists';
import commentRoutes from './commentsRoutes';
import upload from '../utils/multer/imageUpload';
import multerErrorHandler from '../utils/multer/errorHandler';

const router = Router();

/**
* @swagger
* tags:
*   name: Posts
*   description: The Posts API
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         image:
 *           type: string
 *           format: binary
 *       example:
 *         title: "Lorem Ipsum"
 *         content: "lorem ipsum dolor sit amet consectetur adipisicing elit"
 */

/**
* @swagger
* /posts/:
*   post:
*     summary: Create a new post
*     tags: [Posts]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             $ref: '#/components/schemas/Post'
*     responses:
*       201:
*         description: Post created successfully
*       400:
*         description: Bad Request
*       500:
*         description: Internal Server Error
*/
router.post('/', requireJwtAuth, [upload.single("image"), multerErrorHandler], postController.createPost);

/**
* @swagger
* /posts/:
*   get:
*     summary: Get all posts
*     tags: [Posts]
*     responses:
*       200:
*         description: Successfully fetched all posts
*       500:
*         description: Internal Server Error
*/
router.get('/', postController.getAllPosts);

/**
* @swagger
* /posts/{postId}:
*   get:
*     summary: Get a single post
*     tags: [Posts]
*     parameters:
*       - in: path
*         name: postId
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Post fetched successfully
*       404:
*         description: Post not found
*       500:
*         description: Internal Server Error
*/
router.get('/:postId', postController.getPost);

/**
* @swagger
* /posts/{postId}:
*   put:
*     summary: Update a post
*     tags: [Posts]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: postId
*         required: true
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             $ref: '#/components/schemas/Post'
*     responses:
*       200:
*         description: Post updated successfully
*       400:
*         description: Bad Request
*       404:
*         description: Post not found
*       500:
*         description: Internal Server Error
*/
router.put('/:postId', requireJwtAuth, postController.updatePost);

/**
* @swagger
* /posts/{postId}:
*   delete:
*     summary: Delete a post
*     tags: [Posts]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: postId
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Post deleted successfully
*       400:
*         description: Bad Request
*       404:
*         description: Post not found
*       500:
*         description: Internal Server Error
*/
router.delete('/:postId', requireJwtAuth, postController.deletePost);

/**
* @swagger
* /posts/{postId}/like:
*   patch:
*     summary: Like a post
*     tags: [Posts]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: postId
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Post liked successfully
*       404:
*         description: Post not found
*       500:
*         description: Internal Server Error
*/
router.patch('/:postId/like', requireJwtAuth, postController.likePost);

/**
* @swagger
* /posts/{postId}/dislike:
*   patch:
*     summary: Dislike a post
*     tags: [Posts]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: postId
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Post disliked successfully
*       404:
*         description: Post not found
*       500:
*         description: Internal Server Error
*/
router.patch('/:postId/dislike', requireJwtAuth, postController.dislikePost);


router.use('/:postId/comments', requirePostExists, commentRoutes);


export default router;

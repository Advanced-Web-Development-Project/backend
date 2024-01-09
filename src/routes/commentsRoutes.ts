import { Router } from 'express';
import commentController from '../controllers/commentsController';
import requireJwtAuth from '../middlewares/requireJwtAuth';

const router = Router({ mergeParams: true }); // mergeParams: true allows us to access the postId param from the parent router

/**
* @swagger
* tags:
*   name: Comments
*   description: The Comments API
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *       example:
 *         content: "lorem ipsum dolor sit amet consectetur adipisicing elit"
 */

/**
* @swagger
* /posts/{postId}/comments:
*   post:
*     summary: Create a comment on a post
*     tags: [Comments]
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
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Comment'
*     responses:
*       201:
*         description: Comment created successfully
*       400:
*         description: Bad Request
*       500:
*         description: Internal Server Error
*/
router.post('/', requireJwtAuth, commentController.createComment);

/**
* @swagger
* /posts/{postId}/comments:
*   get:
*     summary: Get all comments on a post
*     tags: [Comments]
*     parameters:
*       - in: path
*         name: postId
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Comments fetched successfully
*       500:
*         description: Internal Server Error
*/
router.get('/', commentController.getComments);

/**
* @swagger
* /posts/{postId}/comments/{commentId}:
*   patch:
*     summary: Update a comment on a post
*     tags: [Comments]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: postId
*         required: true
*         schema:
*           type: string
*       - in: path
*         name: commentId
*         required: true
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: Comment updated successfully
*       400:
*         description: Bad Request
*       403:
*         description: Forbidden
*       404:
*         description: Comment not found
*       500:
*         description: Internal Server Error
*/
router.patch('/:commentId', requireJwtAuth, commentController.updateComment);

/**
* @swagger
* /posts/{postId}/comments/{commentId}:
*   delete:
*     summary: Delete a comment from a post
*     tags: [Comments]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: postId
*         required: true
*         schema:
*           type: string
*       - in: path
*         name: commentId
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Comment deleted successfully
*       403:
*         description: Forbidden
*       404:
*         description: Comment not found
*       500:
*         description: Internal Server Error
*/
router.delete('/:commentId', requireJwtAuth, commentController.deleteComment);


export default router;
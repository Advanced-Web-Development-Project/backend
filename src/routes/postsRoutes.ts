import { Router } from 'express';
import postController from '../controllers/postsController';
import requireJwtAuth from '../middlewares/requireJwtAuth';

const router = Router();

// Get all posts
router.get('/', postController.getAllPosts);

// Get a single post by postID (example http://localhost:8000/posts/1234567890)
router.get('/:postId', postController.getPost);

// Create a new post
router.post('/', requireJwtAuth, postController.createPost);

// Update a post by postID
// Can also use put. Put replaces the entire object, patch only updates the fields you send
router.put('/:postId', requireJwtAuth, postController.updatePost);

// Delete a post by postID
router.delete('/:postId', requireJwtAuth, postController.deletePost);

// Update post specific fields by postId
router.patch('/:postId', postController.updatePostFields);

// // Upvote a post, each user can only upvote once, if already downvoted, remove downvote
// router.patch('/:postId/upvote', postController.updatePostFields);

// // Downvote a post, each user can only downvote once, if already upvoted, remove upvote
// router.patch('/:postId/downvote',);


export default router;

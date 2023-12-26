const { Router } = require('express');
const postController = require('../controllers/postsController');
const requireJwtAuth = require('../middlewares/requireJwtAuth');

const router = Router();

// Get all posts
router.get('/', postController.getAllPosts);

// Get a single post by postID (example http://localhost:8000/posts/1234567890)
router.get('/:postId', );

// Create a new post
router.post('/', );

// Update a post by postID
// Can also use put. Put replaces the entire object, patch only updates the fields you send
router.patch('/:postId', );

// Delete a post by postID
router.delete('/:postId', );

// Upvote a post, each user can only upvote once, if already downvoted, remove downvote
router.post('/:postId/upvote', );

// Downvote a post, each user can only downvote once, if already upvoted, remove upvote
router.post('/:postId/downvote', );


module.exports = router;

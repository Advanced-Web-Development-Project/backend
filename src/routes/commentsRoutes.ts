import { Router } from 'express';
import commentController from '../controllers/commentsController';
import requireJwtAuth from '../middlewares/requireJwtAuth';

const router = Router({ mergeParams: true }); // mergeParams: true allows us to access the postId param from the parent router


// create - create comment on a post
router.post('/', requireJwtAuth, commentController.createComment);

// read - get all comments on a post
router.get('/', commentController.getComments);

// // update - update a comment on a post
// router.put('/:commentId', requireJwtAuth, commentController.updateComment);

// // delete - delete a comment from a post
// router.delete('/:commentId', requireJwtAuth, commentController.deleteComment);


export default router;
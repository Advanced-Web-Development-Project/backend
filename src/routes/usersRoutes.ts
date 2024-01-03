import { Router } from 'express';
import userController from '../controllers/usersController';
import requireJwtAuth from '../middlewares/requireJwtAuth';
import upload from '../utils/multer/imageUpload';
import multerErrorHandler from '../utils/multer/errorHandler';

const router = Router();


// read
router.get('/', userController.getAllUsers);
router.get('/:username', userController.getUserByUsername);

// update - middlewares are for uploading files
router.patch('/:username', requireJwtAuth, [upload.single("avatar"), multerErrorHandler], userController.updateUser);

// delete 
router.delete('/:id', requireJwtAuth, userController.deleteUser);



export default router;
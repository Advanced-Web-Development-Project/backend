import { Router } from 'express';
import authenticateRequest from '../middlewares/requireLocalAuth';
import authController from '../controllers/authController';
import passport from 'passport';

const router = Router();

// local auth routes
router.post('/login', authenticateRequest, authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

// google auth routes
router.get('/google', passport.authenticate('google', { 
	scope: ['profile', 'email'] })
);

router.get('/google/callback', passport.authenticate('google', { 
	failureRedirect: '/', session: false,}),
  authController.login
); 

export default router;

const { Router } = require('express');
const authenticateRequest = require('../middlewares/requireLocalAuth');
const authController = require('../controllers/authController');
const passport = require('passport');

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

module.exports = router;

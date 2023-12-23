const { Router } = require('express');
const requireLocalAuth = require('../middleware/requireLocalAuth');
const authController = require('../controllers/authController');
const passport = require('passport');

const router = Router();

// local auth routes
router.post('/login', requireLocalAuth, authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

// google auth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    const token = req.user.generateJWT();
		const userInfo = req.user.toJSON();
    res.cookie('x-auth-cookie', token); // Set cookie so that the frontend can save the token in local storage.
		res.json({ token, userInfo });
		console.log('Google auth successful');
  }
);

module.exports = router;

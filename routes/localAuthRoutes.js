const { Router } = require('express');
const requireLocalAuth = require('../middleware/requireLocalAuth');
const authController = require('../controllers/authController');

const router = Router();

router.post('/login', requireLocalAuth, authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

module.exports = router;

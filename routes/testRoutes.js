const { Router } = require('express');
const router = Router();
const requireJwtAuth = require('../middleware/requireJwtAuth');

router.get('/protected', requireJwtAuth, (req, res) => {
	res.send(`Hello, ${req.user.name}`);
});

module.exports = router;
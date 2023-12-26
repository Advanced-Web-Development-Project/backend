const { Router } = require('express');
const router = Router();
const requireJwtAuth = require('../middlewares/requireJwtAuth');

router.get('/protected', requireJwtAuth, (req, res) => {
  res.send(`Hello, ${req.user.name}`);
});

module.exports = router;

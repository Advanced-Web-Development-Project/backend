const { Router } = require('express');
const localAuthRoutes = require ('./localAuth');
const router = Router();

router.use('/auth', localAuthRoutes);

// fallback 404
router.use('/api', (req, res) =>
  res.status(404).json('No route for this path')
);

module.exports = router;

/*
routes:
POST /auth/login
POST /auth/register
GET /auth/logout

*/

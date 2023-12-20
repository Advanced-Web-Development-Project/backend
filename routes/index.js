const { Router } = require('express');
const localAuthRoutes = require ('./localAuthRoutes');
const router = Router();

router.use('/auth', localAuthRoutes);

module.exports = router;

/*
routes:
POST /auth/login
POST /auth/register
GET /auth/logout

*/

const { Router } = require('express');
const authRoutes = require ('./authRoutes');
const router = Router();

router.use('/auth', authRoutes);

module.exports = router;

/*
routes:
POST /auth/login
POST /auth/register
GET /auth/logout

*/

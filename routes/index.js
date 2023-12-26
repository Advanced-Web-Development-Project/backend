const { Router } = require('express');
const authRoutes = require ('./authRoutes');
const postRoutes = require ('./postsRoutes');
const testRoutes = require ('./testsRoutes');
const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);

router.use('/test', testRoutes);

module.exports = router;

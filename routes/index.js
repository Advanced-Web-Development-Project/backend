const { Router } = require('express');
const authRoutes = require ('./authRoutes');
const testRoutes = require ('./testRoutes');
const router = Router();

router.use('/auth', authRoutes);
router.use('/test', testRoutes);

module.exports = router;

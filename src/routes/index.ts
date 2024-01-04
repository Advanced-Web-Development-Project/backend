import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './usersRoutes';
import postRoutes from './postsRoutes';
import testRoutes from './testsRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/test', testRoutes);

export default router;

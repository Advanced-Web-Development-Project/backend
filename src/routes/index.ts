import { Router } from 'express';
import authRoutes from './authRoutes';
import postRoutes from './postsRoutes';
import userRoutes from './usersRoutes';
import testRoutes from './testsRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/test', testRoutes);

export default router;

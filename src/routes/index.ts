import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './usersRoutes';
import postRoutes from './postsRoutes';

const router = Router();

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);

export default router;

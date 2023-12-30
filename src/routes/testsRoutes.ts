// import { Router, Request, Response } from 'express';
// import requireJwtAuth from '../middlewares/requireJwtAuth';
// import upload from '../utils/multer/imageUpload';
// import multerErrorHandler from '../utils/multer/errorHandler';

// const router = Router();

// router.get('/protected', requireJwtAuth, (req: Request, res: Response) => {
//   res.send(`Hello, ${req.user.name}`);
// });


// router.post('/upload', upload.single('file'), multerErrorHandler, (req, res) => {
//     if (!req.file) {
//         return res.status(400).send({error: 'no file uploaded'});
//     }
//     return res.json(req.file);
// });

// export default router;

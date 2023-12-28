const { Router } = require('express');
const router = Router();
const requireJwtAuth = require('../middlewares/requireJwtAuth');
const upload = require('../utils/multer/imageUpload');
const multerErrorHandler = require('../utils/multer/errorHandler');

router.get('/protected', requireJwtAuth, (req, res) => {
  res.send(`Hello, ${req.user.name}`);
});


router.post('/upload', upload.single(), multerErrorHandler, (req, res) => {
    if (!req.file) {
        return res.status(400).send({error: 'no file uploaded'});
    }
    return res.json(req.file);
});

module.exports = router;

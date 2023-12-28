const { Router } = require('express');
const router = Router();
const requireJwtAuth = require('../middlewares/requireJwtAuth');
const upload = require('../middlewares/imageUpload');
const upload = require('../utils/imageUpload');


router.get('/protected', requireJwtAuth, (req, res) => {
  res.send(`Hello, ${req.user.name}`);
});


router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({error: 'no file uploaded'});
    }
    return res.json(req.file);
});

module.exports = router;

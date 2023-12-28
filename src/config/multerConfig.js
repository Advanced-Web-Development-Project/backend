const multer = require('multer');
const { resolve } = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resolve(__dirname, '../../public/images'));
  },
  filename: function (req, file, cb) {
    const fileExt = file.originalname.split('.').pop();
    const baseName = file.originalname
      .split('.')
      .slice(0, -1)
      .join('.')
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .toLowerCase();
    const fileName = `${Date.now()}-${baseName}.${fileExt}`;
    cb(null, fileName);
  },
});

const imageFilter = (req, file, cb) => {
  if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});

module.exports = upload;

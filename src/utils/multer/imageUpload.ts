import multer from 'multer';
// import { resolve } from 'path';

// Define the storage for multer. This determines how the uploaded files are stored.
// In this case, the files are stored on disk in the 'public/images' directory.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
		// absolute path, we might use for production
    // cb(null, resolve(__dirname, '../../../public/images')); 
		cb(null, 'public/images'); // relative path, we use for development
  },
  filename: function (req, file, cb) {
    // Split the original file name by '.' to get the file extension.
    const fileExt = file.originalname.split('.').pop();
    // Get the base name of the file, remove any non-alphanumeric characters, and convert to lower case.
    const baseName = file.originalname
      .split('.')
      .slice(0, -1)
      .join('.')
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .toLowerCase();
    // Create a new file name using the current timestamp and the cleaned base name.
    const fileName = `${baseName}-${Date.now()}.${fileExt}`;
    cb(null, fileName);
  },
});

// Define a filter for the multer instance. This filter determines which files are accepted.
// In this case, only files with a mimetype of 'image/png', 'image/jpg', or 'image/jpeg' are accepted.
const imageFilter = (req, file: Express.Multer.File, cb) => {
  if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
};

// Define the multer instance. 
// This is the middleware that will be used to handle the file upload.
// We give it the storage and the fileFilter we defined above, and limit the file size to 5MB.
const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});

export default upload;

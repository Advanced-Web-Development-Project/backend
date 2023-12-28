const multer = require('multer');

function errorHandler(err, req, res, next) {
	if (err instanceof multer.MulterError) {
			// Handle Multer-specific errors (e.g., file size limit)
			res.status(500).json({ error: err.message });
	} else if (err) {
			// Handle custom errors from your imageFilter (e.g., wrong file type)
			res.status(400).json({ error: err.message });
	} else {
			// No errors, pass control to the next middleware
			next();
	}
}

module.exports = errorHandler;

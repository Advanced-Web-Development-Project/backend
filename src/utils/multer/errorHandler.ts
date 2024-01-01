import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
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

export default errorHandler;

import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import HttpResponse from '../httpResponse';

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
	if (err instanceof multer.MulterError) {
			// Handle Multer-specific errors (e.g., file size limit)
			const response = new HttpResponse().withStatusCode(400).addError(err.message).build();
			res.status(500).json(response);
	} else if (err) {
		// Handle custom errors from imageFilter (e.g., wrong file type)
		const response = new HttpResponse().withStatusCode(400).addError(err.message).build();
		res.status(400).json(response);
	} else {
			// No errors, pass control to the next middleware
			next();
	}
}

export default errorHandler;

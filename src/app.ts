import { join } from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import routes from './routes/index';
import cron from 'node-cron';
import newsGenerator from './utils/newsGenerator';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
dotenv.config();

// We need to export the createApp function for testing purposes
const createApp = (): Express => {
  const app = express();

  // middlewares
  app.use(express.static('public'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  // passport initialization
  app.use(passport.initialize());
  require('./config/localStrategy');
  require('./config/jwtStrategy');
  require('./config/googleStrategy');

  // routes
  app.use('/', routes);
  app.use(
    '/public/images',
    express.static(join(__dirname, '../public/images'))
  );

  return app;
};

const startServer = () => {
  const app = createApp();

  // swagger documentation setup
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // database connection
  const dbURI = process.env.MONGODB_URI;
  mongoose
    .connect(dbURI)
    .then(() => app.listen(`${process.env.PORT}`))
    .then(() => console.log(`Server running on port ${process.env.PORT}`))
    .catch((err) => console.log(err));

  if (process.env.NODE_ENV === 'production') {
    console.log('PRODUCTION');

    const options = {
      key: fs.readFileSync('../client-key.pem'),
			cert: fs.readFileSync('../client-cert.pem'),
    };
		https.createServer(options, app).listen(443);
  }
};

// Export the createApp function for testing purposes
export { createApp, startServer };

// If this script is run directly, start the server
if (require.main === module) {
  startServer();

  // Schedule the task for every minute for testing
  // cron.schedule('*/1 * * * *', () => {
  //   console.log('Running the news refresh task...');
  //   newsGenerator.run();
  // });

  // Schedule the task for every 12 hours for production
  cron.schedule('0 */12 * * *', () => {
    console.log('Running the news refresh task...');
    newsGenerator.run();
  });
}

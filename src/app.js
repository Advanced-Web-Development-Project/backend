require('dotenv').config();
const { join } = require('path');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const passport = require('passport');
const cors = require('cors');

// We need to export the createApp function for testing purposes
const createApp = () => {
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
  app.use('/public/images', express.static(join(__dirname, '../public/images')));

  return app;
};


const startServer = () => {
  const app = createApp();

  // database connection
  const dbURI = process.env.MONGODB_URI;
  mongoose
    .connect(dbURI)
    .then(() => app.listen(8000))
    .catch((err) => console.log(err));
};

// Export the createApp function for testing purposes
module.exports = { createApp, startServer };

// If this script is run directly, start the server
if (require.main === module) {
  startServer();
}

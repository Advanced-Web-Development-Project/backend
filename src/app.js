require('dotenv').config();
const { join } = require('path');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const passport = require('passport');
const cors = require('cors');

const app = express();

// middlewares
app.use(express.static('public')); // static files on the server
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

// database connection
const dbURI = process.env.MONGODB_URI;
mongoose
  .connect(dbURI)
  .then(() => app.listen(8000)) // listen only after connection is successful
  .catch((err) => console.log(err));

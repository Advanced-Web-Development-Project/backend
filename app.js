require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const passport = require('passport');

const app = express();

// middleware
app.use(express.static('public')); // static files on the server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
require('./config/localStrategy');
require('./config/jwtStrategy');

// database connection
const dbURI = process.env.MONGODB_URI;
mongoose
  .connect(dbURI)
  .then(() => app.listen(3000)) // listen only after connection is successful
  .catch((err) => console.log(err));

// routes
app.use('/', routes);

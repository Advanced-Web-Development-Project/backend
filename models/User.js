const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');

const userSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Minimum password length is 6 characters'],
    },
    username: {
      type: String,
      unique: true,
      required: [true, 'Please enter a username'],
      trim: true,
      minlength: [4, 'Minimum username length is 4 characters'],
      maxlength: [20, 'Maximum username length is 20 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username is invalid'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  // The timestamps are stored in UTC in the database, but we want to display them in the user's local timezone
  userObject.createdAt = moment(this.createdAt).tz('Europe/Helsinki').format();
  userObject.updatedAt = moment(this.updatedAt).tz('Europe/Helsinki').format();

  return {
    id: userObject._id,
    provider: userObject.provider,
    email: userObject.email,
    username: userObject.username,
    name: userObject.name,
    createdAt: userObject.createdAt,
    updatedAt: userObject.updatedAt,
  };
};

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      expiresIn: '12h',
      id: this._id,
      provider: this.provider,
      email: this.email,
    },
    process.env.AUTH_ACCESS_TOKEN_SECRET
  );
  return token;
};

// OLD CODE INSTEAD OF "REGISTER USER"
// use a function before doc saved to db
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

const User = mongoose.model('user', userSchema);

module.exports = User;

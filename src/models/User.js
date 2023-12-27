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
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [isEmail, 'Email is invalid'],
    },
    password: {
      type: String,
      minlength: [6, 'Minimum password length is 6 characters'],
    },
    username: {
      type: String,
      unique: true,
      required: [true, 'Username is required'],
      trim: true,
      match: [/^[a-zA-Z0-9_]+$/, 'Username is invalid'],
    },
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);



userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  // The timestamps are stored in UTC in the database, but we want to display them in the user's local timezone
  userObject.createdAt = moment(this.createdAt).tz('Asia/Jerusalem').format();
  userObject.updatedAt = moment(this.updatedAt).tz('Asia/Jerusalem').format();

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
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password'))
    return next();

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

const User = mongoose.model('User', userSchema);

module.exports = User;

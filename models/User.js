const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
  return {
    id: this._id,
    provider: this.provider,
    email: this.email,
    username: this.username,
    name: this.name,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
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

const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
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
});

// use a function before doc saved to db
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }).select('+password');

  // Check if user exists. If not, return a generic error message.
  if (!user) {
    throw Error('Incorrect login credentials');
  }

  // Compare the provided password with the hashed password in the database.
  const auth = await bcrypt.compare(password, user.password);
  if (auth) {
    return user;
  }

  // If password is incorrect, again return a generic error message.
  throw Error('Incorrect login credentials');
};

const User = mongoose.model('user', userSchema);

module.exports = User;

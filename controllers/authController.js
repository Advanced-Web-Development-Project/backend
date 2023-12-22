const User = require('../models/User');
const { registerSchema } = require('../utils/validators');

const login = (req, res) => {
  const token = req.user.generateJWT(); // req.user is set by passport
  const userInfo = req.user.toJSON();
  res.json({ token, userInfo });
};

const register = async (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
		// acc is the accumulator, builds up the error messages object
    const errorMessages = error.details.reduce((acc, detail) => { 
      // Assuming 'detail.path' is an array with a single element - the field name
      acc[detail.path[0]] = detail.message.replace(/"/g, ''); // replace for better formatting of errors
      return acc;
    }, {}); // {} is the initial value of the accumulator
    return res.status(422).json({ errors: errorMessages }); // https://joi.dev/api/?v=17.9.1#validationerror
  }

  const { email, password, name, username } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(422)
        .json({ errors: { email: 'A user with this email already exists' } });
    }
    if (existingUsername) {
      return res
        .status(422)
        .json({ errors: { username: 'This username is already taken' } });
    }

    const newUser = await User.create({
      provider: 'email',
      email,
      password,
      username,
      name,
    });

    // Generate token so that the user can log in after they register
    const token = newUser.generateJWT();
    const userInfo = newUser.toJSON();
    res.json({ token, userInfo });
  } catch (err) {
    return next(err);
  }
};

const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.json({ message: 'Logged out successfully' });
};

module.exports = { login, register, logout };

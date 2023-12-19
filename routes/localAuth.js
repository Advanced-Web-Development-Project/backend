const { Router } = require('express');
const Joi = require('joi');

const User = require('../models/User');
const requireLocalAuth = require('../middleware/requireLocalAuth');
const { registerSchema } = require('../services/validators');

const router = Router();

router.post('/login', requireLocalAuth, (req, res) => {
  const token = req.user.generateJWT();
  const userInfo = req.user.toJSON();
  res.json({ token, userInfo });
});

router.post('/register', async (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
		const errorMessages = error.details.reduce((acc, detail) => {
      // Assuming 'detail.path' is an array with a single element - the field name
      acc[detail.path[0]] = detail.message.replace(/"/g, ''); // replace for better formatting of errors
      return acc;
    }, {});
    console.log(errorMessages);
    return res.status(422).json({ errors: errorMessages }); //https://joi.dev/api/?v=17.9.1#validationerror
  }

  const { email, password, name, username } = req.body;

  try {
    const existingUser = await User.findOne({ email });
		const existingUsername = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(422)
        .json({ error: 'A user with this email already exists' });
    }
		if (existingUsername) {
			return res
				.status(422)
				.json({ error: 'This username is already taken' });
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
});

// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.send(false);
});

module.exports = router;

const User = require('../models/User');
const { registerSchema } = require('../utils/validators');
const HttpResponse = require('../utils/httpResponse');

const login = (req, res) => {
  const token = req.user.generateJWT(); // req.user is set by passport
  const userInfo = req.user.toJSON();
  let response = new HttpResponse()
    .withStatusCode(200)
    .withMessage('Logged in successfully')
    .withData({ token, userInfo })
    .build();
  res.json(response);
};

const register = async (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => {
      return detail.message.replace(/"/g, ''); // replace for better formatting
    });

    let response = new HttpResponse()
      .withStatusCode(400)
      .addError(errorMessages)
      .build();

    return res.status(400).json(response);
  }

  const { email, password, name, username } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });
    if (existingUser) {
      let response = new HttpResponse()
        .withStatusCode(409)
        .addError('A user with this email already exists')
        .build();

      return res.status(409).json(response);
    }
    if (existingUsername) {
      let response = new HttpResponse()
        .withStatusCode(409)
        .addError('A user with this username already exists')
        .build();

      return res.status(409).json(response);
    }

    const newUser = await User.create({
      provider: 'email',
      email,
      password,
      username,
      name,
    });

    let response = new HttpResponse()
      .withStatusCode(201)
      .withMessage('User created successfully')
      .build();

    res.status(201).json(response);
  } catch (err) {
    return next(err);
  }
};

// TODO: Implement logout
const logout = (req, res, next) => {
  let response = new HttpResponse()
    .withStatusCode(200)
    .withMessage('Logged out successfully')
    .build();

  res.status(200).json(response);
};

module.exports = { login, register, logout };

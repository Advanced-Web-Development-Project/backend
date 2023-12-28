const passport = require('passport');
const PassportLocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');
const { loginSchema } = require('../utils/validators');

const passportLogin = new PassportLocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => {
        return detail.message.replace(/"/g, ''); // replace for better formatting
      });
      return done(null, false, errorMessages ); // https://joi.dev/api/?v=17.9.1#validationerror
    }

    try {
      const user = await User.findOne({ email: email.trim() });
      if (!user) {
        return done(null, false, 'This email is not registered');
      }

      user.comparePassword(password, function (err, isMatch) {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false, 'Incorrect password');
        }

        return done(null, user);
      });
    } catch (err) {
      return done(err);
    }
  }
);

passport.use(passportLogin);

const passport = require('passport');
const PassportLocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

const passportLogin = new PassportLocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
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

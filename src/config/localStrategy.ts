import passport from 'passport';
import { Strategy as PassportLocalStrategy } from 'passport-local';
import User from '../models/User';

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
        return done(null, false, 'email or password is incorrect');
      }

      user.comparePassword(password, function (err, isMatch) {
        if (err) 
					return done(err);
				
        if (!isMatch)
          return done(null, false, 'email or password is incorrect');

        return done(null, user);
      });
    } catch (err) {
      return done(err);
    }
  }
);

passport.use(passportLogin);

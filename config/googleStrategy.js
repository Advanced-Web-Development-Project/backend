const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const serverUrl = process.env.SERVER_URL_DEV;



const googleLogin = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${serverUrl}${process.env.GOOGLE_CALLBACK_URL}`,
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
		// console.log(profile);
    try {
			// try to find user by googleId
      const user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      }
    } catch (err) {
      console.log(err);
    }
		console.log("email" + profile.emails[0].value)
		// if here then no user found, create new user, then return it
    try {
      const newUser = await new User({
        provider: 'google',
        googleId: profile.id,
        username: `user${profile.id}`,
        email: profile.emails[0].value,
        name: profile.displayName,
      }).save();
      done(null, newUser);
    } catch (err) {
      console.log(err);
    }
  },
);

passport.use(googleLogin);

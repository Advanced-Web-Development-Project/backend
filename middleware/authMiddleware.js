const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is valid
  if (token) {
    jwt.verify(
      token,
      process.env.AUTH_ACCESS_TOKEN_SECRET,
      (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect('/login');
        } else {
          console.log('decodedtoken:' + decodedToken);
          next();
        }
      }
    );
  } else {
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
	console.log('hi');
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(
      token,
      process.env.AUTH_ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          next();
        } else {
          // console.log("token found");
          let user = await User.findById(decodedToken.id);
          next();
        }
      }
    );
  } else {
    next();
  }
};

module.exports = { requireAuth, checkUser };

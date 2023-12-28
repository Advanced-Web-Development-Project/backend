const passport = require('passport');
const HttpResponse = require('../utils/httpResponse');

// const requireLocalAuth = (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.status(422).send(info);
//     }
//     req.user = user;
//     next();
//   })(req, res, next);
// };

const requireLocalAuth = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      const response = new HttpResponse()
        .withStatusCode(500)
        .addError(err.message);
      return res.status(response.statusCode).send(response);
    }
    if (!user) {
      const response = new HttpResponse()
        .withStatusCode(422)
        .addError(info);
      return res.status(response.statusCode).send(response);
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = requireLocalAuth;

import passport from 'passport';
import HttpResponse from '../utils/httpResponse';
import { loginSchema, validateSchema } from '../utils/validators';

const validateAndAuthenticate = (req, res, next) => {
  const errorMessages = validateSchema(loginSchema, req.body);
  if (errorMessages) {
    const response = new HttpResponse()
      .withStatusCode(400)
      .addError(errorMessages)
      .build();
    return res.status(400).json(response);
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      const response = new HttpResponse()
        .withStatusCode(500)
        .addError(err.message)
        .build();
      return res.status(500).send(response);
    }
    if (!user) {
      const response = new HttpResponse()
        .withStatusCode(401)
        .addError(info)
        .build();
      return res.status(401).send(response);
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default validateAndAuthenticate;

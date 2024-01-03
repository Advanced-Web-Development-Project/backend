import { registerSchema, validateSchema } from '../utils/validators';
import HttpResponse from '../utils/httpResponse';
import { Request, Response, NextFunction } from 'express';
import userService from '../services/usersService';

const login = (req: Request, res: Response) => {
  const token = req.user.generateJWT(); // req.user is set by passport
  const userInfo = req.user.toJSON();
  const response = new HttpResponse()
    .withStatusCode(200)
    .withMessage('Logged in successfully')
    .withData({ token, userInfo })
    .build();
  res.json(response);
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  const errorMessages = validateSchema(registerSchema, req.body);
  if (errorMessages) {
    const response = new HttpResponse()
      .withStatusCode(400)
      .addError(errorMessages)
      .build();
    return res.status(400).json(response);
  }

  const { email, password, name, username } = req.body;

  try {
    const existingUser = await userService.getUserByEmail(email);
    const existingUsername = await userService.getUserByUsername(username);
    if (existingUser) {
      const response = new HttpResponse()
        .withStatusCode(409)
        .addError('A user with this email already exists')
        .build();

      return res.status(409).json(response);
    }
    if (existingUsername) {
      const response = new HttpResponse()
        .withStatusCode(409)
        .addError('A user with this username already exists')
        .build();

      return res.status(409).json(response);
    }

    await userService.createUser({
      provider: 'email',
      email: email,
      password: password,
      username: username,
      name: name,
    });

    const response = new HttpResponse()
      .withStatusCode(201)
      .withMessage('User created successfully')
      .build();

    res.status(201).json(response);
  } catch (err) {
    return next(err);
  }
};

// TODO: Implement logout
const logout = (req: Request, res: Response) => {
  const response = new HttpResponse()
    .withStatusCode(200)
    .withMessage('Logged out successfully')
    .build();

  res.status(200).json(response);
};

export default { login, register, logout };

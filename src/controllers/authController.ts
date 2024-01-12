import { registerSchema, validateSchema } from '../utils/validators';
import HttpResponse from '../utils/httpResponse';
import { Request, Response, NextFunction } from 'express';
import userService from '../services/usersService';


const login = (req: Request, res: Response) => {
  const accessToken = req.user.generateJWT(); // req.user is set by passport
	const refreshToken = req.user.generateRefreshToken();
  const userInfo = req.user.toJSON();
  const response = new HttpResponse()
    .withStatusCode(200)
    .withMessage('Logged in successfully')
    .withData({ accessToken, refreshToken, userInfo })
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

// TODO: implement logout
const logout = (req: Request, res: Response) => {
  const response = new HttpResponse()
    .withStatusCode(200)
    .withMessage('Logged out successfully')
    .build();

  res.status(200).json(response);
};

const refreshToken = async (req: Request, res: Response) => {
	// verify that the refresh token exists
	const refreshToken = req.body.refreshToken;
	if (!refreshToken) {
		const response = new HttpResponse()
			.withStatusCode(400)
			.addError('Refresh token is required')
			.build();
		return res.status(400).json(response);
	}
	
	// Make sure that the refresh token is valid, and that it's the most recent one
	const user = await userService.getUserByRefreshToken(refreshToken);
	if (!user || refreshToken !== user.refreshToken) {
		const response = new HttpResponse()
			.withStatusCode(401)
			.addError('Invalid refresh token')
			.build();
		return res.status(401).json(response);
	}

	// generate new tokens
	const accessToken = user.generateJWT();
	const newRefreshToken = user.generateRefreshToken();

	// return new tokens
	const response = new HttpResponse()
		.withStatusCode(200)
		.withMessage('Tokens refreshed successfully')
		.withData({ accessToken, refreshToken: newRefreshToken })
		.build();

	res.status(200).json(response);
};

export default { login, register, logout, refreshToken };

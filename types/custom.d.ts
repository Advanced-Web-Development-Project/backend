import { IUser, IUserMethods } from '../src/models/User';

type UserWithMethods = IUser & IUserMethods;

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserWithMethods;
  }
}

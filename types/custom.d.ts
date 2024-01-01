import { UserDocument } from '../src/models/User';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserDocument;
  }
}

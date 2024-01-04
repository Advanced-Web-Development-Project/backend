import { Request } from 'express';
import { IPost } from '../src/models/Post';

export interface RequestWithPost extends Request {
  post: IPost; 
}

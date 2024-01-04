import { model, Schema, Types } from 'mongoose';
import { IUser } from './User';

export interface IComment {
  _id?: Types.ObjectId;
  user: Types.ObjectId | IUser;
  post: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;

import { model, Schema, Types } from 'mongoose';
import { IComment } from './Comment';

export interface IPost {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  content: string;
  imagePath?: string; // Posts may not have an image, default image will be used
  likes: Types.Array<Types.ObjectId>;
  dislikes: Types.Array<Types.ObjectId>;
  comments: Types.Array<Types.ObjectId | IComment>;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
      default: 'images/default/default-post-image.png',
    },
    likes: {
      type: [Types.ObjectId],
      default: [],
    },
    dislikes: {
      type: [Types.ObjectId],
      default: [],
    },
    comments: {
      type: [Types.ObjectId],
      ref: 'Comment',
      default: [],
    },
  },
  {
    timestamps: true,
    autoIndex: false,
  }
);

const Post = model<IPost>('Post', postSchema);

export default Post;

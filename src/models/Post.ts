import { model, Schema, Types  } from 'mongoose';

export interface IPost {
	user: Types.ObjectId;
	title: string;
	content: string;
	imagePath?: string; // Posts may not have an image, default image will be used
	likes: Types.Array<string>;
	dislikes: Types.Array<string>;
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
      default: "public/images/default/default-post-image.png",
    },
    likes: {
      type: [String],
      default: [],
    },
    dislikes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true, autoIndex: false }
);

const Post = model<IPost>('Post', postSchema);

export default Post;

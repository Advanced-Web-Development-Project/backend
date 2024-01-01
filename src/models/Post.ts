import mongoose from 'mongoose';

export interface PostInput {
	title: string;
	content: string;
	imagePath?: string; // Posts may not have an image, default image will be used
}

export interface PostDocument extends PostInput, mongoose.Document {
	user: mongoose.Types.ObjectId;
	likes: string[];
	dislikes: string[];
	createdAt: Date;
	updatedAt: Date;
}

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
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

const Post = mongoose.model<PostDocument>('Post', postSchema);

export default Post;

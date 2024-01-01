import { Model, Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment-timezone';

export interface IUser {
  email: string;
  password?: string; // Only required for local strategy
  username: string;
  name: string;
	provider: string;
  googleId?: string; // Only required for google strategy
	createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  toJSON(): object;
  generateJWT(): string;
  comparePassword(candidatePassword: string, callback: (err: Error | null, isMatch?: boolean) => void): void;
}

type UserModel = Model<IUser, Record<string, never>, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Minimum password length is 6 characters'],
    },
    username: {
      type: String,
      unique: true,
      required: [true, 'Username is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
    },
    provider: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function (): object {
  // const userObject = this.toObject();

  // // The timestamps are stored in UTC in the database, but we want to display them in the user's local timezone
  // userObject.createdAt = moment(this.createdAt).tz('Asia/Jerusalem').format();
  // userObject.updatedAt = moment(this.updatedAt).tz('Asia/Jerusalem').format();

  return {
    id: this._id,
    provider: this.provider,
    email: this.email,
    username: this.username,
    name: this.name,
    createdAt: moment(this.createdAt).tz('Asia/Jerusalem').format(),
    updatedAt: moment(this.updatedAt).tz('Asia/Jerusalem').format(),
  };
};

userSchema.methods.generateJWT = function (): string {
  const token = jwt.sign(
    {
      expiresIn: '12h',
      id: this._id,
      provider: this.provider,
      email: this.email,
    },
    process.env.AUTH_ACCESS_TOKEN_SECRET
  );
  return token;
};

// use a function before doc saved to db
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.comparePassword = function (
	candidatePassword: string, 
	callback: (err: Error | null, isMatch?: boolean) => void
	) {
	const user = this as IUser;
  bcrypt.compare(candidatePassword, user.password, (err: Error, isMatch: boolean) => {
    if (err) 
			return callback(err);

    callback(null, isMatch);
  });
};


const User = model<IUser, UserModel>('User', userSchema);

export default User;

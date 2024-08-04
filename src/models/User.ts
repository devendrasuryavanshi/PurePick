import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  password?: string;
  authType: string;
  createdAt: Date;
}

const userSchema: Schema<IUser> = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  age: {
    type: Number,
    min: 0,
    max: 120,
  },
  password: {
    type: String,
    required: function() { return this.authType === 'Credentials'; },
  },
  authType: {
    type: String,
    required: true,
    enum: ['Google', 'Credentials']
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
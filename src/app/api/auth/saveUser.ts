import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectDB from '@/lib/dbConnect';

interface NewUser {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  age: number;
  authType: string;
}

export const saveNewUser = async ({ email, password, firstName, lastName, age, authType }: NewUser) => {

  await connectDB();

  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const newUser = new User({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    age,
    authType,
  });

  await newUser.save();

  return newUser;
};
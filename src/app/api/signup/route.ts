import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import { signIn } from "next-auth/react";

export async function POST(req: NextRequest) {
  try {
    const { firstname, lastname, age, email, password } = await req.json();

    if (!firstname || !lastname || !age || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName: firstname,
      lastName: lastname,
      age: parseInt(age),
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Sign in the user automatically
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      return NextResponse.json({ message: "User created, but failed to sign in", error: result.error }, { status: 500 });
    }

    return NextResponse.json({ message: "User created and signed in", user: newUser }, { status: 201 });

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

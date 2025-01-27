import connectDB from "@/lib/db-connect";
import User from "@/models/user-model";
import { userData } from "@/types/global.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User Id is required." }, { status: 400 });
        }

        await connectDB()
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        const userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            gender: user.gender,
            allergies: user.allergies,
            diseases: user.diseases,
        };

        return NextResponse.json(userData);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId, firstName, lastName, age, gender, allergies, diseases } = await req.json();

        await connectDB();
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                age,
                gender,
                allergies,
                diseases
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
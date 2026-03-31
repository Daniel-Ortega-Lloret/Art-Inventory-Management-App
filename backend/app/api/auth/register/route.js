import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { withCors, handleOptions } from "@/lib/cors";

export function OPTIONS() {
  return handleOptions();
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return withCors(
        NextResponse.json(
          { success: false, error: "Name, email, and password are required" },
          { status: 400 }
        )
      );
    }

    if (password.length < 6) {
      return withCors(
        NextResponse.json(
          { success: false, error: "Password must be at least 6 characters long" },
          { status: 400 }
        )
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return withCors(
        NextResponse.json(
          { success: false, error: "A user with that email already exists" },
          { status: 409 }
        )
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "staff"
    });

    const token = signToken(user);

    return withCors(
      NextResponse.json(
        {
          success: true,
          message: "User registered successfully",
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: "staff"
          }
        },
        { status: 201 }
      )
    );
  } catch (error) {
    return withCors(
      NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    );
  }
}
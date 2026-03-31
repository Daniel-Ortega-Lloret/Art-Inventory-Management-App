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
    const { email, password } = body;

    if (!email || !password) {
      return withCors(
        NextResponse.json(
          { success: false, error: "Email and password are required" },
          { status: 400 }
        )
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return withCors(
        NextResponse.json(
          { success: false, error: "Invalid credentials" },
          { status: 401 }
        )
      );
    }

    if (!user.isActive) {
      return withCors(
        NextResponse.json(
          { success: false, error: "This account has been disabled" },
          { status: 403 }
        )
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return withCors(
        NextResponse.json(
          { success: false, error: "Invalid credentials" },
          { status: 401 }
        )
      );
    }

    const token = signToken(user);

    return withCors(
      NextResponse.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: "staff"
        }
      })
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
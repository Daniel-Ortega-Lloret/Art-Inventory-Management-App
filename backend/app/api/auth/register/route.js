/**
 * This route handles staff user registration.
 * It validates the submitted details, checks for duplicate email addresses,
 * hashes the password, creates the user, and returns a JWT token
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { withCors, handleOptions } from "@/lib/cors";

// Handle browser preflight requests for CORS
export function OPTIONS() {
  return handleOptions();
}

// Register a new staff user
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

    // Require a basic minimum password length
    if (password.length < 6) {
      return withCors(
        NextResponse.json(
          { success: false, error: "Password must be at least 6 characters long" },
          { status: 400 }
        )
      );
    }

    // Prevent duplicate accounts with the same email address
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return withCors(
        NextResponse.json(
          { success: false, error: "A user with that email already exists" },
          { status: 409 }
        )
      );
    }

    // Hash the password before saving the user to MongoDB
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
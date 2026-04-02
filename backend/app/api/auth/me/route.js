/**
 * This route returns the currently authenticated user's details.
 * It reads the JWT token from the request, validates it,
 * and fetches the matching user from the database
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAuth } from "@/lib/auth";
import { withCors, handleOptions } from "@/lib/cors";

// Handle browser preflight requests for CORS
export function OPTIONS() {
  return handleOptions();
}

// Get the currently logged-in user's profile
export async function GET(request) {
  try {
    await connectDB();

    // Decode and validate the JWT token
    const decoded = requireAuth(request);

    // Exclude the password hash from the returned user object
    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user) {
      return withCors(
        NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        )
      );
    }

    return withCors(
      NextResponse.json({
        success: true,
        user: {
          ...user.toObject(),
          role: "staff"
        }
      })
    );
  } catch (error) {
    return withCors(
      NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      )
    );
  }
}
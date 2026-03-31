import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAuth } from "@/lib/auth";
import { withCors, handleOptions } from "@/lib/cors";

export function OPTIONS() {
  return handleOptions();
}

export async function GET(request) {
  try {
    await connectDB();

    const decoded = requireAuth(request);

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
        user
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
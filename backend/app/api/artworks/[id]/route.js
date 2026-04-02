/**
 * This route handles operations for a single artwork document.
 * It supports:
 * - GET: fetch one artwork by its MongoDB id
 * - PUT: update one artwork by id
 * - DELETE: remove one artwork by id
 * All routes require a valid authenticated user.
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import { requireAuth } from "@/lib/auth";
import { withCors, handleOptions } from "@/lib/cors";
import { errorResponse } from "@/lib/errors";

// Handle browser preflight requests for CORS
export function OPTIONS() {
  return handleOptions();
}

// Get a single artwork by id.
export async function GET(request, context) {
  try {
    // Ensure the user is logged in before allowing access
    requireAuth(request);
    await connectDB();

    // Dynamic route parameters in Next.js must be awaited
    const { id } = await context.params;
    const artwork = await Artwork.findById(id);

    if (!artwork) {
      return withCors(
        NextResponse.json(
          { success: false, error: "Artwork not found" },
          { status: 404 }
        )
      );
    }

    return withCors(
      NextResponse.json({
        success: true,
        data: artwork
      })
    );
  } catch (error) {
    return withCors(
      errorResponse(
        NextResponse,
        error,
        "Failed to get artwork",
        400
      )
    );
  }
}

// Update a single artwork by id
export async function PUT(request, context) {
  try {
    requireAuth(request);
    await connectDB();

    const { id } = await context.params;
    const body = await request.json();

    // Trim common string fields before saving
    const artwork = await Artwork.findByIdAndUpdate(
      id,
      {
        ...body,
        ...(body.title ? { title: body.title.trim() } : {}),
        ...(body.artist ? { artist: body.artist.trim() } : {})
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!artwork) {
      return withCors(
        NextResponse.json(
          { success: false, error: "Artwork not found" },
          { status: 404 }
        )
      );
    }

    return withCors(
      NextResponse.json({
        success: true,
        message: "Artwork updated successfully",
        data: artwork
      })
    );
  } catch (error) {
    return withCors(
      errorResponse(
        NextResponse,
        error,
        "Failed to update artwork",
        400
      )
    );
  }
}

// Delete a single artwork by id
export async function DELETE(request, context) {
  try {
    requireAuth(request);
    await connectDB();

    const { id } = await context.params;
    const artwork = await Artwork.findByIdAndDelete(id);

    if (!artwork) {
      return withCors(
        NextResponse.json(
          { success: false, error: "Artwork not found" },
          { status: 404 }
        )
      );
    }

    return withCors(
      NextResponse.json({
        success: true,
        message: "Artwork deleted successfully"
      })
    );
  } catch (error) {
    return withCors(
      errorResponse(
        NextResponse,
        error,
        "Failed to delete artwork",
        400
      )
    );
  }
}
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import { requireAuth } from "@/lib/auth";
import { withCors, handleOptions } from "@/lib/cors";

export function OPTIONS() {
  return handleOptions();
}

export async function GET(request, context) {
  try {
    requireAuth(request);
    await connectDB();

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

export async function PUT(request, context) {
  try {
    requireAuth(request);
    await connectDB();

    const { id } = await context.params;
    const body = await request.json();

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
      )
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
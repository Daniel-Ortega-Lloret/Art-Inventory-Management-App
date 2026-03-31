import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import { requireRole } from "@/lib/auth";
import { withCors, handleOptions } from "@/lib/cors";

export function OPTIONS() {
  return handleOptions();
}

export async function GET(request, { params }) {
  try {
    requireRole(request, ["admin", "staff"]);
    await connectDB();

    const artwork = await Artwork.findById(params.id);

    if (!artwork) {
      return withCors(
        NextResponse.json(
        { success: false, error: "Artwork not found" },
        { status: 404 }
      ));
    }

    return withCors(
        NextResponse.json({
      success: true,
      data: artwork
    }));
  } catch (error) {
    return withCors(
        NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    ));
  }
}

export async function PUT(request, { params }) {
  try {
    requireRole(request, ["admin", "staff"]);
    await connectDB();

    const body = await request.json();

    const artwork = await Artwork.findByIdAndUpdate(
      params.id,
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
      ));
    }

    return withCors(
        NextResponse.json({
      success: true,
      message: "Artwork updated successfully",
      data: artwork
    }));
  } catch (error) {
    return withCors(
        NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    ));
  }
}

export async function DELETE(request, { params }) {
  try {
    requireRole(request, ["admin"]);
    await connectDB();

    const artwork = await Artwork.findByIdAndDelete(params.id);

    if (!artwork) {
      return withCors(
        NextResponse.json(
        { success: false, error: "Artwork not found" },
        { status: 404 }
      ));
    }

    return withCors(
        NextResponse.json({
      success: true,
      message: "Artwork deleted successfully"
    }));
  } catch (error) {
    return withCors(
        NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes("permission") ? 403 : 400 }
    ));
  }
}
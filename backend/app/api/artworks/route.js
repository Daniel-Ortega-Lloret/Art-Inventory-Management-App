import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import { requireRole } from "@/lib/auth";
import { withCors, handleOptions } from "@/lib/cors";

export function OPTIONS() {
  return handleOptions();
}

export async function GET(request) {
  try {
    requireRole(request, ["admin", "staff"]);
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const search = searchParams.get("search") || "";
    const artist = searchParams.get("artist") || "";
    const classification = searchParams.get("classification") || "";
    const department = searchParams.get("department") || "";
    const sort = searchParams.get("sort") || "createdAt_desc";

    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { artist: { $regex: search, $options: "i" } },
        { medium: { $regex: search, $options: "i" } },
        { accessionNumber: { $regex: search, $options: "i" } }
      ];
    }

    if (artist) query.artist = { $regex: artist, $options: "i" };
    if (classification) query.classification = classification;
    if (department) query.department = department;

    let sortOption = { createdAt: -1 };

    if (sort === "title_asc") sortOption = { title: 1 };
    if (sort === "title_desc") sortOption = { title: -1 };
    if (sort === "artist_asc") sortOption = { artist: 1 };
    if (sort === "artist_desc") sortOption = { artist: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "quantity_asc") sortOption = { quantity: 1 };
    if (sort === "quantity_desc") sortOption = { quantity: -1 };
    if (sort === "createdAt_asc") sortOption = { createdAt: 1 };

    const artworks = await Artwork.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Artwork.countDocuments(query);

    return withCors(
      NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: artworks
    }));
  } catch (error) {
    return withCors(
      NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes("permission") || error.message.includes("token") ? 401 : 500 }
    ));
  }
}

export async function POST(request) {
  try {
    requireRole(request, ["admin", "staff"]);
    await connectDB();

    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return withCors(
        NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      ));
    }

    const artwork = await Artwork.create({
      ...body,
      title: body.title.trim(),
      artist: body.artist?.trim() || "Unknown"
    });

    return withCors(
      NextResponse.json(
      {
        success: true,
        message: "Artwork created successfully",
        data: artwork
      },
      { status: 201 }
    ));
  } catch (error) {
    return withCors(
      NextResponse.json(
      { success: false, error: error.message },
      { status: error.message.includes("permission") || error.message.includes("token") ? 401 : 400 }
    ));
  }
}
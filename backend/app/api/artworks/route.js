import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import { requireAuth } from "@/lib/auth";
import { withCors, handleOptions } from "@/lib/cors";
import { errorResponse } from "@/lib/errors";

export function OPTIONS() {
  return handleOptions();
}

const ALLOWED_SEARCH_FIELDS = [
  "title",
  "artist",
  "department"
];

const ALLOWED_SORT_FIELDS = [
  "title",
  "artist",
  "department",
  "classification"
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSortObject(sortParam) {
  if (!sortParam) {
    return { createdAt: -1 };
  }

  const sortObject = {};
  const parts = sortParam.split(",");

  for (const part of parts) {
    const [field, direction] = part.split(":");

    if (!ALLOWED_SORT_FIELDS.includes(field)) {
      continue;
    }

    if (direction === "asc") {
      sortObject[field] = 1;
    } else if (direction === "desc") {
      sortObject[field] = -1;
    }
  }

  if (Object.keys(sortObject).length === 0) {
    return { createdAt: -1 };
  }

  return sortObject;
}

export async function GET(request) {
  try {
    requireAuth(request);
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const searchField = searchParams.get("searchField") || "";
    const sort = searchParams.get("sort") || "";

    const skip = (page - 1) * limit;
    const query = {};

    if (search.trim()) {
      const safeSearch = escapeRegex(search.trim());

      if (searchField && ALLOWED_SEARCH_FIELDS.includes(searchField)) {
        query[searchField] = { $regex: `^${safeSearch}`, $options: "i" };
      } else {
        query.$or = ALLOWED_SEARCH_FIELDS.map((field) => ({
          [field]: { $regex: safeSearch, $options: "i" }
        }));
      }
    }

    const sortOption = buildSortObject(sort);

    const artworks = await Artwork.find(query)
      // Make sorting case-insensitive so 'a' does not get sorted above 'X'
      // Also make it order numerically for fields like date or dimensions
      .collation({ locale: "en", strength: 2, numericOrdering: true })
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
      })
    );
  } catch (error) {
    return withCors(
      errorResponse(
        NextResponse,
        error,
        "Failed to fetch artworks",
        error.message.includes("token") ? 401 : 500
      )
    );
  }
}

export async function POST(request) {
  try {
    requireAuth(request);
    await connectDB();

    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return withCors(
        NextResponse.json(
          { success: false, error: "Title is required" },
          { status: 400 }
        )
      );
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
      )
    );
  } catch (error) {
    return withCors(
      errorResponse(
        NextResponse,
        error,
        "Failed to create artwork",
        error.message.includes("token") ? 401 : 400
      )
    );
  }
}
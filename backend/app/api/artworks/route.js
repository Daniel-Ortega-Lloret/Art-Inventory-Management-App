/**
 * This route handles operations for the artwork collection
 * It supports:
 * - GET: fetch paginated artworks with optional search and multi-column sorting
 * - POST: create a new artwork document
 * All routes require a valid authenticated user
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

// These are the only fields that the search dropdown is allowed to query
const ALLOWED_SEARCH_FIELDS = [
  "title",
  "artist",
  "department"
];

// These are the fields that can be used in multi-column sorting
const ALLOWED_SORT_FIELDS = [
  "title",
  "artist",
  "department",
  "classification"
];

// Escape special characters so user input can be safely used in a regex search
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Convert a sort query string like "title:asc,artist:desc" into a Mongo sort object
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

  // Fall back to newest first if no valid sort fields were provided
  if (Object.keys(sortObject).length === 0) {
    return { createdAt: -1 };
  }

  return sortObject;
}

// Fetch a paginated list of artworks, optionally filtered by search and sort options
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

    // Build the Mongo query for either field-specific prefix search
    // or a broader search across the allowed fields
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
      // Make sorting case-insensitive so lowercase values do not sort oddly
      // numericOrdering also helps if values contain numbers inside strings
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

// Create a new artwork document
export async function POST(request) {
  try {
    requireAuth(request);
    await connectDB();

    const body = await request.json();

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
/**
 * Seed script for importing artwork data into MongoDB
 *
 * This script:
 * - Loads environment variables
 * - Connects to the MongoDB database
 * - Reads the Artworks.json dataset from disk
 * - Cleans and maps the raw dataset into the application schema
 * - Inserts all artworks into the database
 */

require("dotenv").config({ path: ".env.local" });

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const MONGODB_URI = process.env.MONGODB_URI;

// Ensure database connection string exists before running
if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in .env.local");
}

/**
 * Define a simplified Artwork schema for seeding
 * This mirrors the main Artwork model structure but is defined locally
 * to avoid dependency on ES module imports
 */
const artworkSchema = new mongoose.Schema(
  {
    sourceId: Number,
    title: String,
    artist: String,
    artistBio: String,
    nationality: String,
    beginDate: Number,
    endDate: Number,
    date: String,
    medium: String,
    dimensions: String,
    classification: String,
    department: String,
    dateAcquired: String,
    objectURL: String,
    imageURL: String,
    onView: String,
    heightCm: Number,
    widthCm: Number,
    creditLine: String,
    accessionNumber: String
  },
  { timestamps: true }
);

// Reuse model if it already exists
const Artwork =
  mongoose.models.Artwork || mongoose.model("Artwork", artworkSchema);

/**
 * Helper function to safely extract the first value from a field
 * Some dataset fields may be arrays instead of strings
 */
function firstValue(value, fallback = "") {
  if (Array.isArray(value)) {
    return value.length > 0 ? value[0] : fallback;
  }
  return value ?? fallback;
}

/**
 * Helper function to safely extract numeric values
 * Handles arrays, empty values, and invalid numbers
 */
function firstNumber(value, fallback = null) {
  const extracted = Array.isArray(value)
    ? value.length > 0
      ? value[0]
      : fallback
    : value;

  if (extracted === undefined || extracted === null || extracted === "") {
    return fallback;
  }

  const parsed = Number(extracted);
  return Number.isNaN(parsed) ? fallback : parsed;
}

/**
 * Map a raw dataset object into the application's Artwork format
 * This ensures:
 * - Consistent field names
 * - Cleaned values
 * - Defaults for missing data
 */
function mapArtwork(item) {
  return {
    sourceId: firstNumber(item.ObjectID, null),
    title: item.Title || "Untitled",
    artist: firstValue(item.Artist, "Unknown"),
    artistBio: firstValue(item.ArtistBio, ""),
    nationality: firstValue(item.Nationality, ""),
    beginDate: firstNumber(item.BeginDate, null),
    endDate: firstNumber(item.EndDate, null),
    date: item.Date || "",
    medium: item.Medium || "",
    dimensions: item.Dimensions || "",
    classification: item.Classification || "",
    department: item.Department || "",
    dateAcquired: item.DateAcquired || "",
    objectURL: item.URL || "",
    imageURL: item.ImageURL || "",
    onView: item.OnView || "",
    heightCm: firstNumber(item["Height (cm)"], null),
    widthCm: firstNumber(item["Width (cm)"], null),
    creditLine: item.CreditLine || "",
    accessionNumber: item.AccessionNumber || ""
  };
}

/**
 * Main seeding function
 * Connects to the database, reads the dataset, transforms it,
 * clears existing records, and inserts fresh data
 */
async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, { dbName: "artmuseum" });

    // Load dataset from file system
    const filePath = path.join(__dirname, "..", "data", "Artworks.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const artworks = JSON.parse(rawData);

    // Transform dataset into application format
    const mappedArtworks = artworks.map(mapArtwork);

    // Remove existing data to avoid duplicates
    await Artwork.deleteMany({});

    // Insert all mapped artworks into the database
    await Artwork.insertMany(mappedArtworks);

    console.log(`Seeded ${mappedArtworks.length} artworks successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

// Run the seed script
seed();
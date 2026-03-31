require("dotenv").config({ path: ".env.local" });

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in .env.local");
}

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

const Artwork =
  mongoose.models.Artwork || mongoose.model("Artwork", artworkSchema);

function firstValue(value, fallback = "") {
  if (Array.isArray(value)) {
    return value.length > 0 ? value[0] : fallback;
  }
  return value ?? fallback;
}

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

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: "artmuseum" });

    const filePath = path.join(__dirname, "..", "data", "Artworks.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const artworks = JSON.parse(rawData);

    const subset = artworks.slice(0, 1000).map(mapArtwork);

    await Artwork.deleteMany({});
    await Artwork.insertMany(subset);

    console.log(`Seeded ${subset.length} artworks successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
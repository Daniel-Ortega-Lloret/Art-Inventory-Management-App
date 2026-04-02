/**
 * Mongoose schema for artwork documents
 * Represents a single artwork in the inventory system
 * Includes validation rules to ensure data consistency
 */


import mongoose from "mongoose";

const ArtworkSchema = new mongoose.Schema(
  {
    sourceId: {
      type: Number,
      index: true
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
      maxlength: [200, "Title cannot exceed 200 characters"]
    },
    artist: {
      type: String,
      default: "Unknown",
      trim: true,
      maxlength: [120, "Artist name cannot exceed 120 characters"]
    },
    artistBio: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Artist bio cannot exceed 500 characters"]
    },
    nationality: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Nationality cannot exceed 100 characters"]
    },
    beginDate: {
      type: Number,
      default: null,
      min: [0, "Begin date is too low"],
      max: [2030, "Begin date is too high"]
    },
    endDate: {
      type: Number,
      default: null,
      min: [0, "End date is too low"],
      max: [2030, "End date is too high"]
    },
    date: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Date cannot exceed 100 characters"]
    },
    medium: {
      type: String,
      default: "",
      trim: true,
      maxlength: [200, "Medium cannot exceed 200 characters"]
    },
    dimensions: {
      type: String,
      default: "",
      trim: true,
      maxlength: [200, "Dimensions cannot exceed 200 characters"]
    },
    classification: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Classification cannot exceed 100 characters"]
    },
    department: {
      type: String,
      default: "",
      trim: true,
      maxlength: [150, "Department cannot exceed 150 characters"]
    },
    dateAcquired: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Date acquired cannot exceed 100 characters"]
    },
    objectURL: {
      type: String,
      default: "",
      trim: true
    },
    imageURL: {
      type: String,
      default: "",
      trim: true
    },
    onView: {
      type: String,
      default: "",
      trim: true,
      maxlength: [200, "On view cannot exceed 200 characters"]
    },
    heightCm: {
      type: Number,
      default: null,
      min: [0, "Height cannot be negative"]
    },
    widthCm: {
      type: Number,
      default: null,
      min: [0, "Width cannot be negative"]
    },
    creditLine: {
      type: String,
      default: "",
      trim: true,
      maxlength: [300, "Credit line cannot exceed 300 characters"]
    },
    accessionNumber: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Accession number cannot exceed 100 characters"]
    }
  },
  { timestamps: true }
);

export default mongoose.models.Artwork ||
  mongoose.model("Artwork", ArtworkSchema);
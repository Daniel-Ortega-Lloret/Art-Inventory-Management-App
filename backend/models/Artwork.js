import mongoose from "mongoose";

const ArtworkSchema = new mongoose.Schema(
  {
    sourceId: { type: Number, index: true },
    title: { type: String, required: true, trim: true },
    artist: { type: String, default: "Unknown" },
    artistBio: { type: String, default: "" },
    nationality: { type: String, default: "" },
    beginDate: { type: Number, default: null },
    endDate: { type: Number, default: null },
    date: { type: String, default: "" },
    medium: { type: String, default: "" },
    dimensions: { type: String, default: "" },
    classification: { type: String, default: "" },
    department: { type: String, default: "" },
    dateAcquired: { type: String, default: "" },
    objectURL: { type: String, default: "" },
    imageURL: { type: String, default: "" },
    onView: { type: String, default: "" },
    heightCm: { type: Number, default: null },
    widthCm: { type: Number, default: null },
    creditLine: { type: String, default: "" },
    accessionNumber: { type: String, default: "" },

    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    location: { type: String, default: "Storage" },
    onDisplay: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.Artwork ||
  mongoose.model("Artwork", ArtworkSchema);
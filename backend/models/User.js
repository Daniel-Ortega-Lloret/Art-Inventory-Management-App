/**
 * Mongoose schema for user accounts
 * Represents staff members who can log into the system
 * Stores authentication credentials and account status
 */

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["staff"],
      default: "staff"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
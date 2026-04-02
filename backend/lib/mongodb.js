/**
 * MongoDB connection helper using Mongoose
 * This file ensures:
 * - A single shared database connection is reused
 * - Connections are cached to avoid reconnecting on every request
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Ensure the connection string is defined
if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

// Global cache to persist connection across hot reloads
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Connect to MongoDB, or reuse an existing connection
export default async function connectDB() {
  // Return cached connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "artmuseum"
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Reset promise on failure so it can retry later
    cached.promise = null;
    throw error;
  }
}
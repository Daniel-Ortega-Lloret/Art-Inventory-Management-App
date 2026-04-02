/**
 * CORS configuration
 * This allows the frontend to access the backend API without causing
 * CORS issues since they're running on different ports
 */

import { NextResponse } from "next/server";

// Frontend origin (Vite dev server)
const allowedOrigin = "http://localhost:5173";

// Attach CORS headers to an existing response
export function withCors(response) {
  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

// Handle browser preflight requests
export function handleOptions() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
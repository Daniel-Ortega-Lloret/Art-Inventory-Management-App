/**
 * Authentication utility functions for JWT handling
 * This file is responsible for:
 * - Signing JWT tokens when users log in or register
 * - Verifying tokens on protected routes
 * - Extracting tokens from incoming HTTP requests
 * - Enforcing authentication with requireAuth
 */

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Ensure the secret exists at startup
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in .env.local");
}

// Create a signed JWT containing basic user information
export function signToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: "staff",
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: "8h" } // Token expires after 8 hours
  );
}

// Verify and decode a JWT token
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Extract the token from the auth header
export function getTokenFromRequest(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
}

// Adds authentication requirement for a given route
export function requireAuth(request) {
  const token = getTokenFromRequest(request);

  if (!token) {
    throw new Error("Authentication token missing");
  }

  return verifyToken(token);
}
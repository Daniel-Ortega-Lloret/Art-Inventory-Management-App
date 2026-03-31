import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in .env.local");
}

export function signToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
}

export function requireAuth(request) {
  const token = getTokenFromRequest(request);

  if (!token) {
    throw new Error("Authentication token missing");
  }

  const decoded = verifyToken(token);
  return decoded;
}

export function requireRole(request, allowedRoles = []) {
  const user = requireAuth(request);

  if (!allowedRoles.includes(user.role)) {
    throw new Error("You do not have permission to perform this action");
  }

  return user;
}
/**
 * Error handling utilities
 * Provides:
 * - Extraction of Mongoose validation errors into a readable format
 * - Standardized API error responses
 */

// Extract field-level validation errors from a Mongoose ValidationError
export function getValidationErrors(error) {
  if (error?.name !== "ValidationError") {
    return null;
  }

  const fieldErrors = {};

  for (const key of Object.keys(error.errors)) {
    fieldErrors[key] = error.errors[key].message;
  }

  return fieldErrors;
}

// Build a consistent JSON error response
// Supports both validation errors and general errors
export function errorResponse(
  NextResponse,
  error,
  fallbackMessage = "Something went wrong",
  status = 500
) {
  const fieldErrors = getValidationErrors(error);

  // If this is a validation error, return detailed field errors
  if (fieldErrors) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        fieldErrors
      },
      { status: 400 }
    );
  }

  // Otherwise return a general error message
  return NextResponse.json(
    {
      success: false,
      error: error?.message || fallbackMessage
    },
    { status }
  );
}
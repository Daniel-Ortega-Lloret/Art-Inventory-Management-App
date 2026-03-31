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

export function errorResponse(NextResponse, error, fallbackMessage = "Something went wrong", status = 500) {
  const fieldErrors = getValidationErrors(error);

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

  return NextResponse.json(
    {
      success: false,
      error: error?.message || fallbackMessage
    },
    { status }
  );
}
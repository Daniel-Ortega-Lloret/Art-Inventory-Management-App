import { useMemo, useState } from "react";

const defaultValues = {
  title: "",
  artist: "",
  medium: "",
  classification: "",
  department: "",
  accessionNumber: "",
  onView: ""
};

export default function ArtworkForm({
  initialValues = defaultValues,
  onSubmit,
  submitting,
  serverFieldErrors = {},
  formError = ""
}) {
  const [form, setForm] = useState({
    ...defaultValues,
    ...initialValues
  });

  const [clientErrors, setClientErrors] = useState({});

  const mergedErrors = useMemo(
    () => ({ ...serverFieldErrors, ...clientErrors }),
    [serverFieldErrors, clientErrors]
  );

  function validate(values) {
    const errors = {};

    if (!values.title || !values.title.trim()) {
      errors.title = "Title is required";
    } else if (values.title.trim().length > 200) {
      errors.title = "Title cannot exceed 200 characters";
    }

    if (values.artist && values.artist.trim().length > 120) {
      errors.artist = "Artist name cannot exceed 120 characters";
    }

    if (values.medium && values.medium.trim().length > 200) {
      errors.medium = "Medium cannot exceed 200 characters";
    }

    if (values.classification && values.classification.trim().length > 100) {
      errors.classification = "Classification cannot exceed 100 characters";
    }

    if (values.department && values.department.trim().length > 150) {
      errors.department = "Department cannot exceed 150 characters";
    }

    if (values.accessionNumber && values.accessionNumber.trim().length > 100) {
      errors.accessionNumber = "Accession number cannot exceed 100 characters";
    }

    if (values.onView && values.onView.trim().length > 200) {
      errors.onView = "On view cannot exceed 200 characters";
    }

    return errors;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setClientErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanedForm = {
      ...form,
      title: form.title.trim(),
      artist: form.artist.trim(),
      medium: form.medium.trim(),
      classification: form.classification.trim(),
      department: form.department.trim(),
      accessionNumber: form.accessionNumber.trim(),
      onView: form.onView.trim()
    };

    const errors = validate(cleanedForm);
    setClientErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    await onSubmit(cleanedForm);
  }

  function renderError(fieldName) {
    if (!mergedErrors[fieldName]) return null;
    return <p className="field-error">{mergedErrors[fieldName]}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      {formError && <p className="error-text">{formError}</p>}

      <label>
        Title
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        {renderError("title")}
      </label>

      <label>
        Artist
        <input
          name="artist"
          value={form.artist}
          onChange={handleChange}
          required
        />
        {renderError("artist")}
      </label>

      <label>
        Medium
        <input
          name="medium"
          value={form.medium}
          onChange={handleChange}
          required
        />
        {renderError("medium")}
      </label>

      <label>
        Classification
        <input
          name="classification"
          value={form.classification}
          onChange={handleChange}
          required
        />
        {renderError("classification")}
      </label>

      <label>
        Department
        <input
          name="department"
          value={form.department}
          onChange={handleChange}
          required
        />
        {renderError("department")}
      </label>

      <label>
        Accession Number
        <input
          name="accessionNumber"
          value={form.accessionNumber}
          onChange={handleChange}
          required
        />
        {renderError("accessionNumber")}
      </label>

      <label>
        On View
        <input
          name="onView"
          value={form.onView}
          onChange={handleChange}
          required
        />
        {renderError("onView")}
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Save Artwork"}
      </button>
    </form>
  );
}
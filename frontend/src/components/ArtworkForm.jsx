import { useState } from "react";

const defaultValues = {
  title: "",
  artist: "",
  medium: "",
  classification: "",
  department: "",
  accessionNumber: "",
  price: 0,
  quantity: 1,
  location: "Main Storage",
  onDisplay: false
};

export default function ArtworkForm({ initialValues = defaultValues, onSubmit, submitting }) {
  const [form, setForm] = useState({
    ...defaultValues,
    ...initialValues
  });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity)
    });
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} required />
      </label>

      <label>
        Artist
        <input name="artist" value={form.artist} onChange={handleChange} />
      </label>

      <label>
        Medium
        <input name="medium" value={form.medium} onChange={handleChange} />
      </label>

      <label>
        Classification
        <input
          name="classification"
          value={form.classification}
          onChange={handleChange}
        />
      </label>

      <label>
        Department
        <input name="department" value={form.department} onChange={handleChange} />
      </label>

      <label>
        Accession Number
        <input
          name="accessionNumber"
          value={form.accessionNumber}
          onChange={handleChange}
        />
      </label>

      <label>
        Price
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          min="0"
        />
      </label>

      <label>
        Quantity
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          min="0"
        />
      </label>

      <label>
        Location
        <input name="location" value={form.location} onChange={handleChange} />
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="onDisplay"
          checked={form.onDisplay}
          onChange={handleChange}
        />
        On Display
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Save Artwork"}
      </button>
    </form>
  );
}

import React, { useState } from "react";
import axios from "axios";

export default function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price_type: "exact",
    price: "",
    min_price: "",
    max_price: "",
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    for (let i = 0; i < images.length; i++) {
      data.append("images[]", images[i]);
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.post("http://127.0.0.1:8000/api/products", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Product created successfully!");
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Failed to create product");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Add New Listing</h2>
      <input name="name" placeholder="Product Name" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <select name="price_type" onChange={handleChange}>
        <option value="exact">Exact Price</option>
        <option value="range">Price Range</option>
        <option value="contact">Contact for Price</option>
      </select>
      {formData.price_type === "exact" && (
        <input name="price" type="number" placeholder="Price" onChange={handleChange} />
      )}
      {formData.price_type === "range" && (
        <>
          <input name="min_price" type="number" placeholder="Min Price" onChange={handleChange} />
          <input name="max_price" type="number" placeholder="Max Price" onChange={handleChange} />
        </>
      )}
      <input type="file" multiple onChange={handleImageChange} />
      <button type="submit" style={{ background: "#c98d26", color: "#fff", padding: "10px 20px", borderRadius: "6px" }}>
        Save Listing
      </button>
    </form>
  );
}

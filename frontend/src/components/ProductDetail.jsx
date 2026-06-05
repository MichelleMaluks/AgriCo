import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error loading product:", err));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>
        <strong>Price:</strong>{" "}
        {product.price_type === "range"
          ? `${product.min_price} - ${product.max_price}`
          : product.price_type === "exact"
            ? `R${product.price}`
            : "Contact for price"}
      </p>

      <h3>Images</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {product.images.map((img) => (
          <img
            key={img.id}
            src={`http://127.0.0.1:8000/storage/${img.path}`}
            alt={product.name}
            style={{ width: "200px", margin: "10px", borderRadius: "6px" }}
          />
        ))}
      </div>

      <h3>Provider</h3>
      <Link
        to={`/provider/${product.provider_id}`}
        style={{ color: "#c98d26", fontWeight: "bold" }}
      >
        {product.business_name}
      </Link>
    </div>
  );
}

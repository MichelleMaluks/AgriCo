import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">

      {product.images && product.images.length > 0 ? (
        <img
          src={`http://127.0.0.1:8000/storage/${product.images[0].path}`}
          alt={product.name}
          style={{
            width: "100%",
            height: "150px",
            objectFit: "cover",
            borderRadius: "6px",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "150px",
            backgroundColor: "#bec050",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#153010",
          }}
        >
          Image Placeholder
        </div>
      )}

      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>
        <strong>Price:</strong>{" "}
        {product.price_type === "range"
          ? `${product.min_price} - ${product.max_price}`
          : product.price_type === "exact"
            ? `R${product.price}`
            : "Contact for price"}
      </p>


      <Link
        to={`/provider/${product.provider_id}`}
        style={{ color: "#c98d26", fontWeight: "bold" }}
      >
        {product.business_name}
      </Link>


      <Link
        to={`/product/${product.id}`}
        style={{ display: "block", marginTop: "10px", color: "#3b5a10" }}
      >
        View Details
      </Link>
    </div>
  );
}

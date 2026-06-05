import React from "react";
import { Link } from "react-router-dom";

export default function Categories() {
  const categories = [
    { name: "Ploughing", icon: "🚜" },
    { name: "Equipment Hire", icon: "🔧" },
    { name: "Livestock Slaughtering", icon: "🥩" },
    { name: "Sale of Livestock", icon: "🐄" },
    { name: "Other Services", icon: "🌱" },
  ];

  return (
    <section className="categories">
      <h2>Categories</h2>
      <p style={{ textAlign: "center", marginBottom: "20px" }}>
  Everyday needs, community events, and trusted services — all in one place. 
  Explore categories that matter most to rural South Africa.
</p>

      <div className="category-grid">
        {categories.map((cat, index) => (
          <Link
            key={index}
            to={`/providers?service=${encodeURIComponent(cat.name)}`}
            className="category-card"
          >
            <div className="category-icon">{cat.icon}</div>
            <h3>{cat.name}</h3>
            <p>Explore providers offering {cat.name.toLowerCase()} services.</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

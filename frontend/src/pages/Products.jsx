
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products")
      .then(res => setProducts(res.data));
  }, []);

  return (
    <section>
      <h2>Available Products</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        {products.map(p => (
          <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "10px" }}>
            <img src={p.image_url} alt={p.title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
            <h3>{p.title}</h3>
            <p>R{p.price}</p>
            <Link to={`/products/${p.id}`} style={{ background: "#c98d26", color: "#fff", padding: "8px 12px", borderRadius: "6px", textDecoration: "none" }}>
              View Details
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

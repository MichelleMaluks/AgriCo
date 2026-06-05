import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{
      width: "220px",
      background: "#1e1e2f",
      color: "#fff",
      height: "100vh",
      padding: "20px",
      position: "fixed",
      top: 0,
      left: 0
    }}>
      <h2 style={{ marginBottom: "30px", color: "#c98d26" }}>Admin Panel</h2>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "15px" }}>
            <Link to="/admin/dashboard" style={{ color: "#fff", textDecoration: "none" }}>Dashboard</Link>
          </li>
          <li style={{ marginBottom: "15px" }}>
            <Link to="/admin/users" style={{ color: "#fff", textDecoration: "none" }}>Users</Link>
          </li>
          <li style={{ marginBottom: "15px" }}>
            <Link to="/admin/services" style={{ color: "#fff", textDecoration: "none" }}>Services</Link>
          </li>
          <li style={{ marginBottom: "15px" }}>
            <Link to="/admin/forum" style={{ color: "#fff", textDecoration: "none" }}>Forum</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

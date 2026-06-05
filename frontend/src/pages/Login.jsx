import React, { useState, useContext } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null); // ✅ define error state
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", form);
      const { user, token } = res.data;

      login(res.data.user, res.data.token);

      if (user.role === "seller") {
        navigate(`/provider/${user.provider_id}/profile`);
      } else if(user.role === "buyer") {
        navigate("/buyer-dashboard");
      }else navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="page-container">
      <div
        className="dashboard-card"
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" className="cta">
            Login
          </button>
        </form>
        {error && (
          <p style={{ marginTop: "10px", color: "red", textAlign: "center" }}>
            {error}
          </p>
        )}
        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

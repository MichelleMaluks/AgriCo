import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "buyer",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register", form);
      alert("Registration successful!");
      if (res.data.role === "seller") {
        window.location.href = `/provider-profile/${res.data.id}`;
      } else {
        window.location.href = "/buyer-dashboard";
      }
    } catch (err) {
      console.error("Error response:", err.response?.data || err.message);
      alert("Registration failed");
    }
  };

  return (
    <div className="page-container">
      <div
        className="dashboard-card"
        style={{ maxWidth: "450px", margin: "0 auto" }}
      >
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={form.password_confirmation}
            onChange={(e) =>
              setForm({ ...form, password_confirmation: e.target.value })
            }
            required
          />

          <div className="role-select">
            <label>
              <input
                type="radio"
                name="role"
                value="buyer"
                checked={form.role === "buyer"}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
              Buyer
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="seller"
                checked={form.role === "seller"}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
              Provider
            </label>
          </div>

          <button type="submit" className="cta">
            Register
          </button>
        </form>
        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

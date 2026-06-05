import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function BuyerDashboard() {
  const [providers, setProviders] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    service: "",
  });
  const [messages, setMessages] = useState([]);

  const fetchProviders = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/providers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        params: filters,
      });
      setProviders(res.data);
    } catch (err) {
      console.error("Error loading providers:", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/messages", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProviders();
  };

  return (
    <div className="page-container">
      <h2>Buyer Dashboard</h2>
      <p>Welcome back! Manage your providers, requests, and messages here.</p>


      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Browse Providers</h3>
          <p>Find services and products from trusted providers.</p>
          <Link to="/providers" className="cta">
            Browse Now
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Saved Providers</h3>
          <p>View providers you’ve bookmarked.</p>
          <Link to="/saved-providers" className="cta">
            View Saved
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Cart / Requests</h3>
          <p>Manage your service requests or cart items.</p>
          <Link to="/cart" className="cta">
            Go to Cart
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Messages</h3>
          <p>Check replies from providers you contacted.</p>
          <Link to="/messages" className="cta">
            View Messages
          </Link>
        </div>
      </div>


      <form onSubmit={handleSearch} style={{ margin: "30px 0" }}>
        <input
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          placeholder="Filter by location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <input
          placeholder="Filter by service"
          value={filters.service}
          onChange={(e) => setFilters({ ...filters, service: e.target.value })}
        />
        <button type="submit">Search</button>
      </form>


      <div className="dashboard-grid">
        {providers.map((provider) => (
          <div key={provider.id} className="dashboard-card">
            <h3>{provider.name}</h3>
            <p>{provider.location}</p>
            <p>{provider.description}</p>

            {provider.images.length > 0 && (
              <img
                src={`http://127.0.0.1:8000/storage/${provider.images[0].path}`}
                alt="Provider thumbnail"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
            )}

            <Link to={`/provider/${provider.id}`} className="cta">
              View Profile
            </Link>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: "40px" }}>Your Messages</h3>
      <div className="dashboard-grid">
        {messages.length === 0 ? (
          <p>You don’t have any messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="dashboard-card">
              <h4>{msg.provider.name}</h4>
              <p>
                <strong>{msg.from_buyer ? "You" : msg.provider.name}:</strong>{" "}
                {msg.content}
              </p>
              <p>
                <em>{new Date(msg.created_at).toLocaleString()}</em>
              </p>
              <Link to={`/provider/${msg.provider.id}`} className="cta">
                View Provider
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

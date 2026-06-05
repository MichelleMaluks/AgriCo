import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function BrowseProviders() {
  const [providers, setProviders] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    service: "",
  });

  const locationHook = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    const service = params.get("service");
    const loc = params.get("location");
    const name = params.get("name");

    setFilters({
      name: name || "",
      location: loc || "",
      service: service || "",
    });
  }, [locationHook.search]);

  const fetchProviders = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/providers", {
        params: filters,
      });
      setProviders(res.data);
    } catch (err) {
      console.error("Error loading providers:", err);
    }
  };
  const saveProvider = async (providerId) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/saved-providers`,
        { provider_id: providerId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      alert("Provider saved!");
    } catch (err) {
      console.error("Error saving provider:", err);
      alert("Failed to save provider.");
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProviders();
  };

  return (
    <div className="page-container">
      <h2>Browse Providers</h2>


      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
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


      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {providers.map((provider) => (
          <ProductCard key={provider.id} product={provider} />
        ))}
        <button onClick={() => saveProvider(provider.id)} className="cta">
          Save Provider
        </button>
      </div>
    </div>
  );
}

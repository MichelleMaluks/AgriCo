import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function SavedProviders() {
  const [savedProviders, setSavedProviders] = useState([]);
  const removeProvider = async (providerId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/saved-providers/${providerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      setSavedProviders(
        savedProviders.filter((p) => p.provider.id !== providerId),
      );
    } catch (err) {
      console.error("Error removing provider:", err);
    }
  };
  useEffect(() => {

    axios
      .get("http://127.0.0.1:8000/api/saved-providers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((res) => setSavedProviders(res.data))
      .catch((err) => console.error("Error loading saved providers:", err));
  }, []);

  return (
    <div className="page-container">
      <h2>Saved Providers</h2>
      <p>Here are the providers you’ve bookmarked for quick access.</p>

      <div className="dashboard-grid">
        {savedProviders.length === 0 ? (
          <p>You haven’t saved any providers yet.</p>
        ) : (
          savedProviders.map((provider) => (
            <div key={provider.id} className="dashboard-card">
              <h3>{provider.name}</h3>
              <p>{provider.location}</p>
              <p>{provider.description}</p>

              {provider.images?.length > 0 && (
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
              <button
                onClick={() => removeProvider(provider.id)}
                className="cta"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export default function FeaturedProviders() {
  const featured = [
    {
      id: 1,
      name: "Provider One",
      description: "Specialist in ploughing services",
    },
    {
      id: 2,
      name: "Provider Two",
      description: "Equipment hire for all events",
    },
    {
      id: 3,
      name: "Provider Three",
      description: "Livestock slaughtering and catering",
    },
  ];

  return (
    <section className="featured">
      <h2>Featured Providers</h2>
<p>
  Meet the people making a difference. These providers are trusted by their 
  communities and ready to help you with your next event or project.
</p>

      <div className="featured-grid">
        {featured.map((provider) => (
          <div key={provider.id} className="featured-card">
            <div className="featured-placeholder">Image Placeholder</div>
            <h3>{provider.name}</h3>
            <p>{provider.description}</p>
            <Link to={`/provider/${provider.id}`} className="view-profile">
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

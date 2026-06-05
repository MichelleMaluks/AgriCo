import React from "react";

export default function FeatureCard({ icon, title, desc }) {
  return (
    <div className="feature-card card">
      <div className="feature-icon">{icon}</div>
      <div className="feature-body">
        <h4 className="feature-title">{title}</h4>
        <p className="feature-desc">{desc}</p>
      </div>
    </div>
  );
}

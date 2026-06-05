import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section style={{
      position: "relative",
      height: "400px",
      overflow: "hidden",
      background: "linear-gradient(135deg, #c98d26, #bec050)", // desert sun → accent yellow-green
      color: "#ffffff",
      padding: "80px 20px",
      textAlign: "center"
    }}>
      {/* 🔑 Banner image (optional) */}
      <img
        src="/banner.jpg"   // replace with your banner image
        alt="Marketplace banner"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.25 
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "20px" , color: "#153010" }}>
          Where Communities Meet Opportunity
        </h1>
        <p style={{ maxWidth: "700px", margin: "0 auto 30px" , backgroundColor: "rgba(255, 255, 255, 0.8)", padding: "15px", borderRadius: "6px", color: "#153010"}}>
          From rural gatherings to everyday services, our platform makes it simple 
          to connect with trusted providers and discover new opportunities. 
          Whether you’re a buyer looking for reliable help or a provider ready to grow, 
          this is your space.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <Link to="/services" style={ctaPrimary}>Find Services Near You</Link>
          <Link to="/register-provider" style={ctaSecondary}>List Your Service Today</Link>
        </div>
      </div>
    </section>
  );
}


const ctaPrimary = {
  background: "#3b5a10",
  color: "#ffffff",
  padding: "12px 20px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold",
};

const ctaSecondary = {
  background: "#c98d26", 
  color: "#ffffff",
  padding: "12px 20px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold",
};

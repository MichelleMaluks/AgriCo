import React from "react";
import { logout } from "../services/api";

export default function Logout() {
  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    await logout(token);
    localStorage.removeItem("authToken");
    alert("Logged out successfully!");
  };

  return (
    <button className="cta" onClick={handleLogout}>
      Logout
    </button>
  );
}

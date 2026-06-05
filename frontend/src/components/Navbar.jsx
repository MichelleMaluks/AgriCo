import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="logo">
        Agri<span className="logo-c">C</span>
        <span className="logo-o">O</span>
      </div>

      <div>
        <Link to="/">Home</Link>
        <Link to="/providers">Providers</Link>
        <Link to="/forum">Forum</Link>

{user && user.role === "provider" && (
        <>
          <Link to="/product/new">Add Listing</Link>
          <Link to={`/provider/${user.provider_id}`}>Provider Profile</Link>
        </>
      )}

{user?.role === "buyer" && (
  <Link to="/buyer/dashboard">Buyer Dashboard</Link>
)}

{user?.role === "admin" && (
  <Link to="/admin/dashboard">Admin Dashboard</Link>
)}


        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <div className="user-section">
            <span className="username">Welcome, {user.name}</span>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, services: 0, forumPosts: 0 });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    })
    .then(res => setStats(res.data))
    .catch(err => console.error("Error loading dashboard:", err));
  }, []);

  return (
    <AdminLayout>
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>
      <ul>
        <li>Total Users: {stats.users}</li>
        <li>Total Services: {stats.services}</li>
        <li>Total Forum Posts: {stats.forumPosts}</li>
      </ul>
    </div>
</AdminLayout>
  );
}

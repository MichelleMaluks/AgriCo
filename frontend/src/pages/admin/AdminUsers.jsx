import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = () => {
    axios.get("http://127.0.0.1:8000/api/admin/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    }).then(res => setUsers(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      axios.put(`http://127.0.0.1:8000/api/admin/users/${editingId}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      }).then(() => {
        setEditingId(null);
        setForm({ name: "", email: "", password: "", role: "buyer" });
        fetchUsers();
      });
    } else {
      axios.post("http://127.0.0.1:8000/api/admin/users", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      }).then(() => {
        setForm({ name: "", email: "", password: "", role: "buyer" });
        fetchUsers();
      });
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
  };

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    }).then(() => fetchUsers());
  };

  return (
    <AdminLayout>
    <div style={{ padding: "20px" }}>
      <h2>Manage Users</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
          <option value="buyer">Buyer</option>
          <option value="provider">Provider</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">{editingId ? "Update User" : "Add User"}</button>
      </form>

      <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </AdminLayout>
  );
}

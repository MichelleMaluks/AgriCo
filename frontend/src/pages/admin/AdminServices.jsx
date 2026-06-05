import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", status: "pending" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = () => {
    axios.get("http://127.0.0.1:8000/api/admin/services", {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    }).then(res => setServices(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      axios.put(`http://127.0.0.1:8000/api/admin/services/${editingId}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      }).then(() => {
        setEditingId(null);
        setForm({ name: "", description: "", status: "pending" });
        fetchServices();
      });
    } else {
      axios.post("http://127.0.0.1:8000/api/admin/services", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      }).then(() => {
        setForm({ name: "", description: "", status: "pending" });
        fetchServices();
      });
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setForm({ name: service.name, description: service.description, status: service.status });
  };

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/admin/services/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    }).then(() => fetchServices());
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Services</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
        <button type="submit">{editingId ? "Update Service" : "Add Service"}</button>
      </form>

      <ul style={{ marginTop: "20px" }}>
        {services.map(s => (
          <li key={s.id}>
            {s.name} — {s.status}
            <button onClick={() => handleEdit(s)}>Edit</button>
            <button onClick={() => handleDelete(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

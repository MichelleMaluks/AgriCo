import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminForum() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", author: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = () => {
    axios.get("http://127.0.0.1:8000/api/admin/forum-posts", {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    }).then(res => setPosts(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      axios.put(`http://127.0.0.1:8000/api/admin/forum-posts/${editingId}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      }).then(() => {
        setEditingId(null);
        setForm({ title: "", content: "", author: "" });
        fetchPosts();
      });
    } else {
      axios.post("http://127.0.0.1:8000/api/admin/forum-posts", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      }).then(() => {
        setForm({ title: "", content: "", author: "" });
        fetchPosts();
      });
    }
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setForm({ title: post.title, content: post.content, author: post.author });
  };

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/admin/forum-posts/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    }).then(() => fetchPosts());
  };

  return (
    <AdminLayout>
      <div style={{ padding: "20px" }}>
        <h2>Moderate Forum Posts</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
          ></textarea>
          <input
            placeholder="Author"
            value={form.author}
            onChange={e => setForm({ ...form, author: e.target.value })}
          />
          <button type="submit">{editingId ? "Update Post" : "Add Post"}</button>
        </form>

        <ul style={{ marginTop: "20px" }}>
          {posts.map(p => (
            <li key={p.id}>
              {p.title} — {p.author}
              <button onClick={() => handleEdit(p)}>Edit</button>
              <button onClick={() => handleDelete(p.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
}

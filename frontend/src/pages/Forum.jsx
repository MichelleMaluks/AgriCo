
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", author: "" });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/forum")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/api/forum", form);
    setForm({ title: "", content: "", author: "" });
    const res = await axios.get("http://127.0.0.1:8000/api/forum");
    setPosts(res.data);
  };

  return (
    <div className="page-container">
      <h2>Community Forum</h2>


      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Your Name"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          required
        />
        <button type="submit" className="cta">
          Post
        </button>
      </form>


      <div className="forum-list">
        {posts.map((post) => (
          <div key={post.id} className="forum-card">
            <h3>{post.title}</h3>
            <p>
              <em>by {post.author}</em>
            </p>
            <Link to={`/forum/${post.id}`}>Read More</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

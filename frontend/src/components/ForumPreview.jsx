
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForumPreview() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/forum")
      .then((res) => setPosts(res.data.slice(0, 3))) // first 3
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="forum">
<h2>Community Forum</h2>
<p>
  Share experiences, ask questions, and connect with others. 
  Our forum is where communities come together to support each other.
</p>
      <div className="forum-list">
        {posts.map((post) => (
          <div key={post.id} className="forum-card">
            <h3>{post.title}</h3>
            <p>
              <em>by {post.author}</em>
            </p>
            <Link to={`/forum/${post.id}`} className="forum-link">
              Read More
            </Link>
          </div>
        ))}
      </div>

      <Link to="/forum" className="forum-cta">
        Visit Forum
      </Link>
    </section>
  );
}

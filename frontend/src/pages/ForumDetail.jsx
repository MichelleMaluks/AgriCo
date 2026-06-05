
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ForumDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/forum/${id}`)
      .then((res) => setPost(res.data))
      .catch(err => console.error("Error fetching post:", err));
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="forum-post">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p><strong>Author:</strong> {post.author}</p>

    </div>
  );
}

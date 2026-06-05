import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../services/api";

export default function Messages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api
      .get("/messages")
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error loading messages:", err));
  }, []);

  return (
    <div className="page-container">
      <h2>Your Messages</h2>
      <p>Here are all your conversations with providers.</p>

      <div className="dashboard-grid">
        {messages.length === 0 ? (
          <p>You don’t have any messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="dashboard-card">
              <h3>{msg.provider.name}</h3>
              <p>
                <strong>{msg.from_buyer ? "You" : msg.provider.name}:</strong>{" "}
                {msg.content}
              </p>
              <p>
                <em>{new Date(msg.created_at).toLocaleString()}</em>
              </p>
              <Link to={`/provider/${msg.provider.id}`} className="cta">
                View Provider
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

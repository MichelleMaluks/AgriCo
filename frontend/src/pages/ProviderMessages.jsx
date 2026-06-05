import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProviderMessages({ providerId }) {
  const [messages, setMessages] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const { user } = useContext(AuthContext);

  if (!user || !user.provider_id) {
    return <p>You must be logged in as a provider to view messages.</p>;
  }

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/providers/${providerId}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error loading provider messages:", err));
  }, [providerId]);

  const sendReply = async () => {
    if (!selectedBuyer || !replyContent.trim()) return;
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/messages/reply/${selectedBuyer.id}`,
        { provider_id: providerId, content: replyContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      alert("Reply sent!");
      setReplyContent("");
      setSelectedBuyer(null);
      // Refresh messages
      const res = await axios.get(
        `http://127.0.0.1:8000/api/providers/${providerId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Failed to send reply.");
    }
  };

  return (
    <div className="page-container">
      <h2>Provider Messages</h2>
      <p>Here are all messages from buyers interested in your services.</p>

      <div className="dashboard-grid">
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="dashboard-card">
              <h3>{msg.buyer.name}</h3>
              <p>
                <strong>{msg.from_buyer ? msg.buyer.name : "You"}:</strong>{" "}
                {msg.content}
              </p>
              <p>
                <em>{new Date(msg.created_at).toLocaleString()}</em>
              </p>

             
              {msg.from_buyer && (
                <button
                  className="cta"
                  onClick={() => setSelectedBuyer(msg.buyer)}
                >
                  Reply
                </button>
              )}
            </div>
          ))
        )}
      </div>

  
      {selectedBuyer && (
        <div style={{ marginTop: "30px" }}>
          <h3>Reply to {selectedBuyer.name}</h3>
          <textarea
            placeholder="Write your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            style={{ width: "100%", minHeight: "100px", marginBottom: "10px" }}
          />
          <button className="cta" onClick={sendReply}>
            Send Reply
          </button>
        </div>
      )}
    </div>
  );
}

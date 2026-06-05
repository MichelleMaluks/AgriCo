import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ProviderProfilePage() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/providers/${id}`)
      .then((res) => setProvider(res.data))
      .catch((err) => console.error("Error loading provider:", err));
  }, [id]);

  const handleContact = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/providers/${id}/contact`,
        form,
      );
      alert("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    }
  };

  if (!provider) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <h2>{provider.name}</h2>
      <p>
        <strong>Location:</strong> {provider.location}
      </p>
      <p>{provider.description}</p>


      <h3>Profile Images</h3>
      <div className="image-gallery">
        {provider.images && provider.images.length > 0 ? (
          provider.images.map((img) => (
            <img
              key={img.id}
              src={`/storage/${img.path}`}
              alt="Provider"
              className="gallery-image"
            />
          ))
        ) : (
          <p>No profile images uploaded yet.</p>
        )}
      </div>


      <h3>Services</h3>
      {provider.services && provider.services.length > 0 ? (
        provider.services.map((service) => (
          <div key={service.id} className="service-card">
            <h4>{service.title}</h4>
            <p>{service.description}</p>

            <div className="service-gallery">
              {service.images && service.images.length > 0 ? (
                service.images.map((img) => (
                  <img
                    key={img.id}
                    src={`/storage/${img.path}`}
                    alt="Service"
                    className="gallery-image"
                  />
                ))
              ) : (
                <p>No images for this service.</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No services listed yet.</p>
      )}


      <h3>Contact Provider</h3>
      <form onSubmit={handleContact} className="contact-form">
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <textarea
          placeholder="Your Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

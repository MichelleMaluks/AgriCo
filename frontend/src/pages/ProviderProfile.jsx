import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProvider, sendMessage } from "../services/api";

export default function ProviderProfile() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProvider(id).then((res) => setProvider(res.data));
  }, [id]);

  const handleSend = async () => {
    await sendMessage({
      provider_id: id,
      sender_email: email,
      content: message,
    });
    alert("Message sent!");
  };

  if (!provider) return <p>Loading...</p>;

  return (
    <div>
      <h2>{provider.name}</h2>
      <p>{provider.description}</p>
      <h3>Services</h3>
      <ul>
        {provider.services.map((s) => (
          <li key={s.id}>
            <img src={s.image} alt={s.title} width="100" />
            <h4>{s.title}</h4>
            <p>{s.description}</p>
            <ul>
              {Object.entries(s.options).map(([opt, price]) => (
                <li key={opt}>
                  {opt}: ${price}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <h3>Contact Provider</h3>
      <input
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send Message</button>
    </div>
  );
}

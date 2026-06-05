
import axios from "axios";

export default function OrderButton({ serviceId, amount }) {
  const handleOrder = async () => {
    const res = await axios.post("http://127.0.0.1:8000/api/orders", {
      service_id: serviceId,
      amount: amount
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    });

    const order = res.data;
    window.location.href = `http://127.0.0.1:8000/pay/${order.id}`;
  };

  return (
    <button 
      onClick={handleOrder} 
      style={{ background: "#c98d26", color: "#fff", padding: "10px 20px", borderRadius: "6px" }}
    >
      Place Order
    </button>
  );
}

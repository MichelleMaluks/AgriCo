// src/pages/Cart.jsx
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { createOrder } from "../services/api";
export default function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  const total = cart.reduce((sum, p) => sum + parseFloat(p.price), 0);

  return (
    <div>
      <h2>Cart</h2>
      <ul>
        {cart.map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price}
            <button onClick={() => removeFromCart(p.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <h3>Total: ${total.toFixed(2)}</h3>
      <button onClick={clearCart}>Clear Cart</button>

      <button
        onClick={async () => {
          try {
            const res = await createOrder({
              buyer_id: 1, 
              product_id: cart[0].id, 
              quantity: 1,
              total: cart[0].price,
            });
            alert("Order created with ID: " + res.data.id);
          } catch (err) {
            alert("Error: " + err.response?.data?.message || "Order failed");
          }
        }}
      >
        Checkout
      </button>
    </div>
  );
}

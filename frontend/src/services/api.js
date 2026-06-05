
import axios from "axios";


const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: false,
});


// Authentication

export const register = (data) => API.post("/register", data);
export const login = (data) => API.post("/login", data);
export const logout = (token) =>
  API.post("/logout", {}, { headers: { Authorization: `Bearer ${token}` } });


// Products

export const getProducts = () => API.get("/products");
export const createProduct = (data) => API.post("/products", data);


// Orders

export const getOrders = () => API.get("/orders");
export const createOrder = (data) => API.post("/orders", data);


// Providers

export const getProviders = () => API.get("/providers");
export const getProvider = (id) => API.get(`/providers/${id}`);

// Create a new provider profile
export const createProvider = (data, token) =>
  API.post("/providers", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Update an existing provider profile
export const updateProvider = (userId, data, token) =>
  API.put(`/provider/${userId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });


// Services

export const createService = (data) => API.post("/services", data);


// Buyer sends message to a provider
export const sendMessageToProvider = (providerId, data, token) =>
  API.post(`/providers/${providerId}/contact`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Provider replies to a buyer
export const replyToBuyer = (buyerId, data, token) =>
  API.post(`/messages/reply/${buyerId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Buyer views their messages
export const getBuyerMessages = (token) =>
  API.get("/messages", { headers: { Authorization: `Bearer ${token}` } });

// Provider views their messages
export const getProviderMessages = (providerId, token) =>
  API.get(`/providers/${providerId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });


// Saved Providers

export const getSavedProviders = (token) =>
  API.get("/saved-providers", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const saveProvider = (providerId, token) =>
  API.post(
    "/saved-providers",
    { provider_id: providerId },
    { headers: { Authorization: `Bearer ${token}` } },
  );

export const removeSavedProvider = (id, token) =>
  API.delete(`/saved-providers/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

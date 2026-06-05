
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
axios.get("http://127.0.0.1:8000/api/user", {
  headers: { Authorization: `Bearer ${token}` },
})
.then((res) => {
  const mergedUser = {
    ...res.data.user,
    provider_id: res.data.provider_id,
    business_name: res.data.provider?.name
  };
  setUser(mergedUser);
  localStorage.setItem("user", JSON.stringify(mergedUser));
  setLoading(false);
})

        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

const login = (userData, token) => {
  localStorage.setItem("authToken", token);

  const mergedUser = {
    ...userData.user,     
    provider_id: userData.provider_id,
    business_name: userData.provider?.name 
  };

  localStorage.setItem("user", JSON.stringify(mergedUser));
  setUser(mergedUser);
};

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

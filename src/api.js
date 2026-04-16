// src/api.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const apiCall = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("ecu_token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Erreur serveur");
    return data;
  } catch (err) {
    console.error("Erreur API:", err);
    throw err;
  }
};
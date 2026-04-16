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
    if (response.status === 401) localStorage.removeItem("ecu_token");
    return await response.json();
  } catch (err) {
    return { error: "Erreur réseau" };
  }
};
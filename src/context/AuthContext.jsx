import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);   // { id, name, email, avatar, isAdmin }
  const [loading, setLoading] = useState(true);

  // ── Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem("ecu_token");
    const saved = localStorage.getItem("ecu_user");
    if (token && saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  // ── Email / password login
  async function loginEmail(email, password) {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur de connexion");
    _saveSession(data.token, data.user);
    return data.user;
  }

  // ── Email / password register
  async function registerEmail(name, email, password) {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur d'inscription");
    _saveSession(data.token, data.user);
    return data.user;
  }

  // ── Google OAuth — redirect to backend
  function loginGoogle() {
    window.location.href = `${API}/api/auth/google`;
  }

  // ── Handle OAuth callback token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userParam = params.get("user");
    if (token && userParam) {
      try {
        const u = JSON.parse(decodeURIComponent(userParam));
        _saveSession(token, u);
        window.history.replaceState({}, "", "/");
      } catch {}
    }
  }, []);

  // ── Logout
  function logout() {
    localStorage.removeItem("ecu_token");
    localStorage.removeItem("ecu_user");
    setUser(null);
  }

  function _saveSession(token, u) {
    localStorage.setItem("ecu_token", token);
    localStorage.setItem("ecu_user", JSON.stringify(u));
    setUser(u);
  }

  function getToken() {
    return localStorage.getItem("ecu_token");
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginEmail, registerEmail, loginGoogle, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

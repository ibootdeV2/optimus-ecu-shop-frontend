import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiCall } from "../api";

export default function AuthPage({ nav }) {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "login" ? { email, password } : { name, email, password };
      
      const res = await apiCall(endpoint, "POST", body);
      if (res.token) {
        login(res.user, res.token);
        nav("shop");
      }
    } catch (err) {
      setError("Identifiants incorrects ou erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={handleSubmit}>
        <div className="auth-logo">DAGO<strong>AUTO</strong></div>
        <div className="auth-tabs">
          <div className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Connexion</div>
          <div className={`auth-tab ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>Inscription</div>
        </div>
        {error && <div style={{color: "#ff4d4d", marginBottom: "10px", fontSize: "13px"}}>{error}</div>}
        {mode === "register" && <input className="modal-input" placeholder="Nom" onChange={e => setName(e.target.value)} required />}
        <input className="modal-input" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input className="modal-input" type="password" placeholder="Moteur de passe" onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="auth-submit" disabled={loading}>{loading ? "..." : "Continuer"}</button>
      </form>
    </div>
  );
}
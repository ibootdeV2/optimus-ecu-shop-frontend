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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Remplissez tout !");
    
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "login" ? { email, password } : { name, email, password };
      
      const data = await apiCall(endpoint, "POST", body);
      
      if (data.token) {
        login(data.user, data.token);
        nav("shop");
      }
    } catch (err) {
      alert(err.message);
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

        {mode === "register" && (
          <div className="auth-field">
            <label>Nom complet</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jean Dupont" />
          </div>
        )}

        <div className="auth-field">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" />
        </div>

        <div className="auth-field">
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer un compte"}
        </button>
      </form>
    </div>
  );
}
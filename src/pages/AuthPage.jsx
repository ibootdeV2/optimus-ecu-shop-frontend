import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiCall } from "../api";

export default function AuthPage({ nav }) {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirection vers le Backend pour Google
  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await apiCall(endpoint, "POST", { email, password });
      if (res.token) {
        login(res.user, res.token);
        nav("shop");
      }
    } catch (err) {
      alert("Erreur de connexion");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={handleSubmit}>
        <div className="auth-logo">DAGO<strong>AUTO</strong></div>
        
        {/* BOUTON GOOGLE RÉACTIVÉ */}
        <button type="button" className="google-btn" onClick={handleGoogle}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width="18" alt="Google" />
          Continuer avec Google
        </button>

        <div className="auth-divider">ou par email</div>

        <div className="auth-tabs">
          <div className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Connexion</div>
          <div className={`auth-tab ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>Inscription</div>
        </div>

        <input className="modal-input" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input className="modal-input" type="password" placeholder="Mot de passe" onChange={e => setPassword(e.target.value)} required />
        
        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Chargement..." : "Continuer"}
        </button>
      </form>
    </div>
  );
}
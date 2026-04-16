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
    if (!email || !password) return setError("Veuillez remplir tous les champs.");
    
    setLoading(true);
    try {
      // Les routes doivent correspondre exactement à votre server.js
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "login" ? { email, password } : { name, email, password };
      
      const data = await apiCall(endpoint, "POST", body);
      
      if (data.token && data.user) {
        login(data.user, data.token);
        nav("shop"); // Une fois connecté, on débloque l'accès
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
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

        {error && <div style={{color: "#ff4d4d", fontSize: "13px", marginBottom: "15px"}}>{error}</div>}

        <button type="button" className="google-btn" onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width="18" alt="Google" />
          Continuer avec Google
        </button>

        <div className="auth-divider">ou par email</div>

        {mode === "register" && (
          <div className="auth-field">
            <label>Nom complet</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jean Dupont" required />
          </div>
        )}

        <div className="auth-field">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" required />
        </div>

        <div className="auth-field">
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>

        {/* BOUTON RETOUR SUPPRIMÉ POUR FORCER L'AUTH */}
      </form>
    </div>
  );
}
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ nav }) {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">DAGO<strong>AUTO</strong></div>
        
        <button className="google-btn" onClick={handleGoogle}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width="18" alt="G" />
          Continuer avec Google
        </button>

        <div className="auth-divider">ou par email</div>

        <div className="auth-tabs">
          <button className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Connexion</button>
          <button className={`auth-tab ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>Inscription</button>
        </div>

        <div className="auth-field">
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="auth-field">
          <input type="password" placeholder="Mot de passe" onChange={e => setPassword(e.target.value)} />
        </div>

        <button className="auth-submit">
          {mode === "login" ? "Se connecter" : "Créer un compte"}
        </button>
      </div>
    </div>
  );
}
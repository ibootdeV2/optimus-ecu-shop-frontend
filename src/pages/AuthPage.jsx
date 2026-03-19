import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.7 2.2 30.2 0 24 0 14.7 0 6.7 5.4 2.9 13.3l7.9 6.1C12.6 13 17.9 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.8-2.1 5.2-4.5 6.8l7.1 5.5c4.1-3.8 6.5-9.5 6.5-16.3z"/>
    <path fill="#FBBC05" d="M10.8 28.6A14.5 14.5 0 019.5 24c0-1.6.3-3.1.7-4.6l-7.9-6.1A23.9 23.9 0 000 24c0 3.9.9 7.5 2.5 10.7l8.3-6.1z"/>
    <path fill="#34A853" d="M24 48c6.2 0 11.5-2 15.3-5.5l-7.1-5.5c-2 1.4-4.6 2.2-8.2 2.2-6.1 0-11.4-3.5-13.2-9.1l-8.3 6.1C6.7 42.6 14.7 48 24 48z"/>
  </svg>
);

export default function AuthPage({ nav }) {
  const { loginEmail, registerEmail, loginGoogle } = useAuth();
  const [mode, setMode]       = useState("login"); // login | register
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handle = async () => {
    setError(""); 
    if (!email || !password) { setError("Remplissez tous les champs."); return; }
    if (mode === "register") {
      if (!name) { setError("Entrez votre nom."); return; }
      if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
      if (password.length < 6) { setError("Mot de passe trop court (6 caractères min)."); return; }
    }
    setLoading(true);
    try {
      if (mode === "login") await loginEmail(email, password);
      else await registerEmail(name, email, password);
      nav("shop");
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        {/* Logo */}
        <div className="auth-logo" onClick={() => nav("shop")} style={{cursor:"pointer"}}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><line x1="6" y1="4" x2="6" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="10" y1="4" x2="10" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="6" y1="12" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="10" y1="12" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="4" y1="6" x2="2" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="4" y1="10" x2="2" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          DAGО<strong>AUTO</strong>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button className={`auth-tab ${mode==="login"?"active":""}`} onClick={()=>{setMode("login");setError("");}}>Connexion</button>
          <button className={`auth-tab ${mode==="register"?"active":""}`} onClick={()=>{setMode("register");setError("");}}>Inscription</button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {/* Google */}
        <button className="google-btn" onClick={loginGoogle}>
          <GoogleIcon />
          Continuer avec Google
        </button>

        <div className="auth-divider"><span>ou</span></div>

        {/* Form */}
        {mode === "register" && (
          <div className="auth-field">
            <label>Nom complet</label>
            <input placeholder="Jean Dupont" value={name} onChange={e=>setName(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handle()} />
          </div>
        )}
        <div className="auth-field">
          <label>Email</label>
          <input type="email" placeholder="votre@email.com" value={email} onChange={e=>setEmail(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handle()} />
        </div>
        <div className="auth-field">
          <label>Mot de passe</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handle()} />
        </div>
        {mode === "register" && (
          <div className="auth-field">
            <label>Confirmer le mot de passe</label>
            <input type="password" placeholder="••••••••" value={confirm} onChange={e=>setConfirm(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handle()} />
          </div>
        )}

        <button className="auth-submit" onClick={handle} disabled={loading}>
          {loading ? "Chargement…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>

        <button className="auth-back" onClick={() => nav("shop")}>← Retour à la boutique</button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// 1. EXPORT NOMMÉ (Named Export)
export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  
  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">DAGO<strong>AUTO</strong> Admin</div>
        <p style={{color: "#888", marginBottom: "20px", fontSize: "14px"}}>Espace sécurisé</p>
        
        <input 
          className="input-field" 
          placeholder="Email de l'administrateur" 
          onChange={e => setEmail(e.target.value)} 
        />
        <input 
          className="input-field" 
          type="password" 
          placeholder="Mot de passe" 
          onChange={e => setPass(e.target.value)} 
        />
        
        <button className="auth-submit" style={{width: "100%"}}>
          Se connecter au Dashboard
        </button>
      </div>
    </div>
  );
}

// 2. EXPORT PAR DÉFAUT (Default Export)
export default function Admin({ nav }) {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("ecu_token");

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/admin/users`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => {
      setUsers(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [token]);

  if (!token) return <AdminLogin />;
  if (loading) return <div className="app-loading">Chargement...</div>;

   return (
    <div className="admin-wrap">
      <header style={{display: "flex", justifyContent: "space-between", marginBottom: "30px"}}>
        <h1>Administration</h1>
        <button onClick={() => nav("shop")} className="nav-btn-ghost">Boutique</button>
      </header>

      <div className="stats-row">
        <div className="stat-card"><h3>124</h3><p>Fichiers</p></div>
        <div className="stat-card"><h3>450</h3><p>Utilisateurs</p></div>
        <div className="stat-card"><h3>89</h3><p>Downloads</p></div>
      </div>

      <div className="admin-tabs">
        <button className="active">Utilisateurs</button>
        <button>Catalogue</button>
        <button>Marques</button>
      </div>

      <table className="admin-table">
        <thead><tr><th>Nom</th><th>Email</th><th>Actions</th></tr></thead>
        <tbody>
           {/* Vos données ici */}
        </tbody>
      </table>
    </div>
  );
}
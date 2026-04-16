import { useState, useEffect } from "react";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// 1. EXPORT NOMMÉ (Named Export)
export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  
  const handle = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass })
      });
      const d = await res.json();
      if (d.token) {
        localStorage.setItem("ecu_token", d.token);
        window.location.reload();
      } else {
        alert(d.error || "Accès refusé");
      }
    } catch (err) {
      alert("Le serveur ne répond pas");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">DAGO<strong>AUTO</strong> Admin</div>
        <input className="input-field" placeholder="Email Admin" onChange={e => setEmail(e.target.value)} />
        <input className="input-field" type="password" placeholder="Mot de passe" onChange={e => setPass(e.target.value)} />
        <button className="login-btn" onClick={handle}>Se connecter</button>
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
      <div className="admin-topbar" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h1>DAGOAUTO <span>Admin</span></h1>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="auth-submit" style={{width:"auto", padding:"8px 15px"}}>Déconnexion</button>
      </div>

      <table className="admin-table">
        <thead><tr><th>Utilisateur</th><th>Email</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>
                <div className="name-with-tooltip">
                  {u.name}
                  <div className="tooltip">📦 {u.total_files || 0} téléchargements</div>
                </div>
              </td>
              <td>{u.email}</td>
              <td><button className="tbl-del">Gérer</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
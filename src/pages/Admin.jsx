import { useState, useEffect } from "react";
import "../App.css"; // IMPORT DU CSS

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Admin({ nav }) {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("ecu_token");

  const loadData = async () => {
    const headers = { "Authorization": `Bearer ${token}` };
    const u = await fetch(`${API_URL}/api/admin/users`, { headers }).then(r => r.json());
    const f = await fetch(`${API_URL}/api/files`).then(r => r.json());
    setUsers(Array.isArray(u) ? u : []);
    setCatalog(Array.isArray(f) ? f : []);
    setLoading(false);
  };

  useEffect(() => { if (token) loadData(); }, [tab, token]);

  if (!token) return <AdminLogin />;
  if (loading) return <div className="app-loading">Chargement...</div>;

  return (
    <div className="admin-wrap">
      <div className="admin-topbar" style={{display:"flex", justifyContent:"space-between"}}>
        <h1>DAGOAUTO <span>Admin</span></h1>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="nav-btn-ghost">Déconnexion</button>
      </div>

      <div className="admin-tabs">
        <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>Utilisateurs</button>
        <button className={tab === "catalog" ? "active" : ""} onClick={() => setTab("catalog")}>Catalogue</button>
      </div>

      {tab === "users" && (
        <table className="admin-table">
          <thead><tr><th>Nom (Survoler)</th><th>Email</th><th>Inscrit le</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="name-with-tooltip">
                    {u.name}
                    <div className="tooltip">📦 {u.total_files} fichiers téléchargés</div>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const handle = async () => {
    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass })
    });
    const d = await res.json();
    if (d.token) { localStorage.setItem("ecu_token", d.token); window.location.reload(); }
    else alert(d.error || "Erreur");
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">DAGO<strong>AUTO</strong> Admin</div>
        <input className="input-field" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="input-field" type="password" placeholder="Moteur de passe" onChange={e => setPass(e.target.value)} />
        <button className="login-btn" onClick={handle}>Se connecter</button>
      </div>
    </div>
  );
}
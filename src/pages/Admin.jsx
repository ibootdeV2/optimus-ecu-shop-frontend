import { useState, useEffect } from "react";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// IMPORTANT: Ajout de "export" devant la fonction pour corriger l'erreur de build
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
        alert(d.error || "Identifiants incorrects");
      }
    } catch (err) {
      alert("Erreur de connexion au serveur");
    }
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

export default function Admin({ nav }) {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("ecu_token");

  const loadData = async () => {
    try {
      const headers = { "Authorization": `Bearer ${token}` };
      const res = await fetch(`${API_URL}/api/admin/users`, { headers });
      const u = await res.json();
      setUsers(Array.isArray(u) ? u : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) loadData(); }, [token]);

  if (!token) return <AdminLogin />;
  if (loading) return <div className="app-loading">Chargement...</div>;

  return (
    <div className="admin-wrap">
      <div className="admin-topbar" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h1>DAGOAUTO <span>Admin</span></h1>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="auth-submit" style={{width:"auto", padding:"8px 15px"}}>Déconnexion</button>
      </div>

      <div className="admin-tabs">
        <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>Utilisateurs</button>
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
                    <div className="tooltip">
                      📧 {u.email} <br/>
                      📦 {u.total_files || 0} fichiers téléchargés
                    </div>
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
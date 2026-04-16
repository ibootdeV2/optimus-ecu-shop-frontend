import { useState, useEffect } from "react";
import { apiCall } from "../api";

const TrashIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 4h10M6 4V3h4v1M5 4v8h6V4H5z"/></svg>;
const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v10M3 8h10"/></svg>;

function BrandsManager({ brands, onChange }) {
  const [selBrand, setSelBrand] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [activeTab, setActiveTab] = useState("brands");

  const brandList = Object.keys(brands || {}).sort();
  const modelList = selBrand ? Object.keys(brands[selBrand]?.models || {}).sort() : [];

  const addBrand = () => {
    if (!newBrand) return;
    const next = { ...brands, [newBrand.toUpperCase()]: { models: {} } };
    onChange(next); setNewBrand("");
  };

  const addModel = () => {
    if (!newModel || !selBrand) return;
    const next = { ...brands };
    next[selBrand].models[newModel] = { years: "N/A", engines: [] };
    onChange(next); setNewModel("");
  };

  return (
    <div className="manager-section">
      <div className="sub-tabs">
        <button className={activeTab === "brands" ? "active" : ""} onClick={() => setActiveTab("brands")}>Marques</button>
        <button className={activeTab === "models" ? "active" : ""} onClick={() => setActiveTab("models")} disabled={!selBrand}>Modèles ({selBrand})</button>
      </div>
      {activeTab === "brands" ? (
        <>
          <div className="manager-add-row">
            <input className="manager-input" placeholder="AUDI..." value={newBrand} onChange={e => setNewBrand(e.target.value)} />
            <button className="manager-add-btn" onClick={addBrand}><PlusIcon /> Ajouter</button>
          </div>
          <div className="manager-list">
            {brandList.map(b => (
              <div key={b} className={`manager-item ${selBrand === b ? "selected" : ""}`} onClick={() => { setSelBrand(b); setActiveTab("models"); }}>
                <span>{b}</span>
                <button className="manager-del-btn" onClick={(e) => { e.stopPropagation(); const n = { ...brands }; delete n[b]; onChange(n); }}><TrashIcon /></button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="manager-add-row">
            <input className="manager-input" placeholder="A3..." value={newModel} onChange={e => setNewModel(e.target.value)} />
            <button className="manager-add-btn" onClick={addModel}><PlusIcon /> Ajouter</button>
          </div>
          <div className="manager-list">
            {modelList.map(m => (
              <div key={m} className="manager-item">
                <span>{m}</span>
                <button className="manager-del-btn" onClick={() => { const n = { ...brands }; delete n[selBrand].models[m]; onChange(n); }}><TrashIcon /></button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Admin({ nav }) {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [brands, setBrands] = useState({});
  const [catalog, setCatalog] = useState([]);
  const [stats, setStats] = useState({ users: 0, downloads: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [cfg, u, f, s] = await Promise.all([
        apiCall("/api/config"),
        apiCall("/api/admin/users"),
        apiCall("/api/files"),
        apiCall("/api/admin/stats")
      ]);
      setBrands(cfg.brands || {});
      setUsers(u || []);
      setCatalog(f || []);
      setStats(s || { users: 0, downloads: 0 });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [tab]);

  if (loading) return <div className="app-loading"><div className="app-loading-ring"></div></div>;

  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <h1>DAGOAUTO Admin</h1>
        <button className="logout-btn" onClick={() => { localStorage.clear(); nav("shop"); }}>Sortir</button>
      </div>
      <div className="stats-row">
        <div className="stat-card"><h3>{stats.users}</h3><p>Membres</p></div>
        <div className="stat-card"><h3>{stats.downloads}</h3><p>Téléchargements</p></div>
      </div>
      <div className="admin-tabs">
        <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>Utilisateurs</button>
        <button className={tab === "config" ? "active" : ""} onClick={() => setTab("config")}>Marques</button>
      </div>
      {tab === "users" && (
        <table className="admin-table">
          <thead><tr><th>Nom</th><th>Statut</th><th>Action</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="name-with-tooltip">
                    {u.name}
                    <div className="tooltip">📧 {u.email}<br/>📦 {u.total_files} fichiers</div>
                  </div>
                </td>
                <td>{u.is_banned ? "Banni" : "Actif"}</td>
                <td><button onClick={async () => { await apiCall(`/api/admin/users/${u.id}/toggle-ban`, "POST"); loadData(); }}>Ban/Unban</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {tab === "config" && (
        <BrandsManager brands={brands} onChange={(val) => apiCall("/api/admin/config", "POST", { key: "brands", value: val })} />
      )}
    </div>
  );
}

export function AdminLogin({ nav }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const handle = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass })
    });
    const d = await res.json();
    if (d.token) { localStorage.setItem("ecu_token", d.token); nav("admin"); }
    else alert("Erreur de connexion");
  };
  return (
    <div className="login-page"><div className="login-box">
      <h2>DAGOAUTO Admin</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Pass" onChange={e => setPass(e.target.value)} />
      <button className="login-btn" onClick={handle}>Entrer</button>
    </div></div>
  );
}
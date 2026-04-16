import { useState, useEffect } from "react";
import { apiCall } from "../api";

// ─── ICONS ───────────────────────────────────────────────────────
const TrashIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 4h10M6 4V3h4v1M5 4v8h6V4H5z" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v10M3 8h10" strokeLinecap="round"/></svg>;
const EditIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 2l3 3-9 9H2v-3l9-9z" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ChipIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="8" height="8" rx="1"/><line x1="6" y1="4" x2="6" y2="2"/><line x1="10" y1="4" x2="10" y2="2"/><line x1="6" y1="12" x2="6" y2="14"/><line x1="10" y1="12" x2="10" y2="14"/></svg>;

// ─── SUB-COMPOSANT : BRANDS MANAGER ──────────────────────────────
function BrandsManager({ brands, onChange }) {
  const [selBrand, setSelBrand] = useState("");
  const [activeTab, setActiveTab] = useState("brands");
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newYears, setNewYears] = useState("");

  const brandList = Object.keys(brands).sort();
  const modelList = selBrand ? Object.keys(brands[selBrand]?.models || {}).sort() : [];

  const addBrand = () => {
    if (!newBrand) return;
    const next = { ...brands, [newBrand.toUpperCase()]: { models: {} } };
    onChange(next); setNewBrand("");
  };

  const addModel = () => {
    if (!newModel || !selBrand) return;
    const next = { ...brands };
    next[selBrand].models[newModel] = { years: newYears, engines: [] };
    onChange(next); setNewModel(""); setNewYears("");
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
            <input className="manager-input" placeholder="Ajouter Marque (ex: AUDI)" value={newBrand} onChange={e => setNewBrand(e.target.value)} />
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
            <input className="manager-input" placeholder="Modèle (ex: A3)" value={newModel} onChange={e => setNewModel(e.target.value)} />
            <input className="manager-input" placeholder="Années" value={newYears} onChange={e => setNewYears(e.target.value)} />
            <button className="manager-add-btn" onClick={addModel}><PlusIcon /> Ajouter</button>
          </div>
          <div className="manager-list">
            {modelList.map(m => (
              <div key={m} className="manager-item">
                <span>{m} ({brands[selBrand].models[m].years})</span>
                <button className="manager-del-btn" onClick={() => { const n = { ...brands }; delete n[selBrand].models[m]; onChange(n); }}><TrashIcon /></button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ADMIN ───────────────────────────────────
export default function Admin({ nav }) {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [brands, setBrands] = useState({});
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

  const handleToggleBan = async (id) => {
    await apiCall(`/api/admin/users/${id}/toggle-ban`, "POST");
    loadData();
  };

  if (loading) return <div className="app-loading"><div className="app-loading-ring"></div></div>;

  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <h1 className="admin-title">DAGOAUTO <span>Administration</span></h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="nav-btn" onClick={() => nav("shop")}>Boutique</button>
          <button className="logout-btn" onClick={() => { localStorage.clear(); nav("shop"); }}>Déconnexion</button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card"><h3>{catalog.length}</h3><p>Fichiers</p></div>
        <div className="stat-card"><h3>{stats.users}</h3><p>Membres</p></div>
        <div className="stat-card"><h3>{stats.downloads}</h3><p>Téléchargements</p></div>
      </div>

      <div className="admin-tabs">
        <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>Utilisateurs</button>
        <button className={tab === "catalog" ? "active" : ""} onClick={() => setTab("catalog")}>Catalogue</button>
        <button className={tab === "config" ? "active" : ""} onClick={() => setTab("config")}>Configuration</button>
      </div>

      {tab === "users" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Utilisateur</th><th>Email</th><th>Inscrit le</th><th>Statut</th><th>Action</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className={u.is_banned ? "row-banned" : ""}>
                  <td>
                    <div className="name-with-tooltip">
                      <strong>{u.name}</strong>
                      <div className="tooltip">
                        📧 {u.email} <br />
                        📦 {u.total_files || 0} fichiers récupérés
                      </div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>{u.is_banned ? <span className="badge-red">Banni</span> : <span className="badge-green">Actif</span>}</td>
                  <td><button className="tbl-del" onClick={() => handleToggleBan(u.id)}>{u.is_banned ? "Débloquer" : "Bannir"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "config" && (
        <BrandsManager brands={brands} onChange={(val) => apiCall("/api/admin/config", "POST", { key: "brands", value: val })} />
      )}

      {tab === "catalog" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Véhicule</th><th>Type ECU</th><th>Référence</th><th>Tags</th></tr>
            </thead>
            <tbody>
              {catalog.map(f => (
                <tr key={f.id}>
                  <td><strong>{f.brand}</strong> {f.model}</td>
                  <td>{f.calc_type}</td>
                  <td>{f.ecu_ref}</td>
                  <td>{f.tags?.map(t => <span key={t} className="tag-badge">{t}</span>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN LOGIN ─────────────────────────────────────────────────
export function AdminLogin({ nav }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handle = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const d = await res.json();
    if (d.token) {
      localStorage.setItem("ecu_token", d.token);
      nav("admin");
    } else { setError("Identifiants incorrects"); }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>DAGOAUTO Admin</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input className="modal-input" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="modal-input" type="password" placeholder="Mot de passe" onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="login-btn" onClick={handle}>Connexion</button>
      </div>
    </div>
  );
}
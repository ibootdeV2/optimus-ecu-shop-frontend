import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getBrandList, getModelList, getEngineList, ECU_TYPES, generateS3Key, CATALOG_STATS, BRANDS } from "../carDatabase";

// ─────────────────────────────────────────────────────────────────
// ADMIN LOGIN
// ─────────────────────────────────────────────────────────────────
export function AdminLogin({ nav }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handle = async () => {
    if (!email || !password) { setError("Remplissez tous les champs."); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 700));
    // Production: POST /api/admin/login → { token }
    if (email === "admin@ecu.com" && password === "admin123") {
      localStorage.setItem("ecu_admin_token", "demo-admin-jwt");
      nav("admin");
    } else {
      setError("Identifiants incorrects.");
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><line x1="6" y1="4" x2="6" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="10" y1="4" x2="10" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="6" y1="12" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="10" y1="12" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="4" y1="6" x2="2" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="4" y1="10" x2="2" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          ECU<strong>Original</strong>
        </div>
        <div className="login-title">Espace administrateur</div>
        <div className="login-icon">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9V6a3 3 0 116 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="14" r="1.5" fill="currentColor"/></svg>
        </div>
        {error && <div className="login-error">{error}</div>}
        <div className="login-field"><label>Email</label>
          <input type="email" placeholder="admin@ecu.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} />
        </div>
        <div className="login-field"><label>Mot de passe</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} />
        </div>
        <button className="login-btn" onClick={handle} disabled={loading}>{loading?"Connexion…":"Se connecter"}</button>
        <p className="login-hint">Démo : admin@ecu.com / admin123</p>
        <button className="auth-back" onClick={() => nav("shop")}>← Retour à la boutique</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ADMIN UPLOAD FORM
// ─────────────────────────────────────────────────────────────────
function UploadForm({ onAdd, onCancel }) {
  const [brand, setBrand]       = useState("");
  const [model, setModel]       = useState("");
  const [engineIdx, setEngineIdx] = useState("");
  const [calcType, setCalcType] = useState(ECU_TYPES[0]);
  const [ecuRef, setEcuRef]     = useState("");
  const [file, setFile]         = useState(null);
  const [saving, setSaving]     = useState(false);

  const engines     = getEngineList(brand, model);
  const selectedEng = engines[parseInt(engineIdx)];
  const engineLabel = selectedEng ? `${selectedEng.displacement} — ${selectedEng.fuel} ${selectedEng.power}` : "";
  const refSuggestions = selectedEng ? selectedEng.refs.slice(0,6) : [];
  const autoS3Key = brand && model && engineLabel && ecuRef && calcType
    ? generateS3Key(brand, model, engineLabel, ecuRef, calcType) : "";

  const submit = async () => {
    if (!brand||!model||!selectedEng||!ecuRef||!file) { alert("Remplissez tous les champs et sélectionnez un fichier."); return; }
    setSaving(true);
    await new Promise(r=>setTimeout(r,700));
    onAdd({ id:Date.now(), brand, model, engineLabel, fuel:selectedEng.fuel,
      calcType, ecuRef, includes:["Fichier .bin original","Logiciel de flash","Guide PDF"], s3Key:autoS3Key });
    setSaving(false);
  };

  return (
    <div className="upload-form">
      <div className="upload-form-title">Ajouter un fichier ECU</div>
      <div className="form-section-label">1. Véhicule</div>
      <div className="form-grid-3">
        <div className="form-field"><label>Marque *</label>
          <select value={brand} onChange={e=>{setBrand(e.target.value);setModel("");setEngineIdx("");setEcuRef("");}}>
            <option value="">Choisir…</option>{getBrandList().map(b=><option key={b}>{b}</option>)}
          </select></div>
        <div className="form-field"><label>Modèle *</label>
          <select value={model} onChange={e=>{setModel(e.target.value);setEngineIdx("");setEcuRef("");}} disabled={!brand}>
            <option value="">Choisir…</option>{getModelList(brand).map(m=><option key={m}>{m}</option>)}
          </select>
          {brand&&model&&BRANDS[brand]?.models[model]&&<span className="field-hint">{BRANDS[brand].models[model].years}</span>}
        </div>
        <div className="form-field"><label>Motorisation *</label>
          <select value={engineIdx} onChange={e=>{setEngineIdx(e.target.value);setEcuRef("");}} disabled={!model}>
            <option value="">Choisir…</option>{engines.map((e,i)=><option key={i} value={i}>{e.displacement} — {e.fuel} {e.power}</option>)}
          </select></div>
      </div>
      <div className="form-section-label">2. Calculateur</div>
      <div className="form-grid-2">
        <div className="form-field"><label>Type *</label>
          <select value={calcType} onChange={e=>setCalcType(e.target.value)}>{ECU_TYPES.map(t=><option key={t}>{t}</option>)}</select>
        </div>
        <div className="form-field"><label>Référence ECU *</label>
          {refSuggestions.length>0?(
            <><select value={ecuRef} onChange={e=>setEcuRef(e.target.value)}>
              <option value="">Choisir…</option>{refSuggestions.map(r=><option key={r}>{r}</option>)}
            </select><span className="field-hint">Références connues pour ce moteur</span></>
          ):(
            <input placeholder="ex: Bosch EDC17C10" value={ecuRef} onChange={e=>setEcuRef(e.target.value)}/>
          )}
        </div>
      </div>
      <div className="form-section-label">3. Fichier</div>
      <div className="form-field"><label>Fichier ECU * (.bin, .zip, .hex)</label>
        <input type="file" accept=".bin,.hex,.zip,.rar" onChange={e=>setFile(e.target.files[0])} style={{padding:"6px 10px"}}/>
        {file&&<span className="field-hint">✓ {file.name}</span>}
      </div>
      {autoS3Key&&(
        <div className="s3-preview">
          <div className="s3-preview-label">Chemin S3 généré automatiquement</div>
          <div className="s3-preview-key">s3://ecu-originals/{autoS3Key}</div>
        </div>
      )}
      <div className="form-actions">
        <button className="cancel-btn" onClick={onCancel}>Annuler</button>
        <button className="save-btn" onClick={submit} disabled={saving}>{saving?"Publication…":"Publier"}</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────────────────────────
const SAMPLE_CATALOG = [
  { id:1, brand:"Peugeot", model:"207", engineLabel:"1.6 HDi — Diesel 90ch", fuel:"Diesel", calcType:"ECU Moteur (Injection)", ecuRef:"Siemens SID803", s3Key:"peugeot/207/1-6-hdi-diesel-90ch_siemens-sid803.zip" },
  { id:2, brand:"Peugeot", model:"308", engineLabel:"2.0 HDi — Diesel 136ch", fuel:"Diesel", calcType:"ECU Moteur (Injection)", ecuRef:"Bosch EDC17C10", s3Key:"peugeot/308/2-0-hdi-diesel-136ch_bosch-edc17c10.zip" },
  { id:3, brand:"Volkswagen", model:"Golf", engineLabel:"2.0 TDI — Diesel 150ch", fuel:"Diesel", calcType:"ECU Moteur (Injection)", ecuRef:"Bosch EDC17CP14", s3Key:"volkswagen/golf/2-0-tdi-diesel-150ch_bosch-edc17cp14.zip" },
];

// Sample users
const SAMPLE_USERS = [
  { id:1, name:"Rakoto Jean", email:"rakoto@gmail.com", provider:"google", downloads:5, joinedAt:"2026-02-10" },
  { id:2, name:"Rabe Marie",  email:"rabe@email.com",  provider:"email",  downloads:2, joinedAt:"2026-03-01" },
  { id:3, name:"Toto Alain",  email:"toto@email.com",  provider:"email",  downloads:8, joinedAt:"2026-01-15" },
];

function FuelBadge({ fuel }) {
  const d = fuel==="Diesel";
  return <span className="fuel-badge" style={{background:d?"#dbeafe":"#fef3c7",color:d?"#1e40af":"#b45309"}}>{fuel}</span>;
}

export default function Admin({ nav }) {
  const token = localStorage.getItem("ecu_admin_token");
  if (!token) { nav("admin-login"); return null; }

  const [tab, setTab]           = useState("catalog"); // catalog | users | stats
  const [catalog, setCatalog]   = useState(SAMPLE_CATALOG);
  const [showForm, setShowForm] = useState(false);
  const [filterBrand, setFilterBrand] = useState("");

  const logout = () => { localStorage.removeItem("ecu_admin_token"); nav("shop"); };
  const displayed = filterBrand ? catalog.filter(f=>f.brand===filterBrand) : catalog;

  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <div>
          <h1 className="admin-title">Administration ECU Shop</h1>
          <p className="admin-sub">{CATALOG_STATS.totalBrands} marques · {CATALOG_STATS.totalModels} modèles · {CATALOG_STATS.totalEngines} motorisations dans la base</p>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button className="nav-btn" onClick={()=>nav("shop")}>← Boutique</button>
          <button className="logout-btn" onClick={logout}>Déconnexion</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card"><div className="stat-num">{catalog.length}</div><div className="stat-lbl">Fichiers</div></div>
        <div className="stat-card"><div className="stat-num blue">{SAMPLE_USERS.length}</div><div className="stat-lbl">Utilisateurs</div></div>
        <div className="stat-card"><div className="stat-num amber">{SAMPLE_USERS.reduce((a,u)=>a+u.downloads,0)}</div><div className="stat-lbl">Téléchargements</div></div>
        <div className="stat-card"><div className="stat-num green">0 €</div><div className="stat-lbl">Revenus (PayPal bientôt)</div></div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${tab==="catalog"?"active":""}`} onClick={()=>setTab("catalog")}>Catalogue</button>
        <button className={`admin-tab ${tab==="users"?"active":""}`} onClick={()=>setTab("users")}>Utilisateurs</button>
      </div>

      {/* CATALOG TAB */}
      {tab==="catalog" && <>
        <div className="table-toolbar">
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div className="table-title">Catalogue ({displayed.length} fichiers)</div>
            <select className="toolbar-select" value={filterBrand} onChange={e=>setFilterBrand(e.target.value)}>
              <option value="">Toutes les marques</option>
              {getBrandList().map(b=><option key={b}>{b}</option>)}
            </select>
          </div>
          <button className="add-btn" onClick={()=>setShowForm(s=>!s)}>{showForm?"Fermer":"+ Ajouter un fichier"}</button>
        </div>
        {showForm && <UploadForm onAdd={f=>{setCatalog(p=>[f,...p]);setShowForm(false);}} onCancel={()=>setShowForm(false)}/>}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Marque/Modèle</th><th>Motorisation</th><th>Carb.</th><th>Type ECU</th><th>Réf. ECU</th><th>Clé S3</th><th></th></tr></thead>
            <tbody>
              {displayed.map(f=>(
                <tr key={f.id}>
                  <td><strong>{f.brand}</strong><br/><span style={{color:"var(--muted)",fontSize:"12px"}}>{f.model}</span></td>
                  <td style={{fontSize:"12px"}}>{f.engineLabel}</td>
                  <td><FuelBadge fuel={f.fuel}/></td>
                  <td style={{fontSize:"11px"}}>{f.calcType}</td>
                  <td className="ref-cell">{f.ecuRef}</td>
                  <td className="s3-cell">{f.s3Key}</td>
                  <td><button className="tbl-del" onClick={()=>{if(confirm("Supprimer ?"))setCatalog(p=>p.filter(x=>x.id!==f.id));}}>Suppr.</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>}

      {/* USERS TAB */}
      {tab==="users" && <>
        <div className="table-toolbar"><div className="table-title">Utilisateurs inscrits ({SAMPLE_USERS.length})</div></div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Nom</th><th>Email</th><th>Connexion via</th><th>Téléchargements</th><th>Inscrit le</th></tr></thead>
            <tbody>
              {SAMPLE_USERS.map(u=>(
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td style={{fontSize:"12px"}}>{u.email}</td>
                  <td><span className={`provider-badge ${u.provider}`}>{u.provider==="google"?"Google":"Email"}</span></td>
                  <td><span className="dl-count">{u.downloads}×</span></td>
                  <td style={{fontSize:"12px",color:"var(--muted)"}}>{u.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>}
    </div>
  );
}

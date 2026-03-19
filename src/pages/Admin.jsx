import { useState } from "react";
import { BRANDS as DB_BRANDS, ECU_TYPES as DB_ECU_TYPES, generateS3Key } from "../carDatabase";

// ─────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────
const ChipIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="6" y1="4" x2="6" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="10" y1="4" x2="10" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="6" y1="12" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="10" y1="12" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="4" y1="6" x2="2" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="4" y1="10" x2="2" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M3 4h10M6 4V3h4v1M5 4v8h6V4H5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M11 2l3 3-9 9H2v-3l9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// ADMIN LOGIN
// ─────────────────────────────────────────────────────────────────
export function AdminLogin({ nav }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handle = async () => {
    if (!email || !password) { setError("Remplissez tous les champs."); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 700));
    if (email === "admin@ecu.com" && password === "admin123") {
      localStorage.setItem("ecu_admin_token", "demo-admin-jwt");
      nav("admin");
    } else { setError("Identifiants incorrects."); }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo"><ChipIcon /> DAGО<strong>AUTO</strong></div>
        <div className="login-title">Espace administrateur</div>
        <div className="login-icon">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 9V6a3 3 0 116 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="10" cy="14" r="1.5" fill="currentColor"/>
          </svg>
        </div>
        {error && <div className="login-error">{error}</div>}
        <div className="login-field"><label>Email</label>
          <input type="email" placeholder="admin@ecu.com" value={email}
            onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/></div>
        <div className="login-field"><label>Mot de passe</label>
          <input type="password" placeholder="••••••••" value={password}
            onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/></div>
        <button className="login-btn" onClick={handle} disabled={loading}>
          {loading?"Connexion…":"Se connecter"}
        </button>
        <p className="login-hint">Démo : admin@ecu.com / admin123</p>
        <button className="auth-back" onClick={()=>nav("shop")}>← Retour à la boutique</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ECU TYPES MANAGER
// ─────────────────────────────────────────────────────────────────
function EcuTypesManager({ ecuTypes, setEcuTypes }) {
  const [newType,   setNewType]   = useState("");
  const [editIdx,   setEditIdx]   = useState(null);
  const [editValue, setEditValue] = useState("");

  const add = () => {
    const v = newType.trim();
    if (!v) return;
    if (ecuTypes.includes(v)) { alert("Ce type existe déjà."); return; }
    setEcuTypes(prev => [...prev, v]);
    setNewType("");
  };
  const remove = (idx) => {
    if (!confirm(`Supprimer "${ecuTypes[idx]}" ?`)) return;
    setEcuTypes(prev => prev.filter((_,i) => i !== idx));
  };
  const startEdit = (idx) => { setEditIdx(idx); setEditValue(ecuTypes[idx]); };
  const saveEdit  = () => {
    const v = editValue.trim();
    if (!v) return;
    setEcuTypes(prev => prev.map((t,i) => i === editIdx ? v : t));
    setEditIdx(null);
  };

  return (
    <div className="manager-section">
      <div className="manager-title">Types de calculateur ECU</div>
      <p className="manager-desc">Ces types apparaissent dans les filtres de la boutique et dans le formulaire d'ajout de fichiers.</p>
      <div className="manager-add-row">
        <input className="manager-input" placeholder="Nouveau type (ex: ECU Turbo)"
          value={newType} onChange={e=>setNewType(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&add()}/>
        <button className="manager-add-btn" onClick={add}><PlusIcon /> Ajouter</button>
      </div>
      <div className="manager-list">
        {ecuTypes.map((type, idx) => (
          <div key={idx} className="manager-item">
            {editIdx === idx ? (
              <div className="manager-edit-row">
                <input className="manager-input" value={editValue}
                  onChange={e=>setEditValue(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&saveEdit()} autoFocus/>
                <button className="manager-save-btn" onClick={saveEdit}>Sauvegarder</button>
                <button className="manager-cancel-btn" onClick={()=>setEditIdx(null)}>Annuler</button>
              </div>
            ) : (
              <>
                <div className="manager-item-text">
                  <span className="manager-item-num">{idx+1}</span>{type}
                </div>
                <div className="manager-item-actions">
                  <button className="manager-edit-btn" onClick={()=>startEdit(idx)}><EditIcon /></button>
                  <button className="manager-del-btn"  onClick={()=>remove(idx)}><TrashIcon /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// BRANDS MANAGER
// ─────────────────────────────────────────────────────────────────
function BrandsManager({ brands, setBrands }) {
  const [selBrand,  setSelBrand]  = useState("");
  const [selModel,  setSelModel]  = useState("");
  const [activeTab, setActiveTab] = useState("brands");
  const [newBrand,  setNewBrand]  = useState("");
  const [newModel,  setNewModel]  = useState("");
  const [newYears,  setNewYears]  = useState("");
  const [newDisp,   setNewDisp]   = useState("");
  const [newFuel,   setNewFuel]   = useState("Diesel");
  const [newPower,  setNewPower]  = useState("");
  const [newEcuBrd, setNewEcuBrd] = useState("Bosch");

  const brandList = Object.keys(brands).sort();
  const modelList = selBrand && brands[selBrand] ? Object.keys(brands[selBrand].models).sort() : [];
  const engines   = selBrand && selModel && brands[selBrand]?.models[selModel]
    ? brands[selBrand].models[selModel].engines : [];

  const addBrand = () => {
    const v = newBrand.trim();
    if (!v || brands[v]) { if(brands[v]) alert("Marque déjà existante."); return; }
    setBrands(p => ({ ...p, [v]: { models:{} } }));
    setNewBrand(""); setSelBrand(v); setActiveTab("models");
  };
  const delBrand = (b) => {
    if (!confirm(`Supprimer "${b}" et tous ses modèles ?`)) return;
    setBrands(p => { const n={...p}; delete n[b]; return n; });
    if (selBrand===b) { setSelBrand(""); setSelModel(""); }
  };
  const addModel = () => {
    const v = newModel.trim();
    if (!v || !selBrand) return;
    if (brands[selBrand]?.models[v]) { alert("Modèle déjà existant."); return; }
    setBrands(p => ({ ...p, [selBrand]: { ...p[selBrand],
      models: { ...p[selBrand].models, [v]: { years: newYears||"N/A", engines:[] } }
    }}));
    setNewModel(""); setNewYears(""); setSelModel(v); setActiveTab("engines");
  };
  const delModel = (m) => {
    if (!confirm(`Supprimer "${m}" ?`)) return;
    setBrands(p => { const mods={...p[selBrand].models}; delete mods[m];
      return { ...p, [selBrand]: { ...p[selBrand], models:mods } }; });
    if (selModel===m) setSelModel("");
  };
  const addEngine = () => {
    if (!newDisp.trim()||!newPower.trim()||!selBrand||!selModel) return;
    const eng = { displacement:newDisp.trim(), fuel:newFuel, power:newPower.trim(), ecuBrand:newEcuBrd, refs:[] };
    setBrands(p => ({ ...p, [selBrand]: { ...p[selBrand], models: { ...p[selBrand].models,
      [selModel]: { ...p[selBrand].models[selModel],
        engines: [...(p[selBrand].models[selModel].engines||[]), eng] }
    }}}));
    setNewDisp(""); setNewPower("");
  };
  const delEngine = (idx) => {
    if (!confirm("Supprimer cette motorisation ?")) return;
    setBrands(p => ({ ...p, [selBrand]: { ...p[selBrand], models: { ...p[selBrand].models,
      [selModel]: { ...p[selBrand].models[selModel],
        engines: p[selBrand].models[selModel].engines.filter((_,i)=>i!==idx) }
    }}}));
  };

  return (
    <div className="manager-section">
      <div className="manager-title">Catalogue automobile</div>
      <p className="manager-desc">Gérez les marques, modèles et motorisations disponibles dans la boutique.</p>

      <div className="sub-tabs">
        <button className={`sub-tab ${activeTab==="brands"?"active":""}`} onClick={()=>setActiveTab("brands")}>
          Marques ({brandList.length})
        </button>
        <button className={`sub-tab ${activeTab==="models"?"active":""}`}
          onClick={()=>setActiveTab("models")} disabled={!selBrand}>
          Modèles {selBrand?`— ${selBrand}`:""}
        </button>
        <button className={`sub-tab ${activeTab==="engines"?"active":""}`}
          onClick={()=>setActiveTab("engines")} disabled={!selModel}>
          Motorisations {selModel?`— ${selModel}`:""}
        </button>
      </div>

      {/* BRANDS */}
      {activeTab==="brands" && <>
        <div className="manager-add-row">
          <input className="manager-input" placeholder="Nouvelle marque (ex: Tesla)"
            value={newBrand} onChange={e=>setNewBrand(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&addBrand()}/>
          <button className="manager-add-btn" onClick={addBrand}><PlusIcon /> Ajouter</button>
        </div>
        <div className="manager-list">
          {brandList.map(b => (
            <div key={b} className={`manager-item ${selBrand===b?"selected":""}`}>
              <div className="manager-item-text" style={{cursor:"pointer"}}
                onClick={()=>{setSelBrand(b);setSelModel("");setActiveTab("models");}}>
                <span className="manager-item-brand">{b}</span>
                <span className="manager-item-count">
                  {Object.keys(brands[b]?.models||{}).length} modèle{Object.keys(brands[b]?.models||{}).length!==1?"s":""}
                </span>
              </div>
              <div className="manager-item-actions">
                <button className="manager-nav-btn"
                  onClick={()=>{setSelBrand(b);setSelModel("");setActiveTab("models");}}>Modèles →</button>
                <button className="manager-del-btn" onClick={()=>delBrand(b)}><TrashIcon /></button>
              </div>
            </div>
          ))}
        </div>
      </>}

      {/* MODELS */}
      {activeTab==="models" && selBrand && <>
        <div className="manager-breadcrumb">
          <button onClick={()=>setActiveTab("brands")} className="breadcrumb-btn">Marques</button>
          <span>→</span>
          <span className="breadcrumb-current">{selBrand}</span>
        </div>
        <div className="manager-add-row">
          <input className="manager-input" placeholder="Nom du modèle (ex: Model 3)"
            value={newModel} onChange={e=>setNewModel(e.target.value)} style={{flex:2}}/>
          <input className="manager-input" placeholder="Années (ex: 2017-présent)"
            value={newYears} onChange={e=>setNewYears(e.target.value)} style={{flex:1}}/>
          <button className="manager-add-btn" onClick={addModel}><PlusIcon /> Ajouter</button>
        </div>
        <div className="manager-list">
          {modelList.length===0 && <p className="manager-empty">Aucun modèle — ajoutez-en un ci-dessus</p>}
          {modelList.map(m => (
            <div key={m} className={`manager-item ${selModel===m?"selected":""}`}>
              <div className="manager-item-text" style={{cursor:"pointer"}}
                onClick={()=>{setSelModel(m);setActiveTab("engines");}}>
                <span className="manager-item-brand">{m}</span>
                <span className="manager-item-count">
                  {brands[selBrand]?.models[m]?.years} ·{" "}
                  {brands[selBrand]?.models[m]?.engines?.length||0} moteur{brands[selBrand]?.models[m]?.engines?.length!==1?"s":""}
                </span>
              </div>
              <div className="manager-item-actions">
                <button className="manager-nav-btn"
                  onClick={()=>{setSelModel(m);setActiveTab("engines");}}>Moteurs →</button>
                <button className="manager-del-btn" onClick={()=>delModel(m)}><TrashIcon /></button>
              </div>
            </div>
          ))}
        </div>
      </>}

      {/* ENGINES */}
      {activeTab==="engines" && selBrand && selModel && <>
        <div className="manager-breadcrumb">
          <button onClick={()=>setActiveTab("brands")} className="breadcrumb-btn">Marques</button>
          <span>→</span>
          <button onClick={()=>setActiveTab("models")} className="breadcrumb-btn">{selBrand}</button>
          <span>→</span>
          <span className="breadcrumb-current">{selModel}</span>
        </div>
        <div className="engine-add-grid">
          <div className="form-field"><label>Cylindrée *</label>
            <input className="manager-input" placeholder="ex: 1.6 TDI"
              value={newDisp} onChange={e=>setNewDisp(e.target.value)}/></div>
          <div className="form-field"><label>Carburant</label>
            <select className="manager-input" value={newFuel} onChange={e=>setNewFuel(e.target.value)}>
              <option>Diesel</option><option>Essence</option><option>Hybride</option>
            </select></div>
          <div className="form-field"><label>Puissance *</label>
            <input className="manager-input" placeholder="ex: 110ch"
              value={newPower} onChange={e=>setNewPower(e.target.value)}/></div>
          <div className="form-field"><label>Fabricant ECU</label>
            <select className="manager-input" value={newEcuBrd} onChange={e=>setNewEcuBrd(e.target.value)}>
              {["Bosch","Siemens","Delphi","Denso","Continental","Marelli"].map(b=><option key={b}>{b}</option>)}
            </select></div>
        </div>
        <button className="manager-add-btn" style={{marginBottom:16}} onClick={addEngine}>
          <PlusIcon /> Ajouter cette motorisation
        </button>
        <div className="engine-list">
          {engines.length===0 && <p className="manager-empty">Aucune motorisation — ajoutez-en une ci-dessus</p>}
          {engines.map((e,idx) => (
            <div key={idx} className="engine-item">
              <div className="engine-item-info">
                <span className="engine-disp">{e.displacement}</span>
                <span className={`engine-fuel ${e.fuel==="Diesel"?"diesel":"essence"}`}>{e.fuel}</span>
                <span className="engine-power">{e.power}</span>
                <span className="engine-brand">{e.ecuBrand}</span>
              </div>
              <button className="manager-del-btn" onClick={()=>delEngine(idx)}><TrashIcon /></button>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// UPLOAD FORM
// ─────────────────────────────────────────────────────────────────
function UploadForm({ brands, ecuTypes, onAdd, onCancel }) {
  const [brand,     setBrand]     = useState("");
  const [model,     setModel]     = useState("");
  const [engineIdx, setEngineIdx] = useState("");
  const [calcType,  setCalcType]  = useState(ecuTypes[0]||"");
  const [ecuRef,    setEcuRef]    = useState("");
  const [file,      setFile]      = useState(null);
  const [saving,    setSaving]    = useState(false);

  const modelList = brand && brands[brand] ? Object.keys(brands[brand].models) : [];
  const engines   = brand && model && brands[brand]?.models[model]
    ? brands[brand].models[model].engines : [];
  const selEng    = engines[parseInt(engineIdx)];
  const engLabel  = selEng ? `${selEng.displacement} — ${selEng.fuel} ${selEng.power}` : "";
  const refs      = selEng ? (selEng.refs||[]).slice(0,6) : [];
  const autoKey   = brand&&model&&engLabel&&ecuRef&&calcType
    ? generateS3Key(brand,model,engLabel,ecuRef,calcType) : "";

  const submit = async () => {
    if (!brand||!model||!selEng||!ecuRef||!file) {
      alert("Remplissez tous les champs et sélectionnez un fichier."); return;
    }
    setSaving(true);
    await new Promise(r=>setTimeout(r,700));
    onAdd({ id:Date.now(), brand, model, engineLabel:engLabel, fuel:selEng.fuel,
      calcType, ecuRef, includes:["Fichier .bin original","Logiciel de flash","Guide PDF"], s3Key:autoKey });
    setSaving(false);
  };

  return (
    <div className="upload-form">
      <div className="upload-form-title">Ajouter un fichier ECU</div>
      <div className="form-section-label">1. Véhicule</div>
      <div className="form-grid-3">
        <div className="form-field"><label>Marque *</label>
          <select value={brand} onChange={e=>{setBrand(e.target.value);setModel("");setEngineIdx("");setEcuRef("");}}>
            <option value="">Choisir…</option>
            {Object.keys(brands).sort().map(b=><option key={b}>{b}</option>)}
          </select></div>
        <div className="form-field"><label>Modèle *</label>
          <select value={model} onChange={e=>{setModel(e.target.value);setEngineIdx("");setEcuRef("");}} disabled={!brand}>
            <option value="">Choisir…</option>
            {modelList.map(m=><option key={m}>{m}</option>)}
          </select>
          {brand&&model&&brands[brand]?.models[model]&&(
            <span className="field-hint">{brands[brand].models[model].years}</span>)}
        </div>
        <div className="form-field"><label>Motorisation *</label>
          <select value={engineIdx} onChange={e=>{setEngineIdx(e.target.value);setEcuRef("");}} disabled={!model}>
            <option value="">Choisir…</option>
            {engines.map((e,i)=><option key={i} value={i}>{e.displacement} — {e.fuel} {e.power}</option>)}
          </select></div>
      </div>
      <div className="form-section-label">2. Calculateur</div>
      <div className="form-grid-2">
        <div className="form-field"><label>Type d'ECU *</label>
          <select value={calcType} onChange={e=>setCalcType(e.target.value)}>
            {ecuTypes.map(t=><option key={t}>{t}</option>)}
          </select></div>
        <div className="form-field"><label>Référence ECU *</label>
          {refs.length>0?(
            <><select value={ecuRef} onChange={e=>setEcuRef(e.target.value)}>
              <option value="">Choisir…</option>{refs.map(r=><option key={r}>{r}</option>)}
            </select><span className="field-hint">Références connues pour ce moteur</span></>
          ):(
            <input placeholder="ex: Bosch EDC17C10" value={ecuRef} onChange={e=>setEcuRef(e.target.value)}/>
          )}</div>
      </div>
      <div className="form-section-label">3. Fichier</div>
      <div className="form-field"><label>Fichier ECU * (.bin, .zip, .hex)</label>
        <input type="file" accept=".bin,.hex,.zip,.rar"
          onChange={e=>setFile(e.target.files[0])} style={{padding:"6px 10px"}}/>
        {file&&<span className="field-hint">✓ {file.name}</span>}
      </div>
      {autoKey&&(
        <div className="s3-preview">
          <div className="s3-preview-label">Chemin S3 généré automatiquement</div>
          <div className="s3-preview-key">s3://ecu-originals/{autoKey}</div>
        </div>
      )}
      <div className="form-actions">
        <button className="cancel-btn" onClick={onCancel}>Annuler</button>
        <button className="save-btn" onClick={submit} disabled={saving}>
          {saving?"Publication…":"Publier"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────────────────────────
const SAMPLE_CATALOG = [
  { id:1, brand:"Peugeot",    model:"207",    engineLabel:"1.6 HDi — Diesel 90ch",  fuel:"Diesel",  calcType:"ECU Moteur (Injection)", ecuRef:"Siemens SID803",  s3Key:"peugeot/207/sid803.zip" },
  { id:2, brand:"Volkswagen", model:"Golf",   engineLabel:"2.0 TDI — Diesel 150ch", fuel:"Diesel",  calcType:"ECU Moteur (Injection)", ecuRef:"Bosch EDC17CP14", s3Key:"volkswagen/golf/edc17cp14.zip" },
  { id:3, brand:"Renault",    model:"Mégane", engineLabel:"1.5 dCi — Diesel 110ch", fuel:"Diesel",  calcType:"ECU Moteur (Injection)", ecuRef:"Siemens SID305",  s3Key:"renault/megane/sid305.zip" },
  { id:4, brand:"Peugeot",    model:"308",    engineLabel:"1.6 THP — Essence 150ch",fuel:"Essence", calcType:"ECU Moteur (Injection)", ecuRef:"Bosch MEV17.4",   s3Key:"peugeot/308/mev17.zip" },
];
const SAMPLE_USERS = [
  { id:1, name:"Rakoto Jean", email:"rakoto@gmail.com", provider:"google", downloads:5, joinedAt:"2026-02-10" },
  { id:2, name:"Rabe Marie",  email:"rabe@email.com",   provider:"email",  downloads:2, joinedAt:"2026-03-01" },
  { id:3, name:"Toto Alain",  email:"toto@email.com",   provider:"email",  downloads:8, joinedAt:"2026-01-15" },
];

function FuelBadge({ fuel }) {
  const d = fuel==="Diesel";
  return <span className="fuel-badge" style={{background:d?"#dbeafe":"#fef3c7",color:d?"#1e40af":"#b45309"}}>{fuel}</span>;
}

export default function Admin({ nav }) {
  const token = localStorage.getItem("ecu_admin_token");
  if (!token) { nav("admin-login"); return null; }

  const [tab,         setTab]         = useState("catalog");
  const [catalog,     setCatalog]     = useState(SAMPLE_CATALOG);
  const [showForm,    setShowForm]    = useState(false);
  const [filterBrand, setFilterBrand] = useState("");

  // Dynamic data — persisted in localStorage
  const [brands, setBrands] = useState(() => {
    try { const s = localStorage.getItem("ecu_admin_brands"); return s ? JSON.parse(s) : DB_BRANDS; } catch { return DB_BRANDS; }
  });
  const [ecuTypes, setEcuTypes] = useState(() => {
    try { const s = localStorage.getItem("ecu_admin_ecotypes"); return s ? JSON.parse(s) : DB_ECU_TYPES; } catch { return DB_ECU_TYPES; }
  });

  const updateBrands = (fn) => {
    setBrands(prev => {
      const next = typeof fn==="function" ? fn(prev) : fn;
      localStorage.setItem("ecu_admin_brands", JSON.stringify(next));
      return next;
    });
  };
  const updateEcuTypes = (fn) => {
    setEcuTypes(prev => {
      const next = typeof fn==="function" ? fn(prev) : fn;
      localStorage.setItem("ecu_admin_ecotypes", JSON.stringify(next));
      return next;
    });
  };

  const logout    = () => { localStorage.removeItem("ecu_admin_token"); nav("shop"); };
  const displayed = filterBrand ? catalog.filter(f=>f.brand===filterBrand) : catalog;
  const totalModels = Object.values(brands).reduce((a,b)=>a+Object.keys(b.models||{}).length,0);

  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <div>
          <h1 className="admin-title">Administration ECU Shop</h1>
          <p className="admin-sub">
            {Object.keys(brands).length} marques · {totalModels} modèles · {ecuTypes.length} types d'ECU
          </p>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button className="nav-btn" onClick={()=>nav("shop")}>← Boutique</button>
          <button className="logout-btn" onClick={logout}>Déconnexion</button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card"><div className="stat-num">{catalog.length}</div><div className="stat-lbl">Fichiers</div></div>
        <div className="stat-card"><div className="stat-num blue">{SAMPLE_USERS.length}</div><div className="stat-lbl">Utilisateurs</div></div>
        <div className="stat-card"><div className="stat-num amber">{SAMPLE_USERS.reduce((a,u)=>a+u.downloads,0)}</div><div className="stat-lbl">Téléchargements</div></div>
        <div className="stat-card"><div className="stat-num green">0 €</div><div className="stat-lbl">Revenus</div></div>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${tab==="catalog" ?"active":""}`} onClick={()=>setTab("catalog")}>Fichiers ECU</button>
        <button className={`admin-tab ${tab==="brands"  ?"active":""}`} onClick={()=>setTab("brands")}>Marques & Modèles</button>
        <button className={`admin-tab ${tab==="ecutypes"?"active":""}`} onClick={()=>setTab("ecutypes")}>Types d'ECU</button>
        <button className={`admin-tab ${tab==="users"   ?"active":""}`} onClick={()=>setTab("users")}>Utilisateurs</button>
      </div>

      {/* CATALOG */}
      {tab==="catalog" && <>
        <div className="table-toolbar">
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div className="table-title">Catalogue ({displayed.length} fichiers)</div>
            <select className="toolbar-select" value={filterBrand} onChange={e=>setFilterBrand(e.target.value)}>
              <option value="">Toutes les marques</option>
              {Object.keys(brands).sort().map(b=><option key={b}>{b}</option>)}
            </select>
          </div>
          <button className="add-btn" onClick={()=>setShowForm(s=>!s)}>
            {showForm?"Fermer":"+ Ajouter un fichier"}
          </button>
        </div>
        {showForm && <UploadForm brands={brands} ecuTypes={ecuTypes}
          onAdd={f=>{setCatalog(p=>[f,...p]);setShowForm(false);}} onCancel={()=>setShowForm(false)}/>}
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

      {/* BRANDS */}
      {tab==="brands"   && <BrandsManager  brands={brands}     setBrands={updateBrands}/>}

      {/* ECU TYPES */}
      {tab==="ecutypes" && <EcuTypesManager ecuTypes={ecuTypes} setEcuTypes={updateEcuTypes}/>}

      {/* USERS */}
      {tab==="users" && <>
        <div className="table-toolbar"><div className="table-title">Utilisateurs ({SAMPLE_USERS.length})</div></div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Nom</th><th>Email</th><th>Connexion</th><th>Téléchargements</th><th>Inscrit le</th></tr></thead>
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

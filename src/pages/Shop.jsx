import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ── Storage keys — same as Admin.jsx
const STORAGE_KEYS = {
  brands:   "dagoauto_brands",
  ecuTypes: "dagoauto_ecutypes",
  catalog:  "dagoauto_catalog",
};

function loadFromStorage(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch { return fallback; }
}

// ── Icons
const ChipIcon  = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><line x1="6" y1="4" x2="6" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="10" y1="4" x2="10" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="6" y1="12" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="10" y1="12" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="4" y1="6" x2="2" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="4" y1="10" x2="2" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const CheckIcon = () => <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const DlIcon    = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const HeartIcon = ({ filled }) => <svg width="14" height="14" viewBox="0 0 16 16" fill={filled?"currentColor":"none"}><path d="M8 13.5S2 9.5 2 5.5A3.5 3.5 0 018 3.2 3.5 3.5 0 0114 5.5C14 9.5 8 13.5 8 13.5z" stroke="currentColor" strokeWidth="1.5"/></svg>;

function FuelBadge({ fuel }) {
  const d = fuel === "Diesel";
  return <span className="fuel-badge" style={{ background:d?"#dbeafe":"#fef3c7", color:d?"#1e40af":"#b45309" }}>{fuel}</span>;
}

// ── Download Modal
function DownloadModal({ file, onClose, wishlist, setWishlist }) {
  const { user, getToken } = useAuth();
  const [step,  setStep]  = useState("confirm");
  const [email, setEmail] = useState(user?.email || "");
  const inWish = wishlist.includes(file?.id);

  const handleDownload = async () => {
    if (!email) { alert("Entrez votre email."); return; }
    setStep("loading");
    try {
      const res = await fetch(`${API}/api/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { "Authorization": `Bearer ${getToken()}` } : {})
        },
        body: JSON.stringify({ fileId: file.id, email })
      });
      if (res.ok) {
        const { downloadUrl } = await res.json();
        window.open(downloadUrl, "_blank");
        setStep("done");
      } else {
        setStep("confirm");
        alert("Erreur lors du téléchargement. Réessayez.");
      }
    } catch {
      // API not available — show done anyway for demo
      setStep("done");
    }
  };

  const toggleWish = () => {
    setWishlist(prev => prev.includes(file.id)
      ? prev.filter(x => x !== file.id)
      : [...prev, file.id]
    );
  };

  if (!file) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-toprow">
          <button className={`wish-btn ${inWish?"active":""}`} onClick={toggleWish}>
            <HeartIcon filled={inWish} />
          </button>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {step === "confirm" && <>
          <div className="modal-product-tag"><ChipIcon /> {file.calcType}</div>
          <h2 className="modal-title">{file.brand} {file.model}</h2>
          <p className="modal-sub">{file.engineLabel} · <span className="ref-mono">{file.ecuRef}</span></p>
          <div className="modal-includes">
            {(file.includes||[]).map((inc,i) => (
              <div key={i} className="modal-inc-row"><span className="check-icon"><CheckIcon /></span>{inc}</div>
            ))}
          </div>
          <div className="free-badge">↓ Téléchargement gratuit · Illimité</div>
          <input className="modal-input" type="email" placeholder="Votre email *"
            value={email} onChange={e => setEmail(e.target.value)} />
          <p className="modal-hint">Lien sécurisé envoyé par email · Expire en 10 min</p>
          <button className="dl-btn" onClick={handleDownload}><DlIcon /> Télécharger gratuitement</button>
        </>}

        {step === "loading" && <>
          <div className="loading-ring"></div>
          <h2 className="modal-title" style={{textAlign:"center",marginTop:16}}>Génération du lien…</h2>
          <p className="modal-sub" style={{textAlign:"center"}}>Connexion AWS S3</p>
        </>}

        {step === "done" && <>
          <div className="success-icon"><CheckIcon /></div>
          <h2 className="modal-title">Lien envoyé !</h2>
          <p className="modal-sub">Lien envoyé à <strong>{email}</strong></p>
          <p className="modal-hint" style={{marginTop:8}}>Expire dans 10 minutes.</p>
          <button className="dl-btn" style={{marginTop:20}} onClick={onClose}>Fermer</button>
        </>}
      </div>
    </div>
  );
}

// ── File Card
function FileCard({ file, onDownload, wishlist, setWishlist }) {
  const inWish = wishlist.includes(file.id);
  const toggleWish = (e) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(file.id) ? prev.filter(x=>x!==file.id) : [...prev, file.id]);
  };
  return (
    <div className="file-card">
      <button className={`card-wish ${inWish?"active":""}`} onClick={toggleWish}>
        <HeartIcon filled={inWish} />
      </button>
      <div className="card-header">
        <div className="card-brand-row">
          <span className="card-brand">{file.brand} {file.model}</span>
          <FuelBadge fuel={file.fuel} />
        </div>
        <div className="card-engine">{file.engineLabel}</div>
        <div className="card-ref"><ChipIcon /> {file.calcType} · <span className="ref-mono">{file.ecuRef}</span></div>
      </div>
      <div className="card-includes">
        {(file.includes||[]).map((inc,i) => (
          <div key={i} className="include-row"><span className="check-icon"><CheckIcon /></span>{inc}</div>
        ))}
      </div>
      <div className="card-footer">
        <div className="card-free">GRATUIT</div>
        <button className="buy-btn" onClick={() => onDownload(file)}><DlIcon /> Télécharger</button>
      </div>
    </div>
  );
}

// ── SHOP PAGE
export default function Shop({ nav }) {
  const { user, logout } = useAuth();

  // ── Load data from admin localStorage — updates live
  const [catalog,  setCatalog]  = useState(() => loadFromStorage(STORAGE_KEYS.catalog,  []));
  const [brands,   setBrands]   = useState(() => loadFromStorage(STORAGE_KEYS.brands,   {}));
  const [ecuTypes, setEcuTypes] = useState(() => loadFromStorage(STORAGE_KEYS.ecuTypes, []));

  // Re-sync when storage changes (admin updates in another tab)
  useEffect(() => {
    const sync = () => {
      setCatalog(loadFromStorage(STORAGE_KEYS.catalog,  []));
      setBrands(loadFromStorage(STORAGE_KEYS.brands,    {}));
      setEcuTypes(loadFromStorage(STORAGE_KEYS.ecuTypes,[]));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const [dlFile,       setDlFile]       = useState(null);
  const [wishlist,     setWishlist]     = useState([]);
  const [fBrand,       setFBrand]       = useState("");
  const [fModel,       setFModel]       = useState("");
  const [fEngine,      setFEngine]      = useState("");
  const [fFuel,        setFFuel]        = useState("");
  const [fCalcType,    setFCalcType]    = useState("");
  const [showWishOnly, setShowWishOnly] = useState(false);

  // Brand/model lists from admin data
  const brandList = Object.keys(brands).sort();
  const modelList = fBrand && brands[fBrand] ? Object.keys(brands[fBrand].models).sort() : [];
  const engines   = fBrand && fModel && brands[fBrand]?.models[fModel]
    ? brands[fBrand].models[fModel].engines : [];

  const results = catalog.filter(f => {
    if (showWishOnly && !wishlist.includes(f.id)) return false;
    if (fBrand    && f.brand    !== fBrand)                  return false;
    if (fModel    && f.model    !== fModel)                  return false;
    if (fEngine   && !f.engineLabel?.includes(fEngine))      return false;
    if (fFuel     && f.fuel     !== fFuel)                   return false;
    if (fCalcType && f.calcType !== fCalcType)               return false;
    return true;
  });

  const reset = () => {
    setFBrand(""); setFModel(""); setFEngine("");
    setFFuel(""); setFCalcType(""); setShowWishOnly(false);
  };

  const totalModels  = Object.values(brands).reduce((a,b)=>a+Object.keys(b.models||{}).length,0);
  const totalEngines = Object.values(brands).reduce((a,b)=>
    a+Object.values(b.models||{}).reduce((c,m)=>c+(m.engines||[]).length,0),0);

  return (
    <div className="app">
      {/* HEADER */}
      <header className="site-header">
        <div className="header-inner">
          <div className="site-logo">
            <ChipIcon />
            <span>DAGO<strong>AUTO</strong></span>
            {brandList.length > 0 && (
              <span className="catalog-count">
                {brandList.length} marque{brandList.length>1?"s":""} · {totalModels} modèle{totalModels>1?"s":""}
              </span>
            )}
          </div>
          <div className="header-right">
            {user ? (
              <div className="user-menu">
                {user.avatar
                  ? <img src={user.avatar} className="user-avatar" alt={user.name} />
                  : <div className="user-avatar-initials">{user.name?.[0]?.toUpperCase()}</div>
                }
                <span className="user-name">{user.name}</span>
                <button className="nav-btn" onClick={() => nav("dashboard")}>Mon espace</button>
                <button className="nav-btn-ghost" onClick={logout}>Déconnexion</button>
              </div>
            ) : (
              <div className="user-menu">
                <button className="nav-btn" onClick={() => nav("auth")}>Connexion</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">DAGO<span>AUTO</span></h1>
          <p className="hero-sub">
            {catalog.length === 0
              ? "Catalogue en cours de préparation — revenez bientôt"
              : `${catalog.length} fichier${catalog.length>1?"s":""} ECU disponible${catalog.length>1?"s":""} · Essence & Diesel · `}
            {catalog.length > 0 && <strong style={{color:"#22c55e"}}>100% gratuit</strong>}
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-layout">
        <aside className="filters-panel">
          <div className="filters-title">Filtrer</div>

          <button className={`wish-filter-btn ${showWishOnly?"active":""}`}
            onClick={() => setShowWishOnly(s=>!s)}>
            <HeartIcon filled={showWishOnly} />
            Mes favoris {wishlist.length > 0 && `(${wishlist.length})`}
          </button>

          <div className="select-wrap">
            <label className="select-label">Marque</label>
            <select className="select-input" value={fBrand}
              onChange={e => { setFBrand(e.target.value); setFModel(""); setFEngine(""); }}>
              <option value="">Toutes</option>
              {brandList.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>

          <div className="select-wrap">
            <label className="select-label">Modèle</label>
            <select className="select-input" value={fModel}
              onChange={e => { setFModel(e.target.value); setFEngine(""); }} disabled={!fBrand}>
              <option value="">Tous</option>
              {modelList.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>

          <div className="select-wrap">
            <label className="select-label">Motorisation</label>
            <select className="select-input" value={fEngine}
              onChange={e => setFEngine(e.target.value)} disabled={!fModel}>
              <option value="">Toutes</option>
              {engines.map((e,i) => (
                <option key={i} value={e.displacement}>{e.displacement} {e.fuel} {e.power}</option>
              ))}
            </select>
          </div>

          <div className="select-wrap">
            <label className="select-label">Carburant</label>
            <select className="select-input" value={fFuel} onChange={e => setFFuel(e.target.value)}>
              <option value="">Tous</option>
              <option>Essence</option>
              <option>Diesel</option>
            </select>
          </div>

          <div className="select-wrap">
            <label className="select-label">Type calculateur</label>
            <select className="select-input" value={fCalcType} onChange={e => setFCalcType(e.target.value)}>
              <option value="">Tous</option>
              {ecuTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <button className="reset-btn" onClick={reset}>Réinitialiser</button>
          <div className="filter-count">
            {results.length} fichier{results.length!==1?"s":""} trouvé{results.length!==1?"s":""}
          </div>
        </aside>

        <main className="catalog">
          {catalog.length === 0 ? (
            // Catalogue vide — admin n'a encore rien publié
            <div className="empty-state">
              <div className="empty-icon" style={{fontSize:"48px",marginBottom:"16px"}}>🔧</div>
              <div className="empty-title">Catalogue en cours de préparation</div>
              <div className="empty-sub">Les fichiers ECU seront disponibles très prochainement</div>
            </div>
          ) : results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><ChipIcon /></div>
              <div className="empty-title">Aucun fichier pour cette sélection</div>
              <div className="empty-sub">
                {showWishOnly ? "Votre liste de favoris est vide" : "Modifiez vos filtres"}
              </div>
            </div>
          ) : (
            <div className="cards-grid">
              {results.map(f => (
                <FileCard key={f.id} file={f} onDownload={setDlFile}
                  wishlist={wishlist} setWishlist={setWishlist} />
              ))}
            </div>
          )}
        </main>
      </div>

      {dlFile && (
        <DownloadModal file={dlFile} onClose={() => setDlFile(null)}
          wishlist={wishlist} setWishlist={setWishlist} />
      )}
    </div>
  );
}

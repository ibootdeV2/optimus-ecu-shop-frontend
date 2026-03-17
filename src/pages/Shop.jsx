import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  BRANDS, ECU_TYPES, getBrandList, getModelList,
  getEngineList, CATALOG_STATS
} from "../carDatabase";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ── Sample catalog (replaced by API in production)
const SAMPLE_CATALOG = [
  { id:1, brand:"Peugeot",    model:"207",    engineLabel:"1.6 HDi — Diesel 90ch",  fuel:"Diesel",  calcType:"ECU Moteur (Injection)", ecuRef:"Siemens SID803",  includes:["Fichier .bin original","Logiciel de flash","Guide PDF"], s3Key:"peugeot/207/1-6-hdi-diesel-90ch_siemens-sid803.zip" },
  { id:2, brand:"Peugeot",    model:"308",    engineLabel:"2.0 HDi — Diesel 136ch", fuel:"Diesel",  calcType:"ECU Moteur (Injection)", ecuRef:"Bosch EDC17C10",  includes:["Fichier .bin original","MPPS v21","Guide PDF"],           s3Key:"peugeot/308/2-0-hdi-diesel-136ch_bosch-edc17c10.zip" },
  { id:3, brand:"Volkswagen", model:"Golf",   engineLabel:"2.0 TDI — Diesel 150ch", fuel:"Diesel",  calcType:"ECU Moteur (Injection)", ecuRef:"Bosch EDC17CP14", includes:["Fichier .bin original","MPPS v21","Guide PDF"],           s3Key:"volkswagen/golf/2-0-tdi-diesel-150ch_bosch-edc17cp14.zip" },
  { id:4, brand:"BMW",        model:"Série 3",engineLabel:"2.0d — Diesel 143ch",    fuel:"Diesel",  calcType:"ECU Moteur (Injection)", ecuRef:"Bosch EDC17C41",  includes:["Fichier .bin original","WinOLS Lite","Guide PDF"],        s3Key:"bmw/serie-3/2-0d-diesel-143ch_bosch-edc17c41.zip" },
  { id:5, brand:"Renault",    model:"Mégane", engineLabel:"1.5 dCi — Diesel 110ch", fuel:"Diesel",  calcType:"ECU Moteur (Injection)", ecuRef:"Siemens SID305",  includes:["Fichier .bin original","KSuite","Guide PDF"],             s3Key:"renault/megane/1-5-dci-diesel-110ch_siemens-sid305.zip" },
  { id:6, brand:"Citroën",    model:"C4",     engineLabel:"1.6 HDi — Diesel 110ch", fuel:"Diesel",  calcType:"ECU Moteur (Injection)", ecuRef:"Siemens SID803",  includes:["Fichier .bin original","WinOLS Lite","Guide PDF"],        s3Key:"citroen/c4/1-6-hdi-diesel-110ch_siemens-sid803.zip" },
  { id:7, brand:"Audi",       model:"A4",     engineLabel:"2.0 TDI — Diesel 143ch", fuel:"Diesel",  calcType:"ECU Moteur (Injection)", ecuRef:"Bosch EDC17CP14", includes:["Fichier .bin original","MPPS v21","Guide PDF"],           s3Key:"audi/a4/2-0-tdi-diesel-143ch_bosch-edc17cp14.zip" },
  { id:8, brand:"Peugeot",    model:"308",    engineLabel:"1.6 THP — Essence 150ch",fuel:"Essence", calcType:"ECU Moteur (Injection)", ecuRef:"Bosch MEV17.4",   includes:["Fichier .bin original","WinOLS Lite","Guide PDF"],        s3Key:"peugeot/308/1-6-thp-essence-150ch_bosch-mev17-4.zip" },
  { id:9, brand:"Mercedes-Benz",model:"Classe C",engineLabel:"2.2 CDI — Diesel 136ch",fuel:"Diesel",calcType:"ECU Moteur (Injection)",ecuRef:"Bosch EDC16C31",   includes:["Fichier .bin original","WinOLS Lite","Guide PDF"],        s3Key:"mercedes/classe-c/2-2-cdi-diesel-136ch_bosch-edc16c31.zip" },
  { id:10,brand:"Toyota",     model:"RAV4",   engineLabel:"2.2 D-4D — Diesel 136ch",fuel:"Diesel",  calcType:"ECU Moteur (Injection)", ecuRef:"Denso 89661",     includes:["Fichier .bin original","WinOLS Lite","Guide PDF"],        s3Key:"toyota/rav4/2-2-d-4d-diesel-136ch_denso-89661.zip" },
  { id:11,brand:"Ford",       model:"Focus",  engineLabel:"1.6 TDCi — Diesel 95ch", fuel:"Diesel",  calcType:"ECU Moteur (Injection)", ecuRef:"Delphi DCM3.4",   includes:["Fichier .bin original","MPPS v21","Guide PDF"],           s3Key:"ford/focus/1-6-tdci-diesel-95ch_delphi-dcm3-4.zip" },
  { id:12,brand:"Opel / Vauxhall",model:"Astra",engineLabel:"2.0 CDTi — Diesel 130ch",fuel:"Diesel",calcType:"ECU Moteur (Injection)",ecuRef:"Bosch EDC17C19",   includes:["Fichier .bin original","WinOLS Lite","Guide PDF"],        s3Key:"opel/astra/2-0-cdti-diesel-130ch_bosch-edc17c19.zip" },
];

// ── Icons
const ChipIcon = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><line x1="6" y1="4" x2="6" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="10" y1="4" x2="10" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="6" y1="12" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="10" y1="12" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="4" y1="6" x2="2" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="4" y1="10" x2="2" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const CheckIcon = () => <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const DlIcon = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const HeartIcon = ({ filled }) => <svg width="14" height="14" viewBox="0 0 16 16" fill={filled?"currentColor":"none"}><path d="M8 13.5S2 9.5 2 5.5A3.5 3.5 0 018 3.2 3.5 3.5 0 0114 5.5C14 9.5 8 13.5 8 13.5z" stroke="currentColor" strokeWidth="1.5"/></svg>;

function FuelBadge({ fuel }) {
  const d = fuel === "Diesel";
  return <span className="fuel-badge" style={{ background:d?"#dbeafe":"#fef3c7", color:d?"#1e40af":"#b45309" }}>{fuel}</span>;
}

// ── Download Modal
function DownloadModal({ file, onClose, wishlist, setWishlist }) {
  const { user, getToken } = useAuth();
  const [step, setStep] = useState("confirm");
  const [email, setEmail] = useState(user?.email || "");
  const inWish = wishlist.includes(file?.id);

  const handleDownload = async () => {
    if (!email) { alert("Entrez votre email."); return; }
    setStep("loading");
    try {
      // In production: GET /api/download/:fileId
      // Headers: Authorization: Bearer <token>
      // Returns: { downloadUrl } — signed S3 URL
      await new Promise(r => setTimeout(r, 1200));

      // Log download in user history if logged in
      if (user) {
        // POST /api/user/downloads { fileId }
      }
      setStep("done");
    } catch {
      setStep("confirm");
      alert("Erreur. Réessayez.");
    }
  };

  const toggleWish = () => {
    setWishlist(prev => prev.includes(file.id)
      ? prev.filter(x => x !== file.id)
      : [...prev, file.id]
    );
    // In production: POST /api/user/wishlist { fileId, action: add/remove }
  };

  if (!file) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-toprow">
          <button className={`wish-btn ${inWish?"active":""}`} onClick={toggleWish} title="Ajouter aux favoris">
            <HeartIcon filled={inWish} />
          </button>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {step === "confirm" && <>
          <div className="modal-product-tag"><ChipIcon /> {file.calcType}</div>
          <h2 className="modal-title">{file.brand} {file.model}</h2>
          <p className="modal-sub">{file.engineLabel} · <span className="ref-mono">{file.ecuRef}</span></p>
          <div className="modal-includes">
            {file.includes.map((inc,i) => (
              <div key={i} className="modal-inc-row"><span className="check-icon"><CheckIcon /></span>{inc}</div>
            ))}
          </div>
          <div className="free-badge">↓ Téléchargement gratuit · Illimité</div>
          {!user && (
            <p className="modal-login-hint">
              <span>💡</span> Connectez-vous pour sauvegarder votre historique
            </p>
          )}
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
          {/* PAYPAL PLACEHOLDER — décommenter quand compte PayPal prêt */}
          {/* <div className="paypal-section">
            <p>Version payante : {file.price} €</p>
            <PayPalButtons createOrder={...} onApprove={...} />
          </div> */}
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
        {file.includes.map((inc,i) => (
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
  const [dlFile, setDlFile]     = useState(null);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ecu_wishlist") || "[]"); } catch { return []; }
  });
  const [fBrand, setFBrand]     = useState("");
  const [fModel, setFModel]     = useState("");
  const [fEngine, setFEngine]   = useState("");
  const [fFuel, setFFuel]       = useState("");
  const [fCalcType, setFCalcType] = useState("");
  const [showWishOnly, setShowWishOnly] = useState(false);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem("ecu_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const engines = getEngineList(fBrand, fModel);

  const results = SAMPLE_CATALOG.filter(f => {
    if (showWishOnly && !wishlist.includes(f.id)) return false;
    if (fBrand && f.brand !== fBrand) return false;
    if (fModel && f.model !== fModel) return false;
    if (fEngine && !f.engineLabel.includes(fEngine)) return false;
    if (fFuel && f.fuel !== fFuel) return false;
    if (fCalcType && f.calcType !== fCalcType) return false;
    return true;
  });

  const reset = () => { setFBrand(""); setFModel(""); setFEngine(""); setFFuel(""); setFCalcType(""); setShowWishOnly(false); };

  return (
    <div className="app">
      {/* ── HEADER */}
      <header className="site-header">
        <div className="header-inner">
          <div className="site-logo">
            <ChipIcon />
            <span>ECU<strong>Original</strong></span>
            <span className="catalog-count">{CATALOG_STATS.totalBrands} marques · {CATALOG_STATS.totalModels} modèles</span>
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
            <button className="admin-link" onClick={() => nav("admin-login")}>🔒 Admin</button>
          </div>
        </div>
      </header>

      {/* ── HERO */}
      <div className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Fichiers ECU <span>Originaux</span></h1>
          <p className="hero-sub">
            {CATALOG_STATS.totalBrands} marques · {CATALOG_STATS.totalModels} modèles · {CATALOG_STATS.totalEngines} motorisations
            &nbsp;· Essence &amp; Diesel · <strong style={{color:"#22c55e"}}>100% gratuit</strong>
          </p>
        </div>
      </div>

      {/* ── MAIN */}
      <div className="main-layout">
        <aside className="filters-panel">
          <div className="filters-title">Filtrer</div>

          {/* Wishlist toggle */}
          <button
            className={`wish-filter-btn ${showWishOnly?"active":""}`}
            onClick={() => setShowWishOnly(s=>!s)}
          >
            <HeartIcon filled={showWishOnly} />
            Mes favoris {wishlist.length > 0 && `(${wishlist.length})`}
          </button>

          <div className="select-wrap">
            <label className="select-label">Marque</label>
            <select className="select-input" value={fBrand} onChange={e=>{setFBrand(e.target.value);setFModel("");setFEngine("");}}>
              <option value="">Toutes</option>
              {getBrandList().map(b=><option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="select-wrap">
            <label className="select-label">Modèle</label>
            <select className="select-input" value={fModel} onChange={e=>{setFModel(e.target.value);setFEngine("");}} disabled={!fBrand}>
              <option value="">Tous</option>
              {getModelList(fBrand).map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="select-wrap">
            <label className="select-label">Motorisation</label>
            <select className="select-input" value={fEngine} onChange={e=>setFEngine(e.target.value)} disabled={!fModel}>
              <option value="">Toutes</option>
              {engines.map((e,i)=><option key={i} value={e.displacement}>{e.displacement} {e.fuel} {e.power}</option>)}
            </select>
          </div>
          <div className="select-wrap">
            <label className="select-label">Carburant</label>
            <select className="select-input" value={fFuel} onChange={e=>setFFuel(e.target.value)}>
              <option value="">Tous</option><option>Essence</option><option>Diesel</option>
            </select>
          </div>
          <div className="select-wrap">
            <label className="select-label">Type calculateur</label>
            <select className="select-input" value={fCalcType} onChange={e=>setFCalcType(e.target.value)}>
              <option value="">Tous</option>
              {ECU_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <button className="reset-btn" onClick={reset}>Réinitialiser</button>
          <div className="filter-count">{results.length} fichier{results.length!==1?"s":""} trouvé{results.length!==1?"s":""}</div>
        </aside>

        <main className="catalog">
          {results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><ChipIcon /></div>
              <div className="empty-title">Aucun fichier trouvé</div>
              <div className="empty-sub">{showWishOnly ? "Votre liste de favoris est vide" : "Modifiez vos filtres"}</div>
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

      {dlFile && <DownloadModal file={dlFile} onClose={()=>setDlFile(null)} wishlist={wishlist} setWishlist={setWishlist} />}
    </div>
  );
}

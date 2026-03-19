import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Sample history — replaced by API GET /api/user/downloads
const SAMPLE_HISTORY = [
  { id:1, brand:"Peugeot",    model:"207",    engineLabel:"1.6 HDi — Diesel 90ch",  ecuRef:"Siemens SID803",  downloadedAt:"2026-03-10T14:23:00Z", count:2 },
  { id:2, brand:"Volkswagen", model:"Golf",   engineLabel:"2.0 TDI — Diesel 150ch", ecuRef:"Bosch EDC17CP14", downloadedAt:"2026-03-08T09:11:00Z", count:1 },
  { id:3, brand:"Renault",    model:"Mégane", engineLabel:"1.5 dCi — Diesel 110ch", ecuRef:"Siemens SID305",  downloadedAt:"2026-02-28T16:45:00Z", count:3 },
];

const SAMPLE_WISHLIST = [
  { id:4, brand:"BMW",   model:"Série 3", engineLabel:"2.0d — Diesel 143ch",    ecuRef:"Bosch EDC17C41" },
  { id:5, brand:"Audi",  model:"A4",      engineLabel:"2.0 TDI — Diesel 143ch", ecuRef:"Bosch EDC17CP14" },
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day:"2-digit", month:"short", year:"numeric" });
}

const DlIcon = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const HeartIcon = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M8 13.5S2 9.5 2 5.5A3.5 3.5 0 018 3.2 3.5 3.5 0 0114 5.5C14 9.5 8 13.5 8 13.5z"/></svg>;
const TrashIcon = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V3h4v1M5 4v8h6V4H5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

export default function Dashboard({ nav }) {
  const { user, logout } = useAuth();
  const [tab, setTab]           = useState("history"); // history | wishlist | account
  const [history, setHistory]   = useState(SAMPLE_HISTORY);
  const [wishlist, setWishlist] = useState(SAMPLE_WISHLIST);
  const [reloading, setReloading] = useState(false);

  // Redirect if not logged in
  if (!user) { nav("auth"); return null; }

  const handleRedownload = async (item) => {
    setReloading(true);
    // In production: GET /api/download/:fileId → signed S3 URL
    await new Promise(r => setTimeout(r, 800));
    alert(`Lien de téléchargement envoyé à ${user.email}`);
    setReloading(false);
  };

  const removeWish = (id) => setWishlist(prev => prev.filter(x => x.id !== id));

  return (
    <div className="dash-page">
      {/* ── Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-logo" onClick={() => nav("shop")} style={{cursor:"pointer"}}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><line x1="6" y1="4" x2="6" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="10" y1="4" x2="10" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="6" y1="12" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="10" y1="12" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="4" y1="6" x2="2" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="4" y1="10" x2="2" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          DAGО<strong>AUTO</strong>
        </div>

        <div className="dash-user">
          {user.avatar
            ? <img src={user.avatar} className="dash-avatar" alt={user.name} />
            : <div className="dash-avatar-init">{user.name?.[0]?.toUpperCase()}</div>
          }
          <div className="dash-user-name">{user.name}</div>
          <div className="dash-user-email">{user.email}</div>
        </div>

        <nav className="dash-nav">
          <button className={`dash-nav-item ${tab==="history"?"active":""}`} onClick={()=>setTab("history")}>
            <DlIcon /> Historique ({history.length})
          </button>
          <button className={`dash-nav-item ${tab==="wishlist"?"active":""}`} onClick={()=>setTab("wishlist")}>
            <HeartIcon /> Favoris ({wishlist.length})
          </button>
          <button className={`dash-nav-item ${tab==="account"?"active":""}`} onClick={()=>setTab("account")}>
            ⚙ Mon compte
          </button>
        </nav>

        <div className="dash-sidebar-bottom">
          <button className="dash-shop-btn" onClick={() => nav("shop")}>← Boutique</button>
          <button className="dash-logout" onClick={() => { logout(); nav("shop"); }}>Déconnexion</button>
        </div>
      </aside>

      {/* ── Main content */}
      <main className="dash-main">

        {/* HISTORY */}
        {tab === "history" && <>
          <div className="dash-section-title">Historique des téléchargements</div>
          {history.length === 0 ? (
            <div className="dash-empty">Aucun téléchargement pour l'instant</div>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr><th>Fichier</th><th>Réf. ECU</th><th>Date</th><th>Téléchargements</th><th></th></tr>
                </thead>
                <tbody>
                  {history.map(item => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.brand} {item.model}</strong>
                        <div className="dash-table-sub">{item.engineLabel}</div>
                      </td>
                      <td className="ref-mono-small">{item.ecuRef}</td>
                      <td>{formatDate(item.downloadedAt)}</td>
                      <td><span className="dl-count">{item.count}×</span></td>
                      <td>
                        <button className="redownload-btn" onClick={() => handleRedownload(item)} disabled={reloading}>
                          <DlIcon /> Retélécharger
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>}

        {/* WISHLIST */}
        {tab === "wishlist" && <>
          <div className="dash-section-title">Mes favoris</div>
          {wishlist.length === 0 ? (
            <div className="dash-empty">
              Aucun favori — cliquez sur ♥ sur une fiche pour l'ajouter
            </div>
          ) : (
            <div className="wish-grid">
              {wishlist.map(item => (
                <div key={item.id} className="wish-card">
                  <div className="wish-card-title">{item.brand} {item.model}</div>
                  <div className="wish-card-sub">{item.engineLabel}</div>
                  <div className="wish-card-ref ref-mono-small">{item.ecuRef}</div>
                  <div className="wish-card-actions">
                    <button className="redownload-btn" onClick={() => alert(`Téléchargement de ${item.brand} ${item.model}`)}>
                      <DlIcon /> Télécharger
                    </button>
                    <button className="wish-remove" onClick={() => removeWish(item.id)}>
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>}

        {/* ACCOUNT */}
        {tab === "account" && <>
          <div className="dash-section-title">Mon compte</div>
          <div className="account-card">
            <div className="account-row">
              <span className="account-label">Nom</span>
              <span className="account-val">{user.name}</span>
            </div>
            <div className="account-row">
              <span className="account-label">Email</span>
              <span className="account-val">{user.email}</span>
            </div>
            <div className="account-row">
              <span className="account-label">Connexion via</span>
              <span className="account-val">{user.provider === "google" ? "Google" : "Email / Mot de passe"}</span>
            </div>
            <div className="account-row">
              <span className="account-label">Téléchargements</span>
              <span className="account-val">{history.reduce((a,x)=>a+x.count,0)} fichiers téléchargés</span>
            </div>
          </div>
          {/* PAYPAL PLACEHOLDER */}
          <div className="paypal-placeholder">
            <div className="pp-title">💳 Paiements</div>
            <div className="pp-sub">Les paiements PayPal seront disponibles prochainement.</div>
          </div>
        </>}
      </main>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day:"2-digit", month:"short", year:"numeric" });
}

const DlIcon    = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const HeartIcon = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M8 13.5S2 9.5 2 5.5A3.5 3.5 0 018 3.2 3.5 3.5 0 0114 5.5C14 9.5 8 13.5 8 13.5z"/></svg>;
const TrashIcon = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V3h4v1M5 4v8h6V4H5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ChipIcon  = () => <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><line x1="6" y1="4" x2="6" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="10" y1="4" x2="10" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="6" y1="12" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="10" y1="12" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="4" y1="6" x2="2" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="4" y1="10" x2="2" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;

export default function Dashboard({ nav }) {
  const { user, logout, getToken } = useAuth();
  const [tab,        setTab]        = useState("history");
  const [history,    setHistory]    = useState([]);  // Always starts empty
  const [wishlist,   setWishlist]   = useState([]);  // Always starts empty
  const [loadingH,   setLoadingH]   = useState(false);
  const [loadingW,   setLoadingW]   = useState(false);
  const [reloading,  setReloading]  = useState(false);

  if (!user) { nav("auth"); return null; }

  // ── Fetch real history from API
  const fetchHistory = async () => {
    setLoadingH(true);
    try {
      const res = await fetch(`${API}/api/user/downloads`, {
        headers: { "Authorization": `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data); // Empty array if no downloads yet
      }
    } catch { /* API not available — keep empty */ }
    setLoadingH(false);
  };

  // ── Fetch real wishlist from API
  const fetchWishlist = async () => {
    setLoadingW(true);
    try {
      const res = await fetch(`${API}/api/user/wishlist`, {
        headers: { "Authorization": `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWishlist(data); // Empty array if no wishlist yet
      }
    } catch { /* API not available — keep empty */ }
    setLoadingW(false);
  };

  // Load on mount
  useEffect(() => {
    fetchHistory();
    fetchWishlist();
  }, []);

  const handleRedownload = async (item) => {
    setReloading(true);
    try {
      const res = await fetch(`${API}/api/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ fileId: item.file_id, email: user.email })
      });
      if (res.ok) {
        const { downloadUrl } = await res.json();
        window.open(downloadUrl, "_blank");
      } else {
        alert("Erreur lors du téléchargement. Réessayez.");
      }
    } catch {
      alert("Impossible de contacter le serveur. Réessayez plus tard.");
    }
    setReloading(false);
  };

  const removeWish = async (fileId) => {
    setWishlist(prev => prev.filter(x => x.id !== fileId));
    try {
      await fetch(`${API}/api/user/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ fileId, action: "remove" })
      });
    } catch {}
  };

  return (
    <div className="dash-page">
      {/* ── Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-logo" onClick={() => nav("shop")} style={{cursor:"pointer"}}>
          <ChipIcon /> DAGO<strong>AUTO</strong>
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
          <button className={`dash-nav-item ${tab==="history" ?"active":""}`} onClick={() => setTab("history")}>
            <DlIcon /> Historique ({history.length})
          </button>
          <button className={`dash-nav-item ${tab==="wishlist"?"active":""}`} onClick={() => setTab("wishlist")}>
            <HeartIcon /> Favoris ({wishlist.length})
          </button>
          <button className={`dash-nav-item ${tab==="account" ?"active":""}`} onClick={() => setTab("account")}>
            ⚙ Mon compte
          </button>
        </nav>

        <div className="dash-sidebar-bottom">
          <button className="dash-shop-btn" onClick={() => nav("shop")}>← Boutique</button>
          <button className="dash-logout" onClick={() => { logout(); nav("shop"); }}>Déconnexion</button>
        </div>
      </aside>

      {/* ── Main */}
      <main className="dash-main">

        {/* HISTORY */}
        {tab === "history" && <>
          <div className="dash-section-title">Historique des téléchargements</div>
          {loadingH ? (
            <div className="dash-empty">Chargement…</div>
          ) : history.length === 0 ? (
            <div className="dash-empty-state">
              <div style={{fontSize:"36px",marginBottom:"12px",opacity:0.4}}>📥</div>
              <div style={{fontSize:"15px",marginBottom:"6px"}}>Aucun téléchargement</div>
              <div style={{fontSize:"13px"}}>Vos téléchargements apparaîtront ici</div>
            </div>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr><th>Fichier</th><th>Réf. ECU</th><th>Date</th><th>Fois</th><th></th></tr>
                </thead>
                <tbody>
                  {history.map(item => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.brand} {item.model}</strong>
                        <div className="dash-table-sub">{item.engine_label}</div>
                      </td>
                      <td className="ref-mono-small">{item.ecu_ref}</td>
                      <td>{formatDate(item.last_at)}</td>
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
          {loadingW ? (
            <div className="dash-empty">Chargement…</div>
          ) : wishlist.length === 0 ? (
            <div className="dash-empty-state">
              <div style={{fontSize:"36px",marginBottom:"12px",opacity:0.4}}>♥</div>
              <div style={{fontSize:"15px",marginBottom:"6px"}}>Aucun favori</div>
              <div style={{fontSize:"13px"}}>Cliquez sur ♥ sur une fiche pour ajouter aux favoris</div>
            </div>
          ) : (
            <div className="wish-grid">
              {wishlist.map(item => (
                <div key={item.id} className="wish-card">
                  <div className="wish-card-title">{item.brand} {item.model}</div>
                  <div className="wish-card-sub">{item.engine}</div>
                  <div className="wish-card-ref ref-mono-small">{item.ecu_ref}</div>
                  <div className="wish-card-actions">
                    <button className="redownload-btn" onClick={() => nav("shop")}>
                      <DlIcon /> Voir dans la boutique
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
              <span className="account-val">{user.provider === "google" ? "🔵 Google" : "✉ Email"}</span>
            </div>
            <div className="account-row">
              <span className="account-label">Téléchargements</span>
              <span className="account-val">{history.length === 0 ? "Aucun pour l'instant" : `${history.reduce((a,x)=>a+(x.count||0),0)} fichier${history.reduce((a,x)=>a+(x.count||0),0)>1?"s":""}`}</span>
            </div>
          </div>
          <div className="paypal-placeholder">
            <div className="pp-title">💳 Paiements</div>
            <div className="pp-sub">Les paiements PayPal seront disponibles prochainement.</div>
          </div>
        </>}
      </main>
    </div>
  );
}

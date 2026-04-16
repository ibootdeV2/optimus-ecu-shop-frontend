import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard({ nav }) {
  const { user, getToken, logout } = useAuth();
  const [dls, setDls] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/user/downloads", { headers: {"Authorization": `Bearer ${getToken()}`} })
      .then(r=>r.json()).then(setDls);
  }, []);

  return (
    <div className="dash-page">
      <aside className="dash-sidebar">
        <h2>{user?.name}</h2>
        <button className="dash-nav-item active">Mes Téléchargements</button>
        <button className="dash-logout" onClick={()=>{logout(); nav("shop")}}>Déconnexion</button>
      </aside>
      <main className="dash-main">
        <h1 className="dash-section-title">Historique</h1>
        <table className="dash-table">
          <thead><tr><th>Fichier</th><th>Date</th></tr></thead>
          <tbody>
            {dls.map(d=><tr key={d.id}><td>{d.brand} {d.model}</td><td>{new Date(d.created_at).toLocaleDateString()}</td></tr>)}
          </tbody>
        </table>
      </main>
    </div>
  );
}
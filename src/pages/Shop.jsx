import { useState, useEffect } from "react";
import { apiCall } from "../api"; // Utilisation du helper centralisé

export default function Shop({ nav }) {
  const [brands, setBrands] = useState({});
  const [files, setFiles] = useState([]);

  useEffect(() => {
    apiCall("/api/config").then(d => setBrands(d.brands || {}));
    apiCall("/api/files").then(setFiles);
  }, []);

  const handleDownload = async (fileId) => {
    const data = await apiCall("/api/download", "POST", { fileId });
    if (data.downloadUrl) window.open(data.downloadUrl, "_blank");
  };


  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <div className="site-logo">DAGO<strong>AUTO</strong></div>
          <button className="nav-btn" onClick={()=>nav(user?"dashboard":"auth")}>{user?user.name:"Connexion"}</button>
        </div>
      </header>
      <div className="hero">
        <h1>Catalogue Fichiers ECU</h1>
        <div className="search-bar-pro">
          <select value={fBrand} onChange={e=>{setFBrand(e.target.value); setFModel("")}}>
            <option value="">Marque</option>
            {Object.keys(brands).map(b=><option key={b}>{b}</option>)}
          </select>
          <select disabled={!fBrand} value={fModel} onChange={e=>setFModel(e.target.value)}>
            <option value="">Modèle</option>
            {fBrand && Object.keys(brands[fBrand].models).map(m=><option key={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="cards-grid">
        {files.filter(f=>(!fBrand||f.brand===fBrand)&&(!fModel||f.model===fModel)).map(f=>(
          <div key={f.id} className="file-card">
            <div className="card-tags">{f.tags.map(t=><span key={t} className="tag-badge">{t}</span>)}</div>
            <h3>{f.brand} {f.model}</h3>
            <p>{f.engine} · {f.ecu_ref}</p>
            <div className="card-footer">
              <span className="price">{f.price > 0 ? `${f.price}€` : "GRATUIT"}</span>
              <button className="buy-btn" onClick={()=>handleDl(f.id)}>Télécharger</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
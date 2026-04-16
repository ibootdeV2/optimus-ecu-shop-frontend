import { useState, useEffect } from "react";
import { apiCall } from "../api";

export default function Shop({ nav }) {
  const [brands, setBrands] = useState({});
  const [files, setFiles] = useState([]);
  const [fBrand, setFBrand] = useState("");
  const [fModel, setFModel] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const cfg = await apiCall("/api/config");
      const f = await apiCall("/api/files");
      setBrands(cfg.brands || {});
      setFiles(f || []);
      setLoading(false);
    };
    load();
  }, []);

  const models = fBrand ? Object.keys(brands[fBrand]?.models || {}) : [];

  if (loading) return <div className="app-loading">Chargement...</div>;

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <div className="site-logo">DAGOAUTO</div>
          <button className="nav-btn" onClick={() => nav("auth")}>Connexion</button>
        </div>
      </header>

      <div className="hero">
        <div className="search-bar-pro">
          <select value={fBrand} onChange={e => {setFBrand(e.target.value); setFModel("")}}>
            <option value="">Marque</option>
            {Object.keys(brands).map(b => <option key={b}>{b}</option>)}
          </select>
          <select disabled={!fBrand} value={fModel} onChange={e => setFModel(e.target.value)}>
            <option value="">Modèle</option>
            {models.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="cards-grid">
        {files.filter(f => (!fBrand || f.brand === fBrand) && (!fModel || f.model === fModel)).map(file => (
          <div key={file.id} className="file-card">
            <h3>{file.brand} {file.model}</h3>
            <p>{file.engine} · {file.ecu_ref}</p>
            <button className="buy-btn" onClick={async () => {
              const d = await apiCall("/api/download", "POST", { fileId: file.id });
              if (d.downloadUrl) window.open(d.downloadUrl, "_blank");
            }}>Télécharger</button>
          </div>
        ))}
      </div>
    </div>
  );
}
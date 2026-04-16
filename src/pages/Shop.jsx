import { useState, useEffect } from "react";
import "../App.css"; // IMPORT DU CSS

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Shop() {
  const [brands, setBrands] = useState({});
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const cfg = await fetch(`${API_URL}/api/config`).then(r => r.json());
      const f = await fetch(`${API_URL}/api/files`).then(r => r.json());
      setBrands(cfg.brands || {});
      setFiles(f || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="app-loading">Chargement DAGOAUTO...</div>;

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <div className="site-logo">DAGO<strong>AUTO</strong></div>
        </div>
      </header>

      <div className="cards-grid">
        {files.length === 0 ? <p>Aucun fichier disponible.</p> : files.map(file => (
          <div key={file.id} className="file-card">
            <div className="card-tags">
               {file.tags?.map(t => <span key={t} className="tag-badge">{t}</span>)}
            </div>
            <h3>{file.brand} {file.model}</h3>
            <p>{file.engine}</p>
            <span className="price">{file.price > 0 ? `${file.price}€` : "GRATUIT"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
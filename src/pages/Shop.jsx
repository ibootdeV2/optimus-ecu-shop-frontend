import { useNavigate, Link } from "react-router-dom";

export default function Shop() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <div className="site-logo">DAGO<strong>AUTO</strong></div>
          <nav>
            <Link to="/dashboard" className="nav-btn-ghost">Mon Compte</Link>
            <button onClick={logout} className="nav-btn">Déconnexion</button>
          </nav>
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
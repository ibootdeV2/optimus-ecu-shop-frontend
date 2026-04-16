import "./App.css";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import Shop from "./pages/Shop";
import Admin, { AdminLogin } from "./pages/Admin";

// On crée un composant interne pour pouvoir utiliser useAuth()
function AppRouter() {
  const auth = useAuth();
  const [page, setPage] = useState("auth");

  // Sécurité : si AuthContext met trop de temps à charger
  if (!auth) return <div style={{color: "white", padding: "20px"}}>Erreur: AuthProvider manquant</div>;

  const { user, loading } = auth;

  useEffect(() => {
    if (!loading) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "x7k9p2") {
        setPage("admin-login");
      } else {
        setPage(user ? "shop" : "auth");
      }
    }
  }, [user, loading]);

  if (loading) return <div className="app-loading"><div className="app-loading-ring"></div></div>;

  return (
    <div className="app-main-container">
      {page === "auth" && <AuthPage nav={setPage} />}
      {page === "shop" && <Shop nav={setPage} />}
      {page === "admin-login" && <AdminLogin nav={setPage} />}
      {page === "admin" && <Admin nav={setPage} />}
    </div>
  );
}

// Le composant principal qui enveloppe tout avec le Provider
export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
import "./App.css";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import Shop from "./pages/Shop";
import Admin, { AdminLogin } from "./pages/Admin";
import Dashboard from "./pages/Dashboard";

function AppRouter() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState(null);

  useEffect(() => {
    if (!loading) {
      const params = new URLSearchParams(window.location.search);
      const isAdminUrl = params.get("admin") === "x7k9p2";

      if (isAdminUrl) {
        setPage("admin-login");
      } else if (user) {
        setPage("shop"); // Utilisateur connecté -> Boutique
      } else {
        setPage("auth"); // Non connecté -> Login forcé
      }
    }
  }, [user, loading]);

  if (loading || !page) {
    return (
      <div className="app-loading">
        <div className="app-loading-ring"></div>
        <p style={{color: "white", marginTop: "10px"}}>DAGOAUTO...</p>
      </div>
    );
  }

  return (
    <>
      {page === "auth" && <AuthPage nav={setPage} />}
      {page === "shop" && <Shop nav={setPage} />}
      {page === "admin-login" && <AdminLogin nav={setPage} />}
      {page === "admin" && <Admin nav={setPage} />}
      {page === "dashboard" && <Dashboard nav={setPage} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
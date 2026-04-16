import "./App.css";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import Shop from "./pages/Shop";
import Admin, { AdminLogin } from "./pages/Admin";

function AppRouter() {
  const { user, loading, login } = useAuth();
  const [page, setPage] = useState("auth");

  useEffect(() => {
    if (!loading) {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      // 1. Si on revient de Google avec un token dans l'URL
      if (token) {
        // On simule un objet user (le backend pourra renvoyer plus d'infos plus tard)
        login({ email: "Google User" }, token);
        window.history.replaceState({}, "", "/"); // On nettoie l'URL
        setPage("shop");
        return;
      }

      // 2. Vérification Admin ou User classique
      if (params.get("admin") === "x7k9p2") {
        setPage("admin-login");
      } else if (user) {
        setPage("shop");
      } else {
        setPage("auth");
      }
    }
  }, [user, loading]);

  if (loading) return <div className="app-loading"><div className="app-loading-ring"></div></div>;

  return (
    <>
      {page === "auth" && <AuthPage nav={setPage} />}
      {page === "shop" && <Shop nav={setPage} />}
      {page === "admin-login" && <AdminLogin nav={setPage} />}
      {page === "admin" && <Admin nav={setPage} />}
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
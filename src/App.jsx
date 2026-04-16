import "./App.css";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import Shop from "./pages/Shop";
import Admin, { AdminLogin } from "./pages/Admin";

function AppRouter() {
  const auth = useAuth();
  const [page, setPage] = useState("auth");

  if (!auth) return null;
  const { user, loading } = auth;

  useEffect(() => {
    if (!loading) {
      const params = new URLSearchParams(window.location.search);
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
    <div className="app-main-container">
      {page === "auth" && <AuthPage nav={setPage} />}
      {page === "shop" && <Shop nav={setPage} />}
      {page === "admin-login" && <AdminLogin />}
      {page === "admin" && <Admin nav={setPage} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
<<<<<<< HEAD
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Shop      from "./pages/Shop";
import AuthPage  from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Admin, { AdminLogin } from "./pages/Admin";
import "./App.css";

// ── Secret admin URL slug — change this to whatever you want
// Users access admin via: https://yoursite.com/?admin=DagoAutoAdmin
// No button, no link — completely hidden from normal users
const ADMIN_SECRET = "DagoAutoAdmin";

function AppRouter() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState(null);

  useEffect(() => {
    // Check URL for secret admin access
    const params = new URLSearchParams(window.location.search);
    const adminKey = params.get("admin");

    if (adminKey === ADMIN_SECRET) {
      // Clean the URL so the secret doesn't stay visible
      window.history.replaceState({}, "", window.location.pathname);
      const adminToken = localStorage.getItem("ecu_admin_token");
      setPage(adminToken ? "admin" : "admin-login");
      return;
    }

    // Check if already on admin pages
    if (page === "admin" || page === "admin-login") return;

    // Normal navigation — require login
    if (!loading) {
      if (user) {
        // User is logged in — go to shop if no page set
        if (!page || page === "auth") setPage("shop");
      } else {
        // Not logged in — force auth page
        setPage("auth");
      }
    }
  }, [user, loading]);

  const nav = (p) => {
    // Prevent normal users from navigating to admin pages
    if ((p === "admin" || p === "admin-login") && !localStorage.getItem("ecu_admin_token")) {
      return; // silently ignore
    }
    setPage(p);
  };

  // Show nothing while loading auth state
  if (loading || !page) {
    return (
      <div className="app-loading">
        <div className="app-loading-ring"></div>
      </div>
    );
  }

  // If user not logged in and tries to access shop/dashboard — force auth
  if (!user && page !== "auth" && page !== "admin" && page !== "admin-login") {
    return <AuthPage nav={(p) => setPage(p)} />;
  }

  return (
    <>
      {page === "auth"        && <AuthPage  nav={(p) => setPage(p)} />}
      {page === "shop"        && <Shop      nav={nav} />}
      {page === "dashboard"   && <Dashboard nav={nav} />}
      {page === "admin-login" && <AdminLogin nav={(p) => setPage(p)} />}
      {page === "admin"       && <Admin      nav={(p) => setPage(p)} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
=======
export default function App() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      fontFamily: "Arial"
    }}>
      <h1>🚧 Site en maintenance</h1>
      <p>Nous revenons très bientôt.</p>
    </div>
>>>>>>> b062d13db9c417016cd5177ad7f7c11e25a64d7f
  );
}

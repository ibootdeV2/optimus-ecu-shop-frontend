import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import "./App.css";

// Pages
import AuthPage from "./pages/AuthPage";
import Shop from "./pages/Shop";
import Admin, { AdminLogin } from "./pages/Admin";
import Dashboard from "./pages/Dashboard";

// Protection des pages
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-loading">Chargement...</div>;
  return user ? children : <Navigate to="/login" />;
};

// Capture du Token Google
const TokenHandler = ({ children }) => {
  const { login } = useAuth();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      login({ name: "Utilisateur Google" }, token);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [login]);
  return children;
};

function AppRoutes() {
  return (
    <TokenHandler>
      <Routes>
        {/* Route par défaut (Shop) */}
        <Route path="/" element={<PrivateRoute><Shop /></PrivateRoute>} />
        
        {/* Authentification */}
        <Route path="/login" element={<AuthPage />} />
        
        {/* Espace Client */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

        {/* Administration */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />

        {/* Fallback si l'URL n'existe pas */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </TokenHandler>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
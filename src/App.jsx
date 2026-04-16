import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import "./App.css";

// Pages
import AuthPage from "./pages/AuthPage";
import Shop from "./pages/Shop";
import Admin, { AdminLogin } from "./pages/Admin";
import Dashboard from "./pages/Dashboard";

// Composant pour protéger les pages (nécessite d'être connecté)
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-loading"><div className="app-loading-ring"></div></div>;
  return user ? children : <Navigate to="/login" />;
};

// Gestionnaire de Token (pour Google OAuth ou lien direct)
const TokenHandler = ({ children }) => {
  const { login } = useAuth();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      // On connecte l'utilisateur avec le token reçu
      login({ email: "Utilisateur Google" }, token);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);
  return children;
};

function AppRoutes() {
  return (
    <TokenHandler>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<AuthPage />} />
        
        {/* Privé (Catalogue par défaut) */}
        <Route path="/" element={<PrivateRoute><Shop /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

        {/* Admin (Lien secret ou direct) */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />

        {/* Redirection si URL inconnue */}
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
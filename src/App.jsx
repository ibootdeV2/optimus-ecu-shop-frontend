import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Shop      from "./pages/Shop";
import AuthPage  from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Admin, { AdminLogin} from "./pages/Admin";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("shop"); // shop | auth | dashboard | admin | admin-login

  const nav = (p) => setPage(p);

  return (
    <AuthProvider>
      {page === "shop"        && <Shop       nav={nav} />}
      {page === "auth"        && <AuthPage   nav={nav} />}
      {page === "dashboard"   && <Dashboard  nav={nav} />}
      {page === "admin"       && <Admin      nav={nav} />}
      {page === "admin-login" && <AdminLogin nav={nav} />}
    </AuthProvider>
  );
}

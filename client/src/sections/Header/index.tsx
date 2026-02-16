import { useNavigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import type { UserRole } from "../../types";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  currentUser?: { name: string; role: UserRole } | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header = ({ currentUser, onLogin, onLogout }: HeaderProps) => {
  const navigate = useNavigate();
  
  // Try to use context if props are not provided
  let authContext: ReturnType<typeof useAuth> | null = null;
  try {
    authContext = useAuth();
  } catch {
    // Context not available, will use props
  }

  // Use props if provided, otherwise fall back to context
  const user = currentUser !== undefined ? currentUser : authContext?.user || null;
  const handleLogin = onLogin || (() => navigate('/auth'));
  const handleLogout = onLogout || authContext?.handleLogout || (() => {});

  return (
    <header className="bg-transparent z-50 sticky top-0">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="bg-white border-4 border-dreamxec-navy rounded-2xl shadow-pastel-saffron my-2">
          <Navbar currentUser={user} onLogin={handleLogin} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
};


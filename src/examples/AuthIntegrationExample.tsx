// Example: How to update your authentication handlers in App.tsx to use the backend API

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, logout, getCurrentUser } from '../services/authService';
import { mapBackendRole, mapFrontendRole } from '../services/mappers';
import type { UserRole } from '../types';

// Example authentication integration
export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: UserRole } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load current user from token (call this on app mount)
  const loadCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await getCurrentUser();
      if (response.data?.user) {
        setUser({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: mapBackendRole(response.data.user.role),
        });
      }
    } catch (err) {
      console.log('No user logged in');
    } finally {
      setLoading(false);
    }
  };

  // Login handler
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await login({ email, password });
      
      if (response.data?.user) {
        const userData = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: mapBackendRole(response.data.user.role),
        };
        
        setUser(userData);
        
        // Navigate based on role
        if (userData.role === 'student') {
          navigate('/dashboard');
        } else if (userData.role === 'donor') {
          navigate('/donor/dashboard');
        } else if (userData.role === 'admin') {
          navigate('/admin');
        }
        
        return userData;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const handleRegister = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    organizationName?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await register({
        name,
        email,
        password,
        role: mapFrontendRole(role),
        organizationName,
      });
      
      if (response.data?.user) {
        const userData = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: mapBackendRole(response.data.user.role),
        };
        
        setUser(userData);
        
        // Navigate based on role
        if (userData.role === 'student') {
          navigate('/dashboard');
        } else if (userData.role === 'donor') {
          navigate('/donor/dashboard');
        } else if (userData.role === 'admin') {
          navigate('/admin');
        }
        
        return userData;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    logout(); // Removes token from localStorage
    setUser(null);
    navigate('/');
  };

  // Google OAuth (redirect to backend)
  const handleGoogleAuth = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${apiUrl.replace('/api', '')}/auth/google`;
  };

  return {
    user,
    loading,
    error,
    loadCurrentUser,
    handleLogin,
    handleRegister,
    handleLogout,
    handleGoogleAuth,
  };
};

// Example usage in App.tsx:
/*
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading, loadCurrentUser, handleLogin, handleRegister, handleLogout } = useAuth();

  // Load user on mount
  useEffect(() => {
    loadCurrentUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={
        <AuthPage 
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      } />
      {user && (
        <>
          {user.role === 'student' && (
            <>
              <Route path="/dashboard" element={<StudentDashboard user={user} onLogout={handleLogout} />} />
              <Route path="/campaigns" element={<BrowseCampaigns />} />
              <Route path="/projects" element={<BrowseProjects />} />
            </>
          )}
          {user.role === 'donor' && (
            <>
              <Route path="/donor/dashboard" element={<DonorDashboard user={user} onLogout={handleLogout} />} />
              <Route path="/campaigns" element={<BrowseCampaigns />} />
            </>
          )}
          {user.role === 'admin' && (
            <>
              <Route path="/admin" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
              <Route path="/campaigns" element={<BrowseCampaigns />} />
            </>
          )}
        </>
      )}
    </Routes>
  );
}
*/

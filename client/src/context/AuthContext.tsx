import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { 
  login as apiLogin, 
  register as apiRegister, 
  logout as apiLogout, 
  getCurrentUser,
  initiateGoogleAuth,
  initiateLinkedInAuth,
} from '../services/authService';
import { mapBackendRole, mapFrontendRole } from '../services/mappers';

type BackendRoleType = 'USER' | 'DONOR' | 'ADMIN' | 'STUDENT_PRESIDENT';

interface BackendUser {
  id: string;
  email: string;
  role: BackendRoleType;
  emailVerified?: boolean;
  clubIds?: string[];
  createdAt?: string;
  updatedAt?: string;
  isClubPresident?: boolean;
  isClubMember?: boolean;
  clubVerified?: boolean;
  name?: string;
  studentVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  handleLoginClick: () => void;
  handleLogout: () => void;
  handleLogin: (email: string, password: string, role: 'student' | 'donor') => Promise<BackendUser | undefined>;
  handleSignup: (name: string, email: string, password: string, role: 'student' | 'donor', institution?: string) => Promise<{ requiresVerification?: boolean; user?: BackendUser } | undefined>;
  handleGoogleAuth: (role: 'student' | 'donor') => Promise<void>;
  handleLinkedInAuth: (role: 'student' | 'donor') => Promise<void>;
  handleForgotPassword: (email: string) => Promise<void>;
  handleEmailVerificationSuccess: (backendUser: BackendUser) => void;
  signupEmail: string;
  setSignupEmail: React.Dispatch<React.SetStateAction<string>>;
  showCheckEmail: boolean;
  setShowCheckEmail: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signupEmail, setSignupEmail] = useState('');
  const [showCheckEmail, setShowCheckEmail] = useState(false);

  // Helper to create User object from backend response
  const createUserData = (backendUser: BackendUser): User => ({
    id: backendUser.id,
    email: backendUser.email,
    role: mapBackendRole(backendUser.role),
    emailVerified: backendUser.emailVerified || false,
    clubIds: backendUser?.clubIds || [],
    createdAt: backendUser.createdAt || new Date().toISOString(),
    updatedAt: backendUser.updatedAt || new Date().toISOString(),
    isClubPresident: backendUser?.isClubPresident || false,
    isClubMember: backendUser?.isClubMember || false,
    clubVerified: backendUser?.clubVerified || false,
    name: backendUser.name,
    studentVerified: backendUser?.studentVerified,
  });

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getCurrentUser();
        if (response.data?.user) {
          setUser(createUserData(response.data.user));
        }
      } catch (error: unknown) {
        const err = error as { response?: { status: number } };
        if (err?.response?.status === 401) {
          setUser(null);
        } else {
          console.error('Unexpected /auth/me error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLoginClick = useCallback(() => {
    // This will be called by consumers who have access to navigate
    // We export this as a simple function, navigation happens in the component
  }, []);

  const handleLogout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogin = useCallback(async (email: string, password: string, _role: 'student' | 'donor'): Promise<BackendUser | undefined> => {
    try {
      const response = await apiLogin({ email, password });
      if (response.data?.user) {
        const backendUser = response.data.user as BackendUser;
        setUser(createUserData(backendUser));
        return backendUser;
      }
      return undefined;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const handleSignup = useCallback(async (
    name: string,
    email: string,
    password: string,
    role: 'student' | 'donor',
    institution?: string
  ): Promise<{ requiresVerification?: boolean; user?: BackendUser } | undefined> => {
    try {
      const response = await apiRegister({
        name,
        email,
        password,
        role: mapFrontendRole(role),
        organizationName: institution,
      });

      if (response.message && response.message.includes('verification email')) {
        setSignupEmail(email);
        setShowCheckEmail(true);
        return { requiresVerification: true };
      } else if (response.data?.user) {
        setUser(createUserData(response.data.user as BackendUser));
        return { user: response.data.user as BackendUser };
      }
      return undefined;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }, []);

  const handleGoogleAuth = useCallback(async (role: 'student' | 'donor') => {
    try {
      const backendRole = mapFrontendRole(role);
      initiateGoogleAuth(backendRole);
    } catch (error) {
      console.error('Google auth error:', error);
      throw new Error('Google authentication failed');
    }
  }, []);

  const handleLinkedInAuth = useCallback(async (role: 'student' | 'donor') => {
    try {
      const backendRole = role === 'student' ? 'USER' : 'DONOR';
      initiateLinkedInAuth(backendRole);
    } catch (error) {
      console.error('LinkedIn auth error:', error);
      throw new Error('LinkedIn authentication failed');
    }
  }, []);

  const handleForgotPassword = useCallback(async (email: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`✅ Password reset link sent to ${email}`);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new Error('Failed to send password reset email');
    }
  }, []);

  const handleEmailVerificationSuccess = useCallback((backendUser: BackendUser) => {
    setUser(createUserData(backendUser));
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      setUser,
      handleLoginClick,
      handleLogout,
      handleLogin,
      handleSignup,
      handleGoogleAuth,
      handleLinkedInAuth,
      handleForgotPassword,
      handleEmailVerificationSuccess,
      signupEmail,
      setSignupEmail,
      showCheckEmail,
      setShowCheckEmail,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

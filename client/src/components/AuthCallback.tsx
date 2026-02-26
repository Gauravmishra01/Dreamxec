import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../services/api';
import { getCurrentUser } from '../services/authService';
import { mapBackendRole } from '../services/mappers';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const completeAuth = async () => {
      try {
        // 1. Extract token from URL query params
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          console.error('AuthCallback: No token in URL');
          navigate('/auth');
          return;
        }

        // 2. Store the token
        setToken(token);

        // 3. Fetch the current user using the stored token
        const response = await getCurrentUser();

        if (!response.data?.user) {
          console.error('AuthCallback: Could not fetch user');
          navigate('/auth');
          return;
        }

        const user = response.data.user;
        const frontendRole = mapBackendRole(user.role);

        // 4. Check profile completion — redirect to setup if incomplete
        const profileComplete = (user as any).profileComplete;
        if (profileComplete === false) {
          navigate('/profile/setup');
          return;
        }

        // 5. Role-based redirect
        if (frontendRole === 'student') {
          navigate('/dashboard');
        } else if (frontendRole === 'donor') {
          navigate('/donor/dashboard');
        } else if (frontendRole === 'admin') {
          navigate('/admin');
        } else if (frontendRole === 'STUDENT_PRESIDENT') {
          navigate('/president');
        } else {
          navigate('/dashboard');
        }
      } catch (e) {
        console.error('AuthCallback error:', e);
        navigate('/auth');
      }
    };

    completeAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF3]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#000080] border-t-[#FF7F00] rounded-full animate-spin mx-auto mb-4" />
        <p className="font-black text-[#000080] uppercase tracking-widest text-sm">Completing authentication...</p>
      </div>
    </div>
  );
}

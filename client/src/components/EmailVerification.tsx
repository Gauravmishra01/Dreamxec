import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarDecoration } from './icons/StarDecoration';

interface EmailVerificationProps {
  onVerificationSuccess: (user: any) => void;
}

export default function EmailVerification({ onVerificationSuccess }: EmailVerificationProps) {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/auth/verify-email/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
          setStatus('success');
          setMessage('Email verified successfully! Redirecting to dashboard...');
          
          // Store the token if provided
          if (data.token) {
            localStorage.setItem('token', data.token);
          }

          // Call success handler with user data
          if (data.data?.user && onVerificationSuccess) {
            onVerificationSuccess(data.data.user);
          }

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            if (data.data?.user?.role === 'DONOR') {
              navigate('/donor/dashboard');
            } else if (data.data?.user?.role === 'ADMIN') {
              navigate('/admin');
            } else {
              navigate('/dashboard');
            }
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Email verification failed');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage('Failed to verify email. Please try again.');
      }
    };

    verifyEmail();
  }, [token, navigate, onVerificationSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream px-4">
      <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-8 md:p-12 text-center max-w-md w-full">
        <div className="card-tricolor-tag"></div>
        
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-2 border-dreamxec-green border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-dreamxec-navy mb-4 font-display">
              Verifying Email...
            </h2>
            <p className="text-dreamxec-navy font-sans">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-dreamxec-green rounded-full flex items-center justify-center border-2 border-dreamxec-navy shadow-pastel-green">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-dreamxec-navy mb-4 font-display flex items-center justify-center gap-2">
              Email Verified! 
              <StarDecoration className="w-8 h-8" color="#FF7F00" />
            </h2>
            <p className="text-dreamxec-navy font-sans text-lg mb-6">
              {message}
            </p>
            <div className="w-12 h-12 border-2 border-dreamxec-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center border-2 border-dreamxec-navy shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-dreamxec-navy mb-4 font-display">
              Verification Failed
            </h2>
            <p className="text-dreamxec-navy font-sans text-lg mb-6">
              {message}
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-3 bg-dreamxec-orange text-white rounded-lg border-2 border-dreamxec-navy font-bold font-display hover:scale-105 transition-transform shadow-pastel-saffron"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

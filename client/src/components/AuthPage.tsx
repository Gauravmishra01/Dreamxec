import { useState, useEffect } from 'react';
import { StarDecoration } from './icons/StarDecoration';
import { Header } from '../sections/Header';
import imageIcon from '../assets/image.png';
import image1Icon from '../assets/image1.png';
import imageCopyIcon from '../assets/imagecopy.png';

// Simple SVG Icons
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
  </svg>
);

// Google Icon
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// LinkedIn Icon
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2" />
  </svg>
);

import { UserRole } from '../types';
import { FooterContent } from '../sections/Footer/components/FooterContent';

interface AuthPageProps {
  onLogin: (email: string, password: string, role: 'student' | 'donor') => void;
  onSignup: (name: string, email: string, password: string, role: 'student' | 'donor', institution?: string) => void;
  onGoogleAuth?: (role: 'student' | 'donor') => void;
  onLinkedInAuth?: (role: 'student' | 'donor') => void;
  onForgotPassword?: (email: string) => void;
  currentUser?: { name: string; role: UserRole } | null;
  onHeaderLogin?: () => void;
  onLogout?: () => void;
}

export default function AuthPage({ onLogin, onSignup, onGoogleAuth, onLinkedInAuth, onForgotPassword, currentUser, onHeaderLogin, onLogout }: AuthPageProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'donor'>('student');
  const [showBackgroundImages, setShowBackgroundImages] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check window width to show/hide background images
  useEffect(() => {
    const checkWindowWidth = () => {
      setShowBackgroundImages(window.innerWidth > 1360);
    };

    checkWindowWidth();
    window.addEventListener('resize', checkWindowWidth);

    return () => window.removeEventListener('resize', checkWindowWidth);
  }, []);

  const handleGoogleAuth = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      if (onGoogleAuth) {
        await onGoogleAuth(role);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkedInAuth = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      if (onLinkedInAuth) {
        await onLinkedInAuth(role);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'LinkedIn authentication failed';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isForgotPassword) {
        // Forgot Password
        if (!email.trim()) {
          setError('Please enter your email address');
          setIsSubmitting(false);
          return;
        }
        if (onForgotPassword) {
          await onForgotPassword(email);
          // Show success message
          setError(''); // Clear any errors
          alert('Password reset link sent to your email!');
          setIsForgotPassword(false); // Return to login
          setEmail(''); // Clear email
        }
      } else if (isSignup) {
        // Signup validation
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsSubmitting(false);
          return;
        }
        await onSignup(name, email, password, role, institution);
      } else {
        // Login
        await onLogin(email, password, role);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = isForgotPassword
    ? email.trim()
    : isSignup
      ? name.trim() && email.trim() && password && confirmPassword && (role === 'student' || role === 'donor' ? institution.trim() : true)
      : email.trim() && password;

  return (
    <>
      {/* Header */}
      <Header
        currentUser={currentUser}
        onLogin={onHeaderLogin}
        onLogout={onLogout}
      />

      {/* Auth Page Content */}
      <div className="min-h-screen bg-transparent relative overflow-hidden flex items-center justify-center py-4 sm:py-6 md:py-8 px-4">
        {/* Decorative stars - Far from center */}
        <div className="absolute top-8 left-1 -z-30 opacity-8 pointer-events-none">
          <StarDecoration className="w-6 h-6" color="#FF7F00" />
        </div>
        <div className="absolute top-20 right-2 -z-30 opacity-6 pointer-events-none">
          <StarDecoration className="w-5 h-5" color="#0B9C2C" />
        </div>
        <div className="absolute bottom-12 left-4 -z-30 opacity-5 pointer-events-none">
          <StarDecoration className="w-8 h-8" color="#000080" />
        </div>

        {/* === Decorative Floating Background Images === */}
        {/* Only visible on screens wider than 1360px to prevent overlap */}

        {showBackgroundImages && (
          <>
            {/* LEFT SIDE - Only on very wide screens (wider than 1360px) */}
            <div className="absolute top-[12%] left-[2%] -z-20 opacity-70 animate-float-slow pointer-events-none">
              <img
                src={imageIcon}
                alt="Left Decor Wellness"
                className="w-40 sm:w-48 md:w-56 lg:w-64 h-auto object-contain"
                style={{
                  animationDelay: '0s',
                  filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.1))',
                  maxWidth: '280px'
                }}
              />
            </div>

            <div className="absolute bottom-[8%] left-[3%] -z-20 opacity-65 animate-float-fast pointer-events-none">
              <img
                src={image1Icon}
                alt="Left Decor Research"
                className="w-44 sm:w-52 md:w-60 lg:w-68 h-auto object-contain"
                style={{
                  animationDelay: '2s',
                  filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.1))',
                  maxWidth: '300px'
                }}
              />
            </div>

            {/* RIGHT SIDE - Only on very wide screens (wider than 1360px) */}
            <div className="absolute top-[12%] right-[2%] -z-20 opacity-70 animate-float-slow pointer-events-none">
              <img
                src={imageCopyIcon}
                alt="Right Decor Technology"
                className="w-40 sm:w-48 md:w-56 lg:w-64 h-auto object-contain"
                style={{
                  animationDelay: '1.5s',
                  filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.1))',
                  maxWidth: '280px'
                }}
              />
            </div>

            <div className="absolute bottom-[8%] right-[3%] -z-20 opacity-65 animate-float-fast pointer-events-none">
              <img
                src={imageIcon}
                alt="Right Decor Wellness"
                className="w-44 sm:w-52 md:w-60 lg:w-68 h-auto object-contain"
                style={{
                  animationDelay: '3s',
                  filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.1))',
                  maxWidth: '300px'
                }}
              />
            </div>
          </>
        )}




        {/* Main Auth Card */}
        <div className="w-full max-w-4xl px-4 sm:px-6 relative z-50 my-4 sm:my-6">
          <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-4 sm:p-6 md:p-8 lg:p-10 bg-white relative" style={{ zIndex: 1000 }}>
            <div className="card-tricolor-tag"></div>

            {/* Logo/Header */}
            <div className="text-center mb-6 mt-4">
              <div className="flex items-center justify-center gap-3 mb-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy font-display">
                  {isForgotPassword ? 'Reset Password' : isSignup ? 'Join Us!' : 'Welcome Back!'}
                </h1>
                <StarDecoration className="w-8 h-8" color="#FF7F00" />
              </div>
              <p className="text-dreamxec-navy text-base font-sans opacity-80">
                {isForgotPassword
                  ? 'Enter your email to receive a reset link'
                  : isSignup
                    ? 'Create an account to start fundraising'
                    : 'Sign in to your account'}
              </p>
            </div>

            {/* Role Toggle - Hidden for Forgot Password */}
            {!isForgotPassword && (
              <div className="mb-6">
                <label className="block text-sm font-bold text-dreamxec-navy mb-3 font-display text-center">
                  I am a:
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`px-3 py-2 rounded-lg font-bold font-display border-3 transition-all text-sm ${role === 'student'
                        ? 'bg-dreamxec-orange text-white border-dreamxec-navy shadow-pastel-saffron scale-105'
                        : 'bg-white text-dreamxec-navy border-dreamxec-navy hover:bg-dreamxec-cream'
                      }`}
                  >
                    Studdent
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('donor')}
                    className={`px-3 py-2 rounded-lg font-bold font-display border-3 transition-all text-sm ${role === 'donor'
                        ? 'bg-dreamxec-green text-white border-dreamxec-navy shadow-pastel-green scale-105'
                        : 'bg-white text-dreamxec-navy border-dreamxec-navy hover:bg-dreamxec-cream'
                      }`}
                  >
                    Donor
                  </button>
                </div>
              </div>
            )}

            {/* Social Login Buttons - Hidden for Forgot Password */}   
            {!isForgotPassword && (onGoogleAuth || onLinkedInAuth) && (
              <div className="mb-6">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dreamxec-navy"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-dreamxec-beige text-dreamxec-navy font-bold font-display text-sm">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 max-w-md mx-auto">
                  {onGoogleAuth && (
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-white border-3 border-dreamxec-navy rounded-lg font-bold font-sans hover:bg-gray-50 transition-all shadow-pastel-card disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <GoogleIcon className="w-4 h-4" />
                      <span className="text-dreamxec-navy">Google</span>
                    </button>
                  )}

                  {onLinkedInAuth && (
                    <button
                      type="button"
                      onClick={handleLinkedInAuth}
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-white border-3 border-dreamxec-navy rounded-lg font-bold font-sans hover:bg-gray-50 transition-all shadow-pastel-card disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <LinkedInIcon className="w-4 h-4" />
                      <span className="text-dreamxec-navy">LinkedIn</span>
                    </button>
                  )}
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dreamxec-navy"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-dreamxec-beige text-dreamxec-navy font-bold font-display text-sm">
                      Or use email
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border-3 border-red-600 text-red-700 rounded-lg font-sans text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form content in two columns for wider layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name (Signup only) */}
                {isSignup && (
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-dreamxec-navy mb-2 font-display">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dreamxec-navy opacity-60 w-4 h-4" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="w-full pl-10 pr-3 py-2 border-3 border-dreamxec-navy rounded-lg text-sm font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-orange focus:ring-2 focus:ring-dreamxec-orange transition-all shadow-pastel-saffron"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className={isSignup ? "md:col-span-1" : "md:col-span-2"}>
                  <label className="block text-sm font-bold text-dreamxec-navy mb-2 font-display">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dreamxec-navy opacity-60 w-4 h-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-10 pr-3 py-2 border-3 border-dreamxec-navy rounded-lg text-sm font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-green focus:ring-2 focus:ring-dreamxec-green transition-all shadow-pastel-green"
                    />
                  </div>
                </div>

                {/* Institution / Organization (Signup for Student and Donor) */}
                {isSignup && (role === 'student' || role === 'donor') && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-dreamxec-navy mb-2 font-display">
                      {role === 'student' ? 'Institution/College' : 'Organization/Company'} <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <BuildingIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dreamxec-navy opacity-60 w-4 h-4" />
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder={role === 'student' ? 'Enter your institution name' : 'Enter your organization or company name'}
                        required
                        className="w-full pl-10 pr-3 py-2 border-3 border-dreamxec-navy rounded-lg text-sm font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-orange focus:ring-2 focus:ring-dreamxec-orange transition-all shadow-pastel-saffron"
                      />
                    </div>
                  </div>
                )}

                {/* Password - Hidden for Forgot Password */}
                {!isForgotPassword && (
                  <div className={isSignup ? "md:col-span-1" : "md:col-span-2"}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-bold text-dreamxec-navy font-display">
                        Password <span className="text-red-600">*</span>
                      </label>
                      {!isSignup && onForgotPassword && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(true);
                            setError('');
                          }}
                          className="text-xs font-bold text-dreamxec-orange hover:text-dreamxec-green transition-colors font-display underline"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dreamxec-navy opacity-60 w-4 h-4" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isSignup ? 'Create a password (min 6 characters)' : 'Enter your password'}
                        required
                        minLength={isSignup ? 6 : undefined}
                        className="w-full pl-10 pr-3 py-2 border-3 border-dreamxec-navy rounded-lg text-sm font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-green focus:ring-2 focus:ring-dreamxec-green transition-all shadow-pastel-green"
                      />
                    </div>
                  </div>
                )}

                {/* Confirm Password (Signup only) */}
                {isSignup && (
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-dreamxec-navy mb-2 font-display">
                      Confirm Password <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dreamxec-navy opacity-60 w-4 h-4" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        required
                        className="w-full pl-10 pr-3 py-2 border-3 border-dreamxec-navy rounded-lg text-sm font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-orange focus:ring-2 focus:ring-dreamxec-orange transition-all shadow-pastel-saffron"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full px-4 py-3 rounded-lg font-bold text-white transition-all font-display text-lg border-3 border-dreamxec-navy ${isFormValid
                      ? 'bg-dreamxec-green hover:scale-105 shadow-pastel-green'
                      : 'bg-gray-400 cursor-not-allowed opacity-50'
                    } ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
                >
                  {isSubmitting
                    ? 'Please wait...'
                    : isForgotPassword
                      ? 'Send Reset Link'
                      : isSignup
                        ? 'Create Account'
                        : 'Sign In'}
                </button>
              </div>
            </form>

            {/* Toggle Sign In/Sign Up/Forgot Password */}
            <div className="mt-6 text-center">
              {isForgotPassword ? (
                <p className="text-dreamxec-navy font-sans text-sm">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setError('');
                      setEmail('');
                    }}
                    className="font-bold text-dreamxec-orange hover:text-dreamxec-green transition-colors underline font-display"
                  >
                    Back to Sign In
                  </button>
                </p>
              ) : (
                <p className="text-dreamxec-navy font-sans text-sm">
                  {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignup(!isSignup);
                      setError('');
                      setName('');
                      setEmail('');
                      setPassword('');
                      setConfirmPassword('');
                      setInstitution('');
                    }}
                    className="font-bold text-dreamxec-orange hover:text-dreamxec-green transition-colors underline font-display"
                  >
                    {isSignup ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="mt-6 mb-4">
              <div className="h-1 bg-tricolor-horizontal rounded"></div>
            </div>

            {/* Info */}
            <div className="text-center">
              <p className="text-dreamxec-navy font-sans text-xs opacity-70">
                {role === 'student'
                  ? '🎓 Students can create and manage fundraising campaigns'
                  : '💼 Donors can post projects and find talented students'}
              </p>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="mt-4 card-pastel rounded-xl p-3 border-3 border-dreamxec-navy shadow-pastel-saffron">
            <div className="flex items-start gap-2">
              <div className="icon-pastel-container w-8 h-8 p-1 flex-shrink-0">
                <span className="text-dreamxec-saffron text-lg">💡</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-dreamxec-navy font-display">
                  Secure & Trusted
                </h3>
                <p className="text-dreamxec-navy font-sans text-xs leading-relaxed">
                  Your data is protected with industry-standard security. Join thousands of students making a difference!
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* End Auth Page Content */}
      </div>
      <FooterContent />
    </>
  );
}

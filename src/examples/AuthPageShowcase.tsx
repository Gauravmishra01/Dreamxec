import AuthPage from '../components/AuthPage';

/**
 * AuthPage Showcase
 * 
 * This component demonstrates the authentication page with sign in and sign up functionality.
 * 
 * Features:
 * - Toggle between Sign In and Sign Up modes
 * - Role selection (Student/Admin)
 * - Form validation
 * - Same oil pastel theme as rest of the app
 * - Animated background decorations
 * - Responsive design
 * 
 * Usage:
 * <AuthPage onLogin={handleLogin} onSignup={handleSignup} />
 * 
 * To view this page, navigate to: /auth
 */

export default function AuthPageShowcase() {
  const handleLogin = async (email: string, password: string, role: 'student' | 'donor') => {
    console.log('Login:', { email, password, role });
    // Implement your login logic here
    alert(`Login successful as ${role}!`);
  };

  const handleSignup = async (
    name: string,
    email: string,
    password: string,
    role: 'student' | 'donor',
    institution?: string
  ) => {
    console.log('Signup:', { name, email, password, role, institution });
    // Implement your signup logic here
    alert(`Account created successfully as ${role}!`);
  };

  const handleGoogleAuth = async (role: 'student' | 'donor') => {
    console.log('Google Auth:', { role });
    // Implement Google OAuth here
    alert(`Google authentication initiated for ${role}!`);
  };

  const handleLinkedInAuth = async (role: 'student' | 'donor') => {
    console.log('LinkedIn Auth:', { role });
    // Implement LinkedIn OAuth here
    alert(`LinkedIn authentication initiated for ${role}!`);
  };

  const handleForgotPassword = async (email: string) => {
    console.log('Forgot Password:', { email });
    // Implement forgot password logic here
    // 1. Verify email exists
    // 2. Generate reset token
    // 3. Send reset email
    alert(`Password reset link sent to ${email}!`);
  };

  return (
    <AuthPage
      onLogin={handleLogin}
      onSignup={handleSignup}
      onGoogleAuth={handleGoogleAuth}
      onLinkedInAuth={handleLinkedInAuth}
      onForgotPassword={handleForgotPassword}
    />
  );
}

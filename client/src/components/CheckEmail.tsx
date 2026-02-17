import { StarDecoration } from './icons/StarDecoration';

interface CheckEmailProps {
  email: string;
  onBackToLogin: () => void;
}

export default function CheckEmail({ email, onBackToLogin }: CheckEmailProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream px-4">
      <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-8 md:p-12 text-center max-w-lg w-full">
        <div className="card-tricolor-tag"></div>
        
        {/* Email Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-dreamxec-green rounded-full flex items-center justify-center border-2 border-dreamxec-navy shadow-pastel-green">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-dreamxec-navy mb-4 font-display flex items-center justify-center gap-3">
          Check Your Email!
          <StarDecoration className="w-10 h-10" color="#FF7F00" />
        </h2>

        {/* Message */}
        <div className="mb-6">
          <p className="text-dreamxec-navy font-sans text-lg mb-3">
            We've sent a verification link to:
          </p>
          <p className="text-dreamxec-orange font-bold text-xl font-display break-all">
            {email}
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-dreamxec-cream rounded-lg border-2 border-dreamxec-navy p-6 mb-6">
          <h3 className="font-bold text-dreamxec-navy mb-3 font-display text-lg">
            📬 What's Next?
          </h3>
          <ol className="text-left text-dreamxec-navy font-sans space-y-2 list-decimal list-inside">
            <li>Open your email inbox</li>
            <li>Find the verification email from DreamXec</li>
            <li>Click the verification link</li>
            <li>You'll be redirected to your dashboard</li>
          </ol>
        </div>

        {/* Additional Info */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-6">
          <p className="text-sm text-dreamxec-navy font-sans">
            <strong className="font-bold">💡 Tip:</strong> Check your spam folder if you don't see the email within a few minutes.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onBackToLogin}
            className="w-full px-6 py-3 bg-dreamxec-orange text-white rounded-lg border-2 border-dreamxec-navy font-bold font-display hover:scale-105 transition-transform shadow-pastel-saffron text-lg"
          >
            Back to Login
          </button>
          
          <p className="text-sm text-dreamxec-navy font-sans opacity-70">
            Didn't receive the email? Check your spam folder or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

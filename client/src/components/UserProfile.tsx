import { useState } from 'react';
import { StarDecoration } from './icons/StarDecoration';
import { Header } from '../sections/Header';
import type { User } from '../types';

const BankIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    <path d="M12 7h.01M12 11h.01M12 15h.01"/>
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
  upiId?: string;
}

interface UserProfileProps {
  user: User;
  onBack: () => void;
  onUpdateBankDetails?: (details: BankDetails) => void;
  onLogout?: () => void;
}

export default function UserProfile({ user, onBack, onUpdateBankDetails, onLogout }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Bank details state
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountType, setAccountType] = useState<'savings' | 'current'>('savings');
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');

  // Mock existing bank details (in production, fetch from backend)
  const [hasBankDetails] = useState(false);
  const [savedBankDetails] = useState<BankDetails | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (accountNumber !== confirmAccountNumber) {
      setError('Account numbers do not match');
      return;
    }

    if (accountNumber.length < 9 || accountNumber.length > 18) {
      setError('Account number must be between 9 and 18 digits');
      return;
    }

    if (ifscCode.length !== 11) {
      setError('IFSC code must be 11 characters');
      return;
    }

    try {
      const bankDetails: BankDetails = {
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode: ifscCode.toUpperCase(),
        accountType,
        upiId: upiId || undefined,
      };

      if (onUpdateBankDetails) {
        await onUpdateBankDetails(bankDetails);
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsEditing(false);
      }, 2000);
    } catch (err) {
      setError('Failed to save bank details. Please try again.');
    }
  };

  const isFormValid =
    accountHolderName.trim() &&
    bankName.trim() &&
    accountNumber.trim() &&
    confirmAccountNumber.trim() &&
    ifscCode.trim() &&
    accountNumber === confirmAccountNumber;

  return (
    <div className="min-h-screen bg-dreamxec-cream relative overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute top-20 left-10 z-0 opacity-20">
        <StarDecoration className="w-16 h-16" color="#FF7F00" />
      </div>
      <div className="absolute top-40 right-20 z-0 opacity-20">
        <StarDecoration className="w-12 h-12" color="#0B9C2C" />
      </div>
      <div className="absolute bottom-32 left-1/4 z-0 opacity-15">
        <StarDecoration className="w-20 h-20" color="#000080" />
      </div>

      {/* Header */}
      <Header currentUser={user} onLogout={onLogout} />

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-dreamxec-green border-2 border-dreamxec-navy rounded-xl px-6 py-4 shadow-pastel-green flex items-center gap-3">
            <CheckCircleIcon className="w-6 h-6 text-white" />
            <span className="text-white font-bold font-display text-lg">Bank details saved successfully!</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-dreamxec-orange text-white rounded-lg border-2 border-dreamxec-navy hover:scale-105 transition-transform font-display font-bold shadow-pastel-saffron"
        >
          <span>←</span>
          Back to Dashboard
        </button>

        {/* Profile Card */}
        <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-6 sm:p-8 mb-6">
          <div className="card-tricolor-tag"></div>
          
          <div className="flex items-center gap-6 mt-4">
            {/* Avatar */}
            <div className="w-24 h-24 bg-dreamxec-orange border-5 border-dreamxec-navy rounded-full flex items-center justify-center shadow-pastel-saffron">
              <span className="text-white font-bold text-4xl font-display">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy font-display mb-2">
                {user.name}
              </h1>
              <p className="text-dreamxec-navy text-lg font-sans opacity-80">
                {user.email}
              </p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-dreamxec-beige border-2 border-dreamxec-navy rounded-lg">
                <span className="text-dreamxec-navy font-bold text-sm font-display">
                  {user.role === 'student' && '🎓 Student'}
                  {user.role === 'STUDENT_PRESIDENT' && '🎓 Student President'}
                  {user.role === 'admin' && '🛡️ Admin'}
                  {user.role === 'donor' && '❤️ Donor'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details Card */}
        <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-6 sm:p-8">
          <div className="card-tricolor-tag"></div>
          
          <div className="flex items-center justify-between mb-6 mt-4">
            <div className="flex items-center gap-3">
              <BankIcon className="w-8 h-8 text-dreamxec-navy" />
              <h2 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy font-display">
                Bank Details
              </h2>
              <StarDecoration className="w-8 h-8" color="#0B9C2C" />
            </div>
            
            {hasBankDetails && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-dreamxec-orange text-white rounded-lg border-3 border-dreamxec-navy hover:scale-105 transition-transform font-display font-bold shadow-pastel-saffron"
              >
                Edit
              </button>
            )}
          </div>

          {/* Show Existing Bank Details */}
          {hasBankDetails && !isEditing && savedBankDetails ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border-3 border-dreamxec-navy rounded-lg">
                  <p className="text-sm font-bold text-dreamxec-navy opacity-70 font-display">Account Holder</p>
                  <p className="text-lg font-bold text-dreamxec-navy font-sans">{savedBankDetails.accountHolderName}</p>
                </div>
                <div className="p-4 bg-white border-3 border-dreamxec-navy rounded-lg">
                  <p className="text-sm font-bold text-dreamxec-navy opacity-70 font-display">Bank Name</p>
                  <p className="text-lg font-bold text-dreamxec-navy font-sans">{savedBankDetails.bankName}</p>
                </div>
                <div className="p-4 bg-white border-3 border-dreamxec-navy rounded-lg">
                  <p className="text-sm font-bold text-dreamxec-navy opacity-70 font-display">Account Number</p>
                  <p className="text-lg font-bold text-dreamxec-navy font-sans">••••••{savedBankDetails.accountNumber.slice(-4)}</p>
                </div>
                <div className="p-4 bg-white border-3 border-dreamxec-navy rounded-lg">
                  <p className="text-sm font-bold text-dreamxec-navy opacity-70 font-display">IFSC Code</p>
                  <p className="text-lg font-bold text-dreamxec-navy font-sans">{savedBankDetails.ifscCode}</p>
                </div>
                <div className="p-4 bg-white border-3 border-dreamxec-navy rounded-lg">
                  <p className="text-sm font-bold text-dreamxec-navy opacity-70 font-display">Account Type</p>
                  <p className="text-lg font-bold text-dreamxec-navy font-sans capitalize">{savedBankDetails.accountType}</p>
                </div>
                {savedBankDetails.upiId && (
                  <div className="p-4 bg-white border-3 border-dreamxec-navy rounded-lg">
                    <p className="text-sm font-bold text-dreamxec-navy opacity-70 font-display">UPI ID</p>
                    <p className="text-lg font-bold text-dreamxec-navy font-sans">{savedBankDetails.upiId}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Bank Details Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-100 border-2 border-red-600 text-red-700 rounded-lg font-sans">
                  {error}
                </div>
              )}

              {/* Account Holder Name */}
              <div>
                <label className="block text-lg font-bold text-dreamxec-navy mb-2 font-display">
                  Account Holder Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dreamxec-navy opacity-60 w-5 h-5" />
                  <input
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    placeholder="Enter account holder name"
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-dreamxec-navy rounded-lg text-base font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-orange focus:ring-2 focus:ring-dreamxec-orange transition-all shadow-pastel-saffron"
                  />
                </div>
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-lg font-bold text-dreamxec-navy mb-2 font-display">
                  Bank Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <BankIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dreamxec-navy opacity-60 w-5 h-5" />
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g., State Bank of India"
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-dreamxec-navy rounded-lg text-base font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-green focus:ring-2 focus:ring-dreamxec-green transition-all shadow-pastel-green"
                  />
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-lg font-bold text-dreamxec-navy mb-2 font-display">
                  Account Number <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <CreditCardIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dreamxec-navy opacity-60 w-5 h-5" />
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter account number"
                    required
                    maxLength={18}
                    className="w-full pl-12 pr-4 py-3 border-2 border-dreamxec-navy rounded-lg text-base font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-orange focus:ring-2 focus:ring-dreamxec-orange transition-all shadow-pastel-saffron"
                  />
                </div>
              </div>

              {/* Confirm Account Number */}
              <div>
                <label className="block text-lg font-bold text-dreamxec-navy mb-2 font-display">
                  Confirm Account Number <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <CreditCardIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dreamxec-navy opacity-60 w-5 h-5" />
                  <input
                    type="text"
                    value={confirmAccountNumber}
                    onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Re-enter account number"
                    required
                    maxLength={18}
                    className="w-full pl-12 pr-4 py-3 border-2 border-dreamxec-navy rounded-lg text-base font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-green focus:ring-2 focus:ring-dreamxec-green transition-all shadow-pastel-green"
                  />
                </div>
              </div>

              {/* IFSC Code */}
              <div>
                <label className="block text-lg font-bold text-dreamxec-navy mb-2 font-display">
                  IFSC Code <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="e.g., SBIN0001234"
                  required
                  maxLength={11}
                  className="w-full px-4 py-3 border-2 border-dreamxec-navy rounded-lg text-base font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-orange focus:ring-2 focus:ring-dreamxec-orange transition-all shadow-pastel-saffron uppercase"
                />
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-lg font-bold text-dreamxec-navy mb-2 font-display">
                  Account Type <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType('savings')}
                    className={`px-4 py-3 rounded-lg font-bold font-display border-2 transition-all ${
                      accountType === 'savings'
                        ? 'bg-dreamxec-green text-white border-dreamxec-navy shadow-pastel-green scale-105'
                        : 'bg-white text-dreamxec-navy border-dreamxec-navy hover:bg-dreamxec-cream'
                    }`}
                  >
                    Savings
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('current')}
                    className={`px-4 py-3 rounded-lg font-bold font-display border-2 transition-all ${
                      accountType === 'current'
                        ? 'bg-dreamxec-green text-white border-dreamxec-navy shadow-pastel-green scale-105'
                        : 'bg-white text-dreamxec-navy border-dreamxec-navy hover:bg-dreamxec-cream'
                    }`}
                  >
                    Current
                  </button>
                </div>
              </div>

              {/* UPI ID (Optional) */}
              <div>
                <label className="block text-lg font-bold text-dreamxec-navy mb-2 font-display">
                  UPI ID (Optional)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g., yourname@paytm"
                  className="w-full px-4 py-3 border-2 border-dreamxec-navy rounded-lg text-base font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-green focus:ring-2 focus:ring-dreamxec-green transition-all shadow-pastel-green"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border-2 border-dreamxec-navy rounded-lg font-bold text-dreamxec-navy hover:bg-dreamxec-cream transition-colors font-display text-lg shadow-pastel-navy"
                  >
                    Cancel
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold text-white transition-all font-display text-lg border-2 border-dreamxec-navy ${
                    isFormValid
                      ? 'bg-dreamxec-green hover:scale-105 shadow-pastel-green'
                      : 'bg-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  {isEditing ? 'Update Bank Details' : 'Save Bank Details'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 card-pastel rounded-xl p-4 border-2 border-dreamxec-navy shadow-pastel-saffron">
          <div className="flex items-start gap-3">
            <div className="icon-pastel-container w-10 h-10 p-2 flex-shrink-0">
              <span className="text-dreamxec-saffron text-xl">🔒</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-dreamxec-navy font-display">
                Secure & Encrypted
              </h3>
              <p className="text-dreamxec-navy font-sans text-sm leading-relaxed">
                Your bank details are encrypted and stored securely. We never share your financial information with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
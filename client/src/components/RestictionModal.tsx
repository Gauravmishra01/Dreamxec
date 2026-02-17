import React from 'react';

interface RestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
}

export const RestrictionModal = ({ isOpen, onClose, onVerify }: RestrictionModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl border-2 border-blue-900 shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-900 opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto border-2 border-red-200">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-blue-900">Access Restricted</h3>
          
          <p className="text-blue-900 opacity-80">
            You cannot register as a <strong>Club President</strong> until your student status is verified.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                onVerify(); // Opens the main verification modal
              }}
              className="w-full px-4 py-3 bg-orange-400 text-blue-900 rounded-lg font-bold hover:scale-105 transition-transform border-2 border-blue-900"
            >
              Verify Student Status Now
            </button>
            
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-100 text-blue-900 rounded-lg font-bold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
import React from "react";

// --- Icons ---
const XCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M15 9l-6 6M9 9l6 6" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const FileTextIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CopyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

// --- Types ---
type Verification = {
  id: string;
  collegeName: string;
  studentEmail?: string | null;
  studentPhone?: string | null;
  presidentName?: string | null;
  ficName?: string | null;
  ficEmail?: string | null;
  ficPhone?: string | null;
  docUrl?: string | null;
  status: string;
  createdAt: string;
  userId?: string | null;
  clubName?: string | null;
};

export default function VerificationDetailModal({
  verification,
  onClose,
  onApprove,
  onReject,
}: {
  verification: Verification;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}) {
  const handleApprove = async () => {
    await onApprove(verification.id);
    onClose();
  };

  const handleReject = async () => {
    const reason = window.prompt("Enter rejection reason (optional):", "");
    if (reason !== null) {
      await onReject(verification.id, reason);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm bg-black/60"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="card-pastel-offwhite w-full max-w-4xl rounded-xl shadow-pastel-card border-5 border-dreamxec-navy overflow-hidden relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-tricolor-tag"></div>

        {/* --- Header --- */}
        <div className="p-6 sm:p-8 border-b-4 border-dreamxec-navy bg-white/50 flex items-start justify-between gap-4 mt-2">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border-2 border-dreamxec-navy shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-display uppercase tracking-wider ${
                verification.status === 'APPROVED' ? 'bg-dreamxec-green text-white shadow-pastel-green-sm' :
                verification.status === 'REJECTED' ? 'bg-red-600 text-white shadow-pastel-navy-sm' :
                'bg-dreamxec-orange text-white shadow-pastel-saffron-sm'
              }`}>
                {verification.status}
              </span>
              {/* Full ID displayed with larger, bold text */}
              <span className="text-dreamxec-navy opacity-80 text-base font-bold font-sans tracking-wide">
                ID: {verification.id}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy font-display leading-tight">
              {verification.collegeName}
            </h2>
            {verification.clubName && (
              <p className="text-xl text-dreamxec-navy font-sans mt-1 opacity-80">
                Club: <span className="font-bold">{verification.clubName}</span>
              </p>
            )}
            <p className="text-sm text-dreamxec-navy/60 mt-2 font-sans font-medium">
              Submitted on: {new Date(verification.createdAt).toLocaleString()}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 bg-white border-3 border-dreamxec-navy rounded-lg hover:bg-gray-100 hover:scale-110 transition-transform shadow-pastel-navy-sm flex-shrink-0"
          >
            <XCircleIcon className="w-8 h-8 text-dreamxec-navy" />
          </button>
        </div>

        {/* --- Scrollable Content --- */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-orange-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* President Card */}
            <div className="bg-white p-5 rounded-xl border-3 border-dreamxec-navy shadow-pastel-green-sm">
              <div className="flex items-center gap-3 mb-4 border-b-2 border-dreamxec-navy/10 pb-3">
                <div className="bg-dreamxec-green/20 p-2 rounded-lg border-2 border-dreamxec-green">
                  <UserIcon className="w-6 h-6 text-dreamxec-green" />
                </div>
                <h3 className="text-xl font-bold text-dreamxec-navy font-display">Student President</h3>
              </div>
              
              <div className="space-y-3 font-sans">
                <div>
                  <p className="text-xs font-bold text-dreamxec-navy/50 uppercase tracking-wide">Full Name</p>
                  <p className="text-lg font-bold text-dreamxec-navy">{verification.presidentName || "—"}</p>
                </div>
                <div>
                  <p className="text-base font-bold text-dreamxec-navy/50 uppercase tracking-wide">Email</p>
                  <p className="text-dreamxec-navy break-all text-sm">{verification.studentEmail || "—"}</p>
                </div>
                <div>
                  <p className="text-base font-bold text-dreamxec-navy/50 uppercase tracking-wide">Phone</p>
                  <p className="text-dreamxec-navy text-sm">+91 {verification.studentPhone || "—"}</p>
                </div>
              </div>
            </div>

            {/* Faculty Card */}
            <div className="bg-white p-5 rounded-xl border-3 border-dreamxec-navy shadow-pastel-saffron-sm">
              <div className="flex items-center gap-3 mb-4 border-b-2 border-dreamxec-navy/10 pb-3">
                <div className="bg-dreamxec-orange/20 p-2 rounded-lg border-2 border-dreamxec-orange">
                  <UserIcon className="w-6 h-6 text-dreamxec-orange" />
                </div>
                <h3 className="text-xl font-bold text-dreamxec-navy font-display">Faculty In-Charge</h3>
              </div>
              
              <div className="space-y-3 font-sans">
                <div>
                  <p className="text-xs font-bold text-dreamxec-navy/50 uppercase tracking-wide">Name</p>
                  <p className="text-lg font-bold text-dreamxec-navy">{verification.ficName || "—"}</p>
                </div>
                <div>
                  <p className="text-base font-bold text-dreamxec-navy/50 uppercase tracking-wide">Email</p>
                  <p className="text-dreamxec-navy break-all text-sm">{verification.ficEmail || "—"}</p>
                </div>
                <div>
                  <p className="text-base font-bold text-dreamxec-navy/50 uppercase tracking-wide">Phone</p>
                  <p className="text-dreamxec-navy text-sm">+91 {verification.ficPhone || "—"}</p>
                </div>
              </div>
            </div>

            {/* Document Card */}
            <div className="md:col-span-2 bg-dreamxec-cream/50 p-5 rounded-xl border-3 border-dreamxec-navy border-dashed">
              <div className="flex items-center gap-3 mb-4">
                <FileTextIcon className="w-6 h-6 text-dreamxec-navy" />
                <h3 className="text-xl font-bold text-dreamxec-navy font-display">Verification Document</h3>
              </div>

              {verification.docUrl ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg border-2 border-dreamxec-navy">
                  <div className="flex-1 text-dreamxec-navy font-sans text-sm break-all">
                    {verification.docUrl}
                  </div>
                  <a
                    href={verification.docUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-dreamxec-navy text-white rounded-lg font-bold hover:bg-blue-900 transition-colors shadow-pastel-navy-sm text-sm whitespace-nowrap"
                  >
                    View Document ↗
                  </a>
                </div>
              ) : (
                <p className="text-dreamxec-navy/60 italic">No document uploaded.</p>
              )}
            </div>

          </div>
        </div>

        {/* --- Footer Actions --- */}
        <div className="p-6 border-t-4 border-dreamxec-navy bg-white flex flex-col sm:flex-row gap-4 justify-end items-center">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(JSON.stringify(verification, null, 2));
              alert("Raw Data Copied!");
            }}
            className="flex items-center gap-2 text-dreamxec-navy hover:bg-gray-100 px-4 py-2 rounded-lg font-bold transition-colors text-sm sm:mr-auto"
          >
            <CopyIcon className="w-4 h-4" />
            Copy Raw Data
          </button>

          {verification.status === 'PENDING' && (
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleReject}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display text-lg"
              >
                <XCircleIcon className="w-6 h-6" />
                Reject
              </button>

              <button
                onClick={handleApprove}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-dreamxec-green text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-green hover:scale-105 transition-transform font-display text-lg"
              >
                <CheckCircleIcon className="w-6 h-6" />
                Approve Request
              </button>
            </div>
          )}
          
          {verification.status !== 'PENDING' && (
             <button
             onClick={onClose}
             className="w-full sm:w-auto px-8 py-3 bg-gray-200 text-dreamxec-navy rounded-lg font-bold border-3 border-dreamxec-navy hover:bg-gray-300 transition-colors font-display"
           >
             Close
           </button>
          )}
        </div>

      </div>
    </div>
  );
}
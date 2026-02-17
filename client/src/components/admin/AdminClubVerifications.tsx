import React, { useEffect, useState } from 'react';
import {
  getClubVerifications,
  approveClubVerification,
  rejectClubVerification
} from '../../services/adminService';
import VerificationDetailModal from './VerificationDetailModal';
import { StarDecoration } from '../icons/StarDecoration';
import { Header } from '../../sections/Header';

// --- Icons (Matching Dashboard Style) ---
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const XCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M15 9l-6 6M9 9l6 6" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export default function AdminClubVerifications() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await getClubVerifications();
      // Handle response structure (either { data: [...] } or [...])
      setItems(res.data || (Array.isArray(res) ? res : []));
    } catch (e) {
      console.error("Failed to load verifications:", e);
    } finally {
      setLoading(false);
    }
  }

  async function approve(id: string) {
    if (!window.confirm("Are you sure you want to approve this verification? This will upgrade the user to President.")) return;
    try {
      await approveClubVerification(id);
      load();
    } catch (e) {
      console.error(e);
      alert('Approve failed');
    }
  }

  async function reject(id: string, reason: string) {
    try {
      await rejectClubVerification(id, reason);
      load();
    } catch (e) {
      console.error(e);
      alert('Reject failed');
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen relative overflow-hidden bg-orange-50/30">

      {/* --- Decorative Background --- */}
      <div className="absolute top-20 left-10 z-0 opacity-20 pointer-events-none">
        <StarDecoration className="w-16 h-16" color="#FF7F00" />
      </div>
      <div className="absolute bottom-32 right-10 z-0 opacity-15 pointer-events-none">
        <StarDecoration className="w-20 h-20" color="#000080" />
      </div>

      {/* --- Page Header --- */}
      <div className="relative bg-dreamxec-navy border-b-8 border-dreamxec-orange shadow-pastel-saffron z-10">
        <div className="card-tricolor-tag"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => window.location.href = '/admin'}
            className="flex items-center gap-2 text-dreamxec-cream hover:text-white mb-4 transition-colors font-bold"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dreamxec-orange font-display">
              Club Verifications
            </h1>
            <StarDecoration className="w-8 h-8 hidden sm:block" color="#FF7F00" />
          </div>
          <p className="text-dreamxec-cream text-lg sm:text-xl font-sans mt-2 opacity-90">
            Review proof documents and approve Student Presidents
          </p>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        <div className="card-pastel-offwhite rounded-xl p-6 sm:p-8 border-5 border-dreamxec-navy shadow-pastel-card">
          <div className="card-tricolor-tag"></div>

          {/* Header Row */}
          <div className="flex items-center justify-between mb-6 mt-2">
            <h2 className="text-2xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
              Verification Requests
              <span className="bg-dreamxec-orange text-white text-sm px-3 py-1 rounded-full border-2 border-dreamxec-navy">
                {items.length} Total
              </span>
            </h2>
            <button onClick={load} className="text-dreamxec-navy hover:text-dreamxec-orange underline font-bold text-sm">
              Refresh List
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-dreamxec-orange mx-auto"></div>
              <p className="text-dreamxec-navy mt-4 font-bold">Loading requests...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && items.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border-3 border-dashed border-dreamxec-navy/30">
              <div className="bg-dreamxec-cream w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dreamxec-navy">
                <CheckCircleIcon className="w-10 h-10 text-dreamxec-green" />
              </div>
              <h3 className="text-2xl font-bold text-dreamxec-navy font-display">All Caught Up!</h3>
              <p className="text-dreamxec-navy opacity-70">No pending club verifications.</p>
            </div>
          )}

          {/* Table */}
          {!loading && items.length > 0 && (
            <div className="overflow-x-auto rounded-lg border-3 border-dreamxec-navy">
              <table className="w-full bg-white">
                <thead className="bg-dreamxec-cream border-b-3 border-dreamxec-navy">
                  <tr>
                    <th className="text-left py-4 px-6 font-bold text-dreamxec-navy font-display text-lg">College / Club</th>
                    <th className="text-left py-4 px-6 font-bold text-dreamxec-navy font-display text-lg">President</th>
                    <th className="text-left py-4 px-6 font-bold text-dreamxec-navy font-display text-lg">Status</th>
                    <th className="text-right py-4 px-6 font-bold text-dreamxec-navy font-display text-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-dreamxec-gray-200">
                  {items.map((v) => (
                    <tr key={v.id} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="font-bold text-dreamxec-navy text-lg">{v.collegeName}</div>
                        <div className="text-sm text-dreamxec-navy opacity-70 font-sans">{v.clubName || "Club Name Not Set"}</div>
                      </td>
                      <td className="py-4 px-6 text-dreamxec-navy font-medium">
                        {v.presidentName}
                        <div className="text-xs opacity-60">{v.studentEmail}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border-2 border-dreamxec-navy font-display shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${v.status === 'APPROVED' ? 'bg-dreamxec-green text-white shadow-pastel-green-sm' :
                            v.status === 'REJECTED' ? 'bg-red-600 text-white shadow-pastel-navy-sm' :
                              'bg-dreamxec-orange text-white shadow-pastel-saffron-sm'
                          }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelected(v)}
                            className="inline-flex items-center gap-2 p-2 sm:p-3 bg-dreamxec-gray-100 text-dreamxec-navy rounded-lg font-bold border-3 border-dreamxec-navy hover:scale-110 transition-transform"
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>

                          {v.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => approve(v.id)}
                                className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-dreamxec-green text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-green hover:scale-105 transition-transform font-display"
                              >
                                <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">Approve</span>
                              </button>

                              <button
                                onClick={() => {
                                  const reason = prompt('Enter rejection reason:');
                                  if (reason) reject(v.id, reason);
                                }}
                                className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-red-600 text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display"
                              >
                                <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">Reject</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <VerificationDetailModal
          verification={selected}
          onClose={() => setSelected(null)}
          onApprove={approve}
          onReject={reject}
        />
      )}
      </div>
    </>
  );
}
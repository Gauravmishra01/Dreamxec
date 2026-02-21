import React, { useEffect, useState } from 'react';
import AdminSidebar from '../AdminSidebar';
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

export default function AdminClubVerifications() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await getClubVerifications();
      console.log("🔍 Club Verifications API Response:", res);
      // Handle response structure: { data: { requests: [...] } } or { data: [...] }
      const responseData = res.data as any;
      const data = (responseData?.requests) || responseData || [];
      setItems(Array.isArray(data) ? data : []);
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
    <div className="flex min-h-screen bg-transparent relative">
      
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area - Fluid full width layout */}
      <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">

        {/* --- Decorative Background --- */}
        <div className="absolute top-20 right-20 z-0 opacity-20 pointer-events-none">
          <StarDecoration className="w-16 h-16" color="#FF7F00" />
        </div>
        <div className="absolute bottom-32 left-10 z-0 opacity-15 pointer-events-none">
          <StarDecoration className="w-20 h-20" color="#000080" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
                Club Verifications <StarDecoration className="w-8 h-8 hidden sm:block" color="#FF7F00" />
              </h1>
              <p className="text-gray-600 mt-2 font-sans text-lg">
                Review proof documents and approve Student Presidents.
              </p>
            </div>
            
            <button 
              onClick={load} 
              className="px-6 py-2.5 bg-white text-dreamxec-navy rounded-xl border-2 border-dreamxec-navy/20 shadow-sm font-bold font-display hover:bg-dreamxec-navy/5 transition-all"
            >
              Refresh List
            </button>
          </div>

          <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden">
            
            {/* Header Row count */}
            <div className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20 p-5 flex items-center gap-3">
              <h2 className="text-xl font-bold text-dreamxec-navy font-display">
                Verification Requests
              </h2>
              <span className="bg-dreamxec-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {items.length} Total
              </span>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-dreamxec-orange mx-auto"></div>
                <p className="text-dreamxec-navy mt-4 font-bold font-display text-xl">Loading requests...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && items.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-dreamxec-cream w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-dreamxec-navy shadow-sm">
                  <CheckCircleIcon className="w-10 h-10 text-dreamxec-green" />
                </div>
                <h3 className="text-2xl font-bold text-dreamxec-navy font-display">All Caught Up!</h3>
                <p className="text-gray-500 font-sans mt-2">No pending club verifications.</p>
              </div>
            )}

            {/* Table */}
            {!loading && items.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">College / Club</th>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">President</th>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Status</th>
                      <th className="p-5 text-right font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((v) => (
                      <tr key={v.id} className="hover:bg-dreamxec-cream/50 transition-colors group">
                        <td className="p-5">
                          <div className="font-bold text-dreamxec-navy text-lg font-display">{v.collegeName}</div>
                          <div className="text-sm text-gray-500 font-sans mt-1">{v.clubName || "Club Name Not Set"}</div>
                        </td>
                        <td className="p-5">
                          <div className="font-bold text-sm text-dreamxec-navy">{v.presidentName}</div>
                          <div className="text-xs text-gray-500 font-mono mt-1">{v.studentEmail}</div>
                        </td>
                        <td className="p-5">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase border-2 shadow-sm ${
                            v.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                            v.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => setSelected(v)}
                              className="inline-flex items-center justify-center p-2.5 bg-white text-dreamxec-navy rounded-lg border-2 border-dreamxec-navy/20 shadow-sm hover:bg-dreamxec-navy/5 hover:border-dreamxec-navy transition-all"
                              title="View Details"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>

                            {v.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => approve(v.id)}
                                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-lg font-bold border-2 border-green-200 shadow-sm hover:bg-green-100 transition-colors"
                                >
                                  <CheckCircleIcon className="w-5 h-5" />
                                  <span className="hidden sm:inline">Approve</span>
                                </button>

                                <button
                                  onClick={() => {
                                    const reason = prompt('Enter rejection reason:');
                                    if (reason) reject(v.id, reason);
                                  }}
                                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg font-bold border-2 border-red-200 shadow-sm hover:bg-red-100 transition-colors"
                                >
                                  <XCircleIcon className="w-5 h-5" />
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
    
  
  );}
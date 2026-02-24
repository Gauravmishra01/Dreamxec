import React, { useEffect, useState, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';
import Pagination from './Pagination';
import {
  getClubVerifications,
  approveClubVerification,
  rejectClubVerification
} from '../../services/adminService';
import VerificationDetailModal from './VerificationDetailModal';
import { StarDecoration } from '../icons/StarDecoration';

// --- Icons ---
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></svg>
);
const XCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
);
const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);

export default function AdminClubVerifications() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination & Sorting State
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });
  const itemsPerPage = 20;

  useEffect(() => { load(); }, []);

async function load() {
    setLoading(true);
    try {
      const res = await getClubVerifications();
      
      // ✅ Type-safe check that prevents the 'verifications' does not exist error
      const data = res.data as any;
      setItems(Array.isArray(data) ? data : data?.verifications || data?.data || []);
      
    } catch (e) {
      console.error("Failed to load verifications:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // Sort Logic
  const sortedItems = useMemo(() => {
    let sortable = [...items];
    sortable.sort((a, b) => {
      if (sortConfig.key === 'clubName') {
        return sortConfig.direction === 'asc' 
          ? (a.clubName || '').localeCompare(b.clubName || '') 
          : (b.clubName || '').localeCompare(a.clubName || '');
      }
      if (sortConfig.key === 'studentName') {
        return sortConfig.direction === 'asc' 
          ? (a.presidentName || '').localeCompare(b.presidentName || '') 
          : (b.presidentName || '').localeCompare(a.presidentName || '');
      }
      if (sortConfig.key === 'status') {
        return sortConfig.direction === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
      }
      // Default: Date
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return sortable;
  }, [items, sortConfig]);

  // Paginate Logic
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  async function approve(id: string) {
    if (!window.confirm("Approve this verification? This upgrades the user to President.")) return;
    try { await approveClubVerification(id); load(); } 
    catch (e) { alert('Approve failed'); }
  }

  async function reject(id: string, reason: string) {
    try { await rejectClubVerification(id, reason); load(); } 
    catch (e) { alert('Reject failed'); }
  }

  const renderSortArrow = (key: string) => sortConfig.key === key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '';

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <AdminSidebar />

      <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">
        <div className="absolute top-20 right-20 z-0 opacity-20 pointer-events-none">
          <StarDecoration className="w-16 h-16" color="#FF7F00" />
        </div>

        <div className="relative z-10 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
                Club Verifications <StarDecoration className="w-8 h-8 hidden sm:block" color="#FF7F00" />
              </h1>
              <p className="text-gray-600 mt-2 font-sans text-lg">Review proof documents and approve Student Presidents.</p>
            </div>
            <button onClick={load} className="px-6 py-2.5 bg-white text-dreamxec-navy rounded-xl border-2 border-dreamxec-navy/20 shadow-sm font-bold hover:bg-dreamxec-navy/5">
              Refresh List
            </button>
          </div>

          <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden flex flex-col">
            <div className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20 p-5 flex items-center gap-3">
              <h2 className="text-xl font-bold text-dreamxec-navy font-display">Verification Requests</h2>
              <span className="bg-dreamxec-orange text-white text-xs font-bold px-3 py-1 rounded-full">{items.length} Total</span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-gray-500 animate-pulse font-bold text-xl">Loading requests...</div>
            ) : paginatedItems.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-display text-lg">No pending club verifications.</div>
            ) : (
              <>
                <div className="overflow-x-auto overflow-y-auto max-h-[600px] relative">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b-2 border-gray-200 sticky top-0 z-20 shadow-sm">
                      <tr>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-gray-200" onClick={() => handleSort('createdAt')}>
                          Date {renderSortArrow('createdAt')}
                        </th>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-gray-200" onClick={() => handleSort('clubName')}>
                          College / Club {renderSortArrow('clubName')}
                        </th>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-gray-200" onClick={() => handleSort('studentName')}>
                          President {renderSortArrow('studentName')}
                        </th>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-gray-200" onClick={() => handleSort('status')}>
                          Status {renderSortArrow('status')}
                        </th>
                        <th className="p-5 text-right font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedItems.map((v) => (
                        <tr key={v.id} className="hover:bg-dreamxec-cream/50 transition-colors">
                          <td className="p-5 text-sm text-gray-500 font-mono">{new Date(v.createdAt).toLocaleDateString()}</td>
                          <td className="p-5">
                            <div className="font-bold text-dreamxec-navy text-lg font-display">{v.collegeName}</div>
                            <div className="text-sm text-gray-500 font-sans mt-1">{v.clubName || "Club Name Not Set"}</div>
                          </td>
                          <td className="p-5">
                            <div className="font-bold text-sm text-dreamxec-navy">{v.presidentName}</div>
                            <div className="text-xs text-gray-500 font-mono mt-1">{v.studentEmail}</div>
                          </td>
                          <td className="p-5">
                            <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase border-2 shadow-sm ${v.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' : v.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                              {v.status}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setSelected(v)} className="p-2 bg-gray-100 text-gray-700 rounded-lg border hover:bg-gray-200" title="View Full Details">
                                <EyeIcon className="w-5 h-5" />
                              </button>
                              {v.status === 'PENDING' && (
                                <>
                                  <button onClick={() => approve(v.id)} className="px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg font-bold text-xs hover:bg-green-100">Approve</button>
                                  <button onClick={() => { const reason = prompt('Enter rejection reason:'); if (reason) reject(v.id, reason); }} className="px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg font-bold text-xs hover:bg-red-100">Reject</button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination page={page} totalPages={totalPages} setPage={setPage} />
              </>
            )}
          </div>
        </div>
      </div>

      {selected && (
        <VerificationDetailModal verification={selected} onClose={() => setSelected(null)} onApprove={approve} onReject={reject} />
      )}
    </div>
  );
}
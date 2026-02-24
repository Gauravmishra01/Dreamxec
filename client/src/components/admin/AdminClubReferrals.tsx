import React, { useEffect, useState, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';
import Pagination from './Pagination';
import { getClubReferrals, updateReferralStatus } from '../../services/adminService';
import ReferralDetailsModal from './ReferralDetailsModal';
import { StarDecoration } from '../icons/StarDecoration';

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);

export default function AdminClubReferrals() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReferral, setSelectedReferral] = useState<any | null>(null);

  // Pagination & Sorting State
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });
  const itemsPerPage = 20;

  useEffect(() => { loadReferrals(); }, []);

  const loadReferrals = async () => {
    try {
      setLoading(true);
      const res = await getClubReferrals();
      setReferrals(Array.isArray(res.data) ? res.data : (res.data as any).data || []);
    } catch (error) {
      console.error('Failed to load referrals', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED' | 'DISABLED') => {
    const notes = prompt(`Enter notes for ${status} (Optional):`);
    // If they cancel the prompt, do nothing
    if (notes === null) return;
    
    try {
      await updateReferralStatus(id, status as any, notes || '');
      loadReferrals();
      setSelectedReferral(null);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // Sort Logic
  const sortedReferrals = useMemo(() => {
    let sortable = [...referrals];
    sortable.sort((a, b) => {
      if (sortConfig.key === 'clubName') {
        return sortConfig.direction === 'asc' ? (a.clubName || '').localeCompare(b.clubName || '') : (b.clubName || '').localeCompare(a.clubName || '');
      }
      if (sortConfig.key === 'user') {
        return sortConfig.direction === 'asc' ? (a.referrerEmail || '').localeCompare(b.referrerEmail || '') : (b.referrerEmail || '').localeCompare(a.referrerEmail || '');
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
  }, [referrals, sortConfig]);

  // Paginate Logic
  const totalPages = Math.ceil(sortedReferrals.length / itemsPerPage);
  const paginatedReferrals = sortedReferrals.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const renderSortArrow = (key: string) => sortConfig.key === key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '';

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <AdminSidebar />
      
      <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">
        <div className="absolute top-10 left-10 z-0 opacity-10 pointer-events-none">
          <StarDecoration className="w-24 h-24" color="#0B9C2C" />
        </div>

        <div className="relative z-10 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
                Club Referrals <StarDecoration className="w-8 h-8 hidden sm:block" color="#FF7F00" />
              </h1>
              <p className="text-gray-600 mt-2 font-sans text-lg">Manage student referrals for new club chapters.</p>
            </div>
            <button onClick={loadReferrals} className="px-6 py-2.5 bg-white text-dreamxec-navy rounded-xl border-2 border-dreamxec-navy/20 shadow-sm font-bold hover:bg-dreamxec-navy/5">
              Refresh List
            </button>
          </div>

          <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-navy overflow-hidden flex flex-col">
            <div className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20 p-5 flex items-center gap-3">
              <h2 className="text-xl font-bold text-dreamxec-navy font-display">Pending Referrals</h2>
              <span className="bg-dreamxec-orange text-white text-xs font-bold px-3 py-1 rounded-full">{referrals.length} Total</span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-gray-500 animate-pulse font-bold text-xl">Loading referrals...</div>
            ) : paginatedReferrals.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-display text-lg">No referrals found.</div>
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
                          Club / Code {renderSortArrow('clubName')}
                        </th>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-gray-200" onClick={() => handleSort('user')}>
                          Referrer {renderSortArrow('user')}
                        </th>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-gray-200" onClick={() => handleSort('status')}>
                          Status {renderSortArrow('status')}
                        </th>
                        <th className="p-5 text-right font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedReferrals.map((ref) => (
                        <tr key={ref.id} className="hover:bg-dreamxec-cream/50 transition-colors">
                          <td className="p-5 text-sm text-gray-500 font-mono">{new Date(ref.createdAt).toLocaleDateString()}</td>
                          <td className="p-5">
                            <div className="font-bold text-dreamxec-navy text-lg font-display">{ref.clubName}</div>
                            <div className="text-xs text-gray-500 font-mono mt-1">ID: {ref.id.slice(-6)}</div>
                          </td>
                          <td className="p-5">
                            <div className="text-sm font-bold text-dreamxec-navy">{ref.referrerEmail}</div>
                            <div className="text-xs text-gray-500 font-mono mt-1">Nominee: {ref.presidentName}</div>
                          </td>
                          <td className="p-5">
                            <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase border-2 shadow-sm ${ref.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' : ref.status === 'REJECTED' || ref.status === 'DISABLED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                              {ref.status}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setSelectedReferral(ref)} className="p-2 bg-gray-100 text-gray-700 rounded-lg border hover:bg-gray-200" title="View Full Details">
                                <EyeIcon className="w-5 h-5" />
                              </button>
                              
                              {/* ACTION BUTTONS (Requirement #6) */}
                              {ref.status === 'PENDING' && (
                                <>
                                  <button onClick={() => handleStatusUpdate(ref.id, 'APPROVED')} className="px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg font-bold text-xs hover:bg-green-100">Approve</button>
                                  <button onClick={() => handleStatusUpdate(ref.id, 'REJECTED')} className="px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg font-bold text-xs hover:bg-red-100">Reject</button>
                                </>
                              )}
                              {ref.status === 'APPROVED' && (
                                <button onClick={() => handleStatusUpdate(ref.id, 'DISABLED')} className="px-3 py-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-lg font-bold text-xs hover:bg-gray-200">Disable</button>
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

      {selectedReferral && (
        <ReferralDetailsModal 
          referral={selectedReferral} 
          onClose={() => setSelectedReferral(null)}
          onApprove={() => handleStatusUpdate(selectedReferral.id, 'APPROVED')}
          onReject={() => handleStatusUpdate(selectedReferral.id, 'REJECTED')}
        />
      )}
    </div>
  );
}
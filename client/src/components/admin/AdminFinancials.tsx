import React, { useEffect, useState, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';
import Pagination from './Pagination';
import { getAdminDonations, getAdminWithdrawals, processWithdrawal } from '../../services/adminService';
import { StarDecoration } from '../icons/StarDecoration';

// Icons
const Icons = {
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
};

export default function AdminFinancials() {
  const [activeTab, setActiveTab] = useState<'donations' | 'pending_withdrawals' | 'completed_withdrawals'>('donations');
  
  // Data States
  const [donations, setDonations] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Sorting States
  const [page, setPage] = useState(1);
  const [donationsPagination, setDonationsPagination] = useState({ totalPages: 1, total: 0 });
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });

  useEffect(() => {
    fetchData();
  }, [activeTab, page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'donations') {
        // Backend handles pagination for donations
        const res = await getAdminDonations(page, 20); 
        setDonations(res.data.donations || res.data || []);
        if (res.data.pagination) setDonationsPagination(res.data.pagination);
      } else {
        // Backend filters by status. We handle client-side pagination for withdrawals
        const status = activeTab === 'pending_withdrawals' ? 'pending' : 'approved';
        const res = await getAdminWithdrawals(status);
        setWithdrawals(res.data.withdrawals || res.data || []);
      }
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // Sort & Paginate Withdrawals (Client Side)
  const itemsPerPage = 20;
  const sortedWithdrawals = useMemo(() => {
    let sortable = [...withdrawals];
    sortable.sort((a, b) => {
      if (sortConfig.key === 'amount') return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      if (sortConfig.key === 'campaign') return sortConfig.direction === 'asc' ? (a.userProject?.title || '').localeCompare(b.userProject?.title || '') : (b.userProject?.title || '').localeCompare(a.userProject?.title || '');
      
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return sortable;
  }, [withdrawals, sortConfig]);

  const paginatedWithdrawals = sortedWithdrawals.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const withdrawalTotalPages = Math.ceil(sortedWithdrawals.length / itemsPerPage);

  const handleWithdrawalAction = async (id: string, action: 'approved' | 'rejected') => {
    if (!window.confirm(`Are you sure you want to ${action} this request?`)) return;
    try {
      await processWithdrawal(id, action);
      fetchData(); 
    } catch (error) {
      alert("Action failed");
    }
  };

  const renderSortArrow = (key: string) => sortConfig.key === key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '';

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <AdminSidebar />
      
      <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">
        <div className="absolute top-10 left-10 opacity-10 pointer-events-none">
          <StarDecoration className="w-24 h-24" color="#0B9C2C" />
        </div>

        <div className="relative z-10 w-full">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
                Financials <StarDecoration className="w-8 h-8 hidden sm:block" color="#0B9C2C" />
              </h1>
              <p className="text-gray-600 mt-2 font-sans text-lg">Manage donation logs and payouts.</p>
            </div>
            
            {/* Tabs featuring the requested "Completed Transactions" section */}
            <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-xl border-2 border-dreamxec-navy/20 shadow-sm">
              <button 
                onClick={() => { setActiveTab('donations'); setPage(1); }}
                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'donations' ? 'bg-dreamxec-navy text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Captured Donations
              </button>
              <button 
                onClick={() => { setActiveTab('pending_withdrawals'); setPage(1); }}
                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'pending_withdrawals' ? 'bg-dreamxec-orange text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Pending Payouts 
                {activeTab === 'pending_withdrawals' && withdrawals.length > 0 && <span className="bg-white text-dreamxec-orange px-2 py-0.5 rounded-full text-xs">{withdrawals.length}</span>}
              </button>
              <button 
                onClick={() => { setActiveTab('completed_withdrawals'); setPage(1); }}
                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'completed_withdrawals' ? 'bg-dreamxec-green text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Completed Payouts
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden flex flex-col">
            
            {loading ? (
              <div className="p-12 text-center text-gray-500 animate-pulse font-bold font-display text-xl">Loading records...</div>
            ) : activeTab === 'donations' ? (
              
              // --- DONATIONS TABLE ---
              <>
                <div className="overflow-y-auto max-h-[600px] relative">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20 sticky top-0 z-20 shadow-sm">
                      <tr>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Donor</th>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Campaign</th>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Amount</th>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {donations.length === 0 ? (
                        <tr><td colSpan={4} className="p-12 text-center text-gray-500 font-display text-lg">No donations found.</td></tr>
                      ) : (
                        donations.map((d: any) => (
                          <tr key={d.id} className="hover:bg-dreamxec-cream/50 transition-colors">
                            <td className="p-5">
                              <div className="font-bold text-dreamxec-navy text-lg font-display">{d.donor?.name || d.user?.name || d.guestName || 'Anonymous'}</div>
                              <div className="text-sm text-gray-500 font-mono mt-1">{d.donor?.email || d.user?.email || d.guestEmail}</div>
                            </td>
                            <td className="p-5 text-sm font-bold text-dreamxec-navy">{d.userProject?.title}</td>
                            <td className="p-5 font-mono font-bold text-green-600 text-lg">₹{d.amount.toLocaleString()}</td>
                            <td className="p-5 text-sm text-gray-500 font-mono">{new Date(d.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination page={page} totalPages={donationsPagination.totalPages} setPage={setPage} />
              </>

            ) : (
              
              // --- WITHDRAWALS TABLE (Pending & Completed) ---
              <>
                <div className="overflow-y-auto max-h-[600px] relative">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20 sticky top-0 z-20 shadow-sm">
                      <tr>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-dreamxec-navy/5" onClick={() => handleSort('campaign')}>
                          Campaign / User {renderSortArrow('campaign')}
                        </th>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-dreamxec-navy/5" onClick={() => handleSort('amount')}>
                          Payout Amount {renderSortArrow('amount')}
                        </th>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-dreamxec-navy/5" onClick={() => handleSort('createdAt')}>
                          Request Date {renderSortArrow('createdAt')}
                        </th>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Bank Details</th>
                        {activeTab === 'pending_withdrawals' && (
                          <th className="p-5 text-right font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedWithdrawals.length === 0 ? (
                        <tr><td colSpan={5} className="p-12 text-center text-gray-500 font-display text-lg">No records found.</td></tr>
                      ) : (
                        paginatedWithdrawals.map((w: any) => (
                          <tr key={w.id} className="hover:bg-dreamxec-cream/50 transition-colors">
                            <td className="p-5">
                              <div className="font-bold text-dreamxec-navy text-lg font-display">{w.userProject?.title}</div>
                              <div className="text-sm text-gray-500 mt-1">By {w.userProject?.user?.name}</div>
                            </td>
                            <td className="p-5">
                              <div className="font-mono font-bold text-2xl text-dreamxec-navy">₹{w.amount.toLocaleString()}</div>
                              {activeTab === 'pending_withdrawals' && (
                                <div className="text-sm text-gray-500 mt-1">Raised: <span className="font-bold text-green-600">₹{w.userProject?.amountRaised?.toLocaleString() || 0}</span></div>
                              )}
                            </td>
                            <td className="p-5 text-sm text-gray-600 font-mono">
                              {new Date(w.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-5 text-sm font-mono bg-gray-50/50">
                              {w.userProject?.bankAccount ? (
                                <div className="space-y-1">
                                  <div className="font-bold text-dreamxec-navy">{w.userProject.bankAccount.bankName}</div>
                                  <div className="text-gray-600">AC: {w.userProject.bankAccount.accountNumber}</div>
                                  <div className="text-gray-600">IFSC: {w.userProject.bankAccount.ifscCode}</div>
                                </div>
                              ) : (
                                <span className="text-red-500 font-bold bg-red-50 px-3 py-1 rounded-full border border-red-200">No Bank Linked</span>
                              )}
                            </td>
                            {activeTab === 'pending_withdrawals' && (
                              <td className="p-5 text-right">
                                <div className="flex justify-end gap-3">
                                  <button onClick={() => handleWithdrawalAction(w.id, 'approved')} className="p-2.5 bg-green-50 text-green-700 rounded-lg border-2 border-green-200 shadow-sm hover:bg-green-100">
                                    <Icons.Check />
                                  </button>
                                  <button onClick={() => handleWithdrawalAction(w.id, 'rejected')} className="p-2.5 bg-red-50 text-red-700 rounded-lg border-2 border-red-200 shadow-sm hover:bg-red-100">
                                    <Icons.X />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination page={page} totalPages={withdrawalTotalPages} setPage={setPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
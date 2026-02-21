import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { getAdminDonations, getAdminWithdrawals, processWithdrawal } from '../services/adminService';
import { StarDecoration } from './icons';

// Icons
const Icons = {
  Download: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
};

export default function AdminFinancials() {
  const [activeTab, setActiveTab] = useState<'donations' | 'withdrawals'>('donations');
  const [donations, setDonations] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'donations') {
        const res = await getAdminDonations();
        setDonations(res.data.donations);
      } else {
        const res = await getAdminWithdrawals('pending');
        setWithdrawals(res.data.withdrawals);
      }
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalAction = async (id: string, action: 'approved' | 'rejected') => {
    if (!window.confirm(`Are you sure you want to ${action} this request?`)) return;
    try {
      await processWithdrawal(id, action);
      fetchData(); // Refresh list
    } catch (error) {
      alert("Action failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <AdminSidebar />
      
      {/* Main Content Area - Fluid full width layout */}
      <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-10 left-10 opacity-10 pointer-events-none">
          <StarDecoration className="w-24 h-24" color="#0B9C2C" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full">
          
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
                Financials <StarDecoration className="w-8 h-8 hidden sm:block" color="#0B9C2C" />
              </h1>
              <p className="text-gray-600 mt-2 font-sans text-lg">Manage donation logs and withdrawal requests.</p>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-3 mt-4 md:mt-0">
              <button 
                onClick={() => setActiveTab('donations')}
                className={`px-6 py-2.5 rounded-xl font-bold font-display tracking-wide transition-all border-2 shadow-sm ${
                  activeTab === 'donations' 
                    ? 'bg-dreamxec-navy text-white border-dreamxec-navy scale-105' 
                    : 'bg-white text-dreamxec-navy border-dreamxec-navy/20 hover:border-dreamxec-navy hover:bg-dreamxec-navy/5'
                }`}
              >
                Donation Log
              </button>
              <button 
                onClick={() => setActiveTab('withdrawals')}
                className={`px-6 py-2.5 rounded-xl font-bold font-display tracking-wide transition-all border-2 shadow-sm flex items-center gap-2 ${
                  activeTab === 'withdrawals' 
                    ? 'bg-dreamxec-navy text-white border-dreamxec-navy scale-105' 
                    : 'bg-white text-dreamxec-navy border-dreamxec-navy/20 hover:border-dreamxec-navy hover:bg-dreamxec-navy/5'
                }`}
              >
                Withdrawals
                {withdrawals.length > 0 && (
                  <span className="bg-dreamxec-orange text-white px-2.5 py-0.5 rounded-full text-xs shadow-sm">
                    {withdrawals.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden">
            
            {loading ? (
              <div className="p-12 text-center text-gray-500 animate-pulse font-bold font-display text-xl">Loading records...</div>
            ) : activeTab === 'donations' ? (
              
              // --- DONATIONS TABLE ---
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20">
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
            ) : (
              
              // --- WITHDRAWALS TABLE ---
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20">
                    <tr>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Campaign / User</th>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Amount</th>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Bank Details</th>
                      <th className="p-5 text-right font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {withdrawals.length === 0 ? (
                      <tr><td colSpan={4} className="p-12 text-center text-gray-500 font-display text-lg">No pending withdrawal requests.</td></tr>
                    ) : (
                      withdrawals.map((w: any) => (
                        <tr key={w.id} className="hover:bg-dreamxec-cream/50 transition-colors">
                          <td className="p-5">
                            <div className="font-bold text-dreamxec-navy text-lg font-display">{w.userProject?.title}</div>
                            <div className="text-sm text-gray-500 mt-1">By {w.userProject?.user?.name}</div>
                          </td>
                          <td className="p-5">
                            <div className="font-mono font-bold text-2xl text-dreamxec-navy">₹{w.amount.toLocaleString()}</div>
                            <div className="text-sm text-gray-500 mt-1">Raised: <span className="font-bold text-green-600">₹{w.userProject?.amountRaised.toLocaleString()}</span></div>
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
                          <td className="p-5 text-right">
                            <div className="flex justify-end gap-3">
                              <button 
                                onClick={() => handleWithdrawalAction(w.id, 'approved')}
                                className="p-2.5 bg-green-50 text-green-700 rounded-lg border-2 border-green-200 shadow-sm hover:bg-green-100 transition-colors"
                                title="Approve Payout"
                              >
                                <Icons.Check />
                              </button>
                              <button 
                                onClick={() => handleWithdrawalAction(w.id, 'rejected')}
                                className="p-2.5 bg-red-50 text-red-700 rounded-lg border-2 border-red-200 shadow-sm hover:bg-red-100 transition-colors"
                                title="Reject Request"
                              >
                                <Icons.X />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
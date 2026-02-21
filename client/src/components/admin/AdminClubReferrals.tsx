import React, { useEffect, useState } from 'react';
import AdminSidebar from '../AdminSidebar';
import { getClubReferrals, updateReferralStatus } from '../../services/adminService';
import ReferralDetailsModal from './ReferralDetailsModal';
import { StarDecoration } from '../icons/StarDecoration';
import { EyeIcon } from 'lucide-react';

// Icons
const Icons = {
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
  Eye: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
};

export default function AdminClubReferrals() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReferral, setSelectedReferral] = useState<any | null>(null);

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      setLoading(true);
      const res = await getClubReferrals();
      // Handle array vs nested data object
      setReferrals(Array.isArray(res.data) ? res.data : (res.data as any).data || []);
    } catch (error) {
      console.error('Failed to load referrals', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const notes = prompt(`Enter notes for ${status} (Optional):`);
    try {
      await updateReferralStatus(id, status, notes || '');
      loadReferrals();
      setSelectedReferral(null);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <AdminSidebar />
      
      {/* Main Content Area - Fluid full width layout */}
      <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-10 left-10 z-0 opacity-10 pointer-events-none">
          <StarDecoration className="w-24 h-24" color="#0B9C2C" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
                Club Referrals <StarDecoration className="w-8 h-8 hidden sm:block" color="#FF7F00" />
              </h1>
              <p className="text-gray-600 mt-2 font-sans text-lg">Manage student referrals for new club chapters.</p>
            </div>

            <button 
              onClick={loadReferrals} 
              className="px-6 py-2.5 bg-white text-dreamxec-navy rounded-xl border-2 border-dreamxec-navy/20 shadow-sm font-bold font-display hover:bg-dreamxec-navy/5 transition-all"
            >
              Refresh List
            </button>
          </div>

          <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-navy overflow-hidden">
            
            {/* Header Row count */}
            <div className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20 p-5 flex items-center gap-3">
              <h2 className="text-xl font-bold text-dreamxec-navy font-display">
                Pending Referrals
              </h2>
              <span className="bg-dreamxec-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {referrals.length} Total
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-gray-500 animate-pulse font-bold font-display text-xl">Loading referrals...</div>
            ) : referrals.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">🤝</div>
                <h3 className="text-2xl font-bold text-dreamxec-navy font-display">No Pending Referrals</h3>
                <p className="text-gray-500 font-sans mt-2">Check back later for new club chapter recommendations.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Club Name</th>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Referrer</th>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">President Nominee</th>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Status</th>
                      <th className="p-5 text-right font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {referrals.map((ref) => (
                      <tr key={ref.id} className="hover:bg-dreamxec-cream/50 transition-colors group">
                        <td className="p-5 font-bold text-dreamxec-navy text-lg font-display">{ref.clubName}</td>
                        <td className="p-5 text-sm font-mono text-gray-600">{ref.referrerEmail}</td>
                        <td className="p-5">
                          <div className="font-bold text-sm text-dreamxec-navy">{ref.presidentName}</div>
                          <div className="text-xs text-gray-500 font-mono mt-1">{ref.presidentEmail}</div>
                        </td>
                        <td className="p-5">
                          <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase border-2 shadow-sm ${
                            ref.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                            ref.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {ref.status}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <button 
                            onClick={() => setSelectedReferral(ref)}
                            className="inline-flex items-center justify-center p-2.5 bg-white text-dreamxec-navy rounded-lg border-2 border-dreamxec-navy/20 shadow-sm hover:bg-dreamxec-navy/5 hover:border-dreamxec-navy transition-all"
                            title="View Details"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
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
import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { getAllDonors, toggleDonorVerification, manageDonorStatus } from '../../services/adminService';
import { StarDecoration } from '../icons';

// Icons
const Icons = {
  CheckBadge: () => <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
  Block: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
};

export default function AdminDonors() {
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllDonors();
      setDonors(res.data.donors);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string, currentStatus: boolean) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'unverify' : 'verify'} this donor?`)) return;
    try {
      await toggleDonorVerification(id, !currentStatus);
      // Optimistic update
      setDonors(prev => prev.map(d => d.id === id ? { ...d, verified: !currentStatus } : d));
    } catch (error) {
      alert("Action failed");
    }
  };

  const handleStatusChange = async (id: string, status: 'ACTIVE' | 'BLOCKED') => {
    if (!window.confirm(`Change status to ${status}?`)) return;
    try {
      await manageDonorStatus(id, status);
      setDonors(prev => prev.map(d => d.id === id ? { ...d, accountStatus: status } : d));
    } catch (error) {
      alert("Action failed");
    }
  };

  const filtered = donors.filter(d => 
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <AdminSidebar />
      
      {/* Main Content Area - Fluid full width layout */}
      <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-20 z-0 opacity-20 pointer-events-none">
          <StarDecoration className="w-24 h-24" color="#8B5CF6" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
                Donor Management <StarDecoration className="w-8 h-8 hidden sm:block" color="#FF7F00" />
              </h1>
              <p className="text-gray-600 mt-2 font-sans text-lg">Manage donor accounts and organization verification.</p>
            </div>
            
            <div className="relative w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search donors..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-10 py-3 rounded-xl border-2 border-dreamxec-navy w-full md:w-80 focus:ring-2 focus:ring-dreamxec-orange bg-white shadow-sm font-sans"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20">
                  <tr>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Organization / Name</th>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Contact</th>
                    <th className="p-5 text-center font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Impact</th>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Status</th>
                    <th className="p-5 text-right font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500 font-bold font-display text-xl animate-pulse">Loading donors...</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500 font-display text-lg">No donors match your search.</td>
                    </tr>
                  ) : (
                    filtered.map((d: any) => (
                      <tr key={d.id} className="hover:bg-dreamxec-cream/50 transition-colors">
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-dreamxec-navy text-lg font-display">{d.organizationName || d.name}</span>
                            {d.verified && <Icons.CheckBadge />}
                          </div>
                          {d.organizationName && <div className="text-sm text-gray-500 font-sans mt-1">Rep: {d.name}</div>}
                        </td>
                        <td className="p-5 text-sm font-mono text-gray-600">{d.email}</td>
                        <td className="p-5 text-center">
                          <div className="flex justify-center gap-4 text-sm font-mono text-gray-600">
                            <span title="Donations Made">💸 {d._count?.donations || 0}</span>
                            <span title="Projects Funded">🚀 {d._count?.donorProjects || 0}</span>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border-2 shadow-sm ${
                            d.accountStatus === 'ACTIVE' || !d.accountStatus ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {d.accountStatus || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-3 items-center">
                            {/* Verify Toggle */}
                            <button 
                              onClick={() => handleVerify(d.id, d.verified)}
                              className={`p-2 rounded-lg border-2 shadow-sm transition-colors ${
                                d.verified 
                                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                              }`}
                              title={d.verified ? "Unverify Organization" : "Verify Organization"}
                            >
                              <Icons.CheckBadge />
                            </button>

                            {/* Block/Unblock */}
                            {d.accountStatus === 'ACTIVE' || !d.accountStatus ? (
                              <button 
                                onClick={() => handleStatusChange(d.id, 'BLOCKED')}
                                className="p-2 bg-red-50 text-red-700 rounded-lg border-2 border-red-200 shadow-sm hover:bg-red-100 transition-colors"
                                title="Block Account"
                              >
                                <Icons.Block />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleStatusChange(d.id, 'ACTIVE')}
                                className="p-2 bg-green-50 text-green-700 rounded-lg border-2 border-green-200 shadow-sm hover:bg-green-100 transition-colors"
                                title="Unblock Account"
                              >
                                <Icons.Check />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { getAdminApplications, overrideApplicationStatus } from '../services/adminService';
import { StarDecoration } from './icons';

export default function AdminApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAdminApplications();
      setApplications(res.data.applications);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOverride = async (id: string, newStatus: 'ACCEPTED' | 'REJECTED') => {
    let reason = '';
    if (newStatus === 'REJECTED') {
      reason = prompt("Provide reason for rejection (mandatory):") || '';
      if (!reason) return;
    }

    if (!window.confirm(`Are you sure you want to FORCE ${newStatus} this application?`)) return;

    try {
      await overrideApplicationStatus(id, newStatus, reason);
      // Optimistic Update
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    } catch (error) {
      alert("Action failed");
    }
  };

  const filteredApps = applications.filter(app => 
    app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.donorProject?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <AdminSidebar />
      
      {/* Main Content Area - Fluid full width layout */}
      <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-20 z-0 opacity-20 pointer-events-none">
          <StarDecoration className="w-24 h-24" color="#000080" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
                Application Tracker <StarDecoration className="w-8 h-8 hidden sm:block" color="#FF7F00" />
              </h1>
              <p className="text-gray-600 mt-2 font-sans text-lg">Monitor and override student applications to corporate projects.</p>
            </div>
            
            <div className="relative w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search student or project..." 
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
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Student</th>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Applied To</th>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Skills</th>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Status</th>
                    <th className="p-5 text-right font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Admin Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500 font-bold font-display text-xl animate-pulse">Loading applications...</td>
                    </tr>
                  ) : filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500 font-display text-lg">No applications found.</td>
                    </tr>
                  ) : (
                    filteredApps.map((app: any) => (
                      <tr key={app.id} className="hover:bg-dreamxec-cream/50 transition-colors">
                        <td className="p-5">
                          <div className="font-bold text-dreamxec-navy text-lg font-display">{app.user?.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500 font-mono mt-1">{app.user?.email}</div>
                        </td>
                        <td className="p-5">
                          <div className="font-bold text-sm text-dreamxec-navy">{app.donorProject?.title}</div>
                          <div className="text-xs text-gray-500 font-mono mt-1">By {app.donorProject?.organization}</div>
                        </td>
                        <td className="p-5 max-w-[250px]">
                          <div className="flex flex-wrap gap-1.5">
                            {app.skills?.slice(0, 3).map((skill: string, i: number) => (
                              <span key={i} className="text-[10px] bg-white border-2 border-dreamxec-orange/50 px-2.5 py-1 rounded-full text-dreamxec-navy font-bold shadow-sm">
                                {skill}
                              </span>
                            ))}
                            {app.skills?.length > 3 && (
                              <span className="text-[10px] text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
                                +{app.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border-2 shadow-sm ${
                            app.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border-green-200' : 
                            app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                           <div className="flex justify-end gap-3 items-center">
                             <button 
                               onClick={() => handleOverride(app.id, 'ACCEPTED')}
                               className="text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg border-2 border-green-200 shadow-sm transition-colors"
                             >
                               Force Accept
                             </button>
                             <button 
                               onClick={() => handleOverride(app.id, 'REJECTED')}
                               className="text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg border-2 border-red-200 shadow-sm transition-colors"
                             >
                               Force Reject
                             </button>
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
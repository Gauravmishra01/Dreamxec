import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import apiRequest from '../../services/api'; // Adjusted path if needed based on your structure
import { StarDecoration } from '../icons';

interface Club {
  id: string;
  name: string;
  college: string;
  presidentEmail: string;
  status: 'ACTIVE' | 'SUSPENDED';
  presidentUser?: {
    name: string;
    email: string;
  };
  _count: {
    members: number;
    campaigns: number;
  };
  createdAt: string;
}

export default function AdminClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  async function fetchClubs() {
    try {
      setLoading(true);
      const res = await apiRequest<{ clubs: Club[] }>('/admin/clubs', { method: 'GET' });
      setClubs(res.data.clubs);
    } catch (error) {
      console.error("Failed to load clubs", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(clubId: string, newStatus: string) {
    if (!window.confirm(`Are you sure you want to set this club to ${newStatus}?`)) return;
    try {
      await apiRequest(`/admin/clubs/${clubId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchClubs(); // Refresh
    } catch (error) {
      alert("Failed to update status");
    }
  }

  const filtered = clubs.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.college.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // 1. Added flex layout here
    <div className="flex min-h-screen bg-transparent relative">
      
      {/* 2. Added the Sidebar component */}
      <AdminSidebar />

      {/* 3. Main Content Area - Fluid full width layout */}
      <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-20 z-0 opacity-20 pointer-events-none">
          <StarDecoration className="w-24 h-24" color="#F97316" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
                Club Management <StarDecoration className="w-8 h-8 hidden sm:block" color="#F97316" />
              </h1>
              <p className="text-gray-600 mt-2 font-sans text-lg">Active Chapters: {clubs.length}</p>
            </div>
            
            <div className="relative w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search clubs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-10 py-3 rounded-xl border-2 border-dreamxec-navy w-full md:w-80 focus:ring-2 focus:ring-dreamxec-orange bg-white shadow-sm font-sans"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-green overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20">
                  <tr>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Club Details</th>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">President</th>
                    <th className="p-5 text-center font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Stats</th>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Status</th>
                    <th className="p-5 text-right font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500 font-bold font-display text-xl animate-pulse">Loading clubs...</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500 font-display text-lg">No clubs match your search.</td>
                    </tr>
                  ) : (
                    filtered.map(club => (
                      <tr key={club.id} className="hover:bg-dreamxec-cream/50 transition-colors">
                        <td className="p-5">
                          <div className="font-bold text-dreamxec-navy text-lg font-display">{club.name}</div>
                          <div className="text-sm text-gray-500 font-sans mt-1">{club.college}</div>
                        </td>
                        <td className="p-5">
                          <div className="font-bold text-sm text-dreamxec-navy">{club.presidentUser?.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500 font-mono mt-1">{club.presidentEmail}</div>
                        </td>
                        <td className="p-5 text-center">
                          <div className="flex justify-center gap-4 text-sm font-mono text-gray-600">
                            <span title="Members">👥 {club._count.members}</span>
                            <span title="Campaigns">🚀 {club._count.campaigns}</span>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border-2 shadow-sm tracking-wide ${
                            club.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {club.status}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          {club.status === 'ACTIVE' ? (
                            <button 
                              onClick={() => handleStatusChange(club.id, 'SUSPENDED')}
                              className="text-red-600 hover:text-red-800 font-bold text-sm underline decoration-2 underline-offset-4 transition-colors"
                            >
                              Suspend Club
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleStatusChange(club.id, 'ACTIVE')}
                              className="text-green-600 hover:text-green-800 font-bold text-sm underline decoration-2 underline-offset-4 transition-colors"
                            >
                              Activate Club
                            </button>
                          )}
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
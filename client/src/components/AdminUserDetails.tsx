import React, { useEffect, useState } from 'react';
import { getUserFullDetails } from '../services/adminService';
import AdminNotesPanel from './AdminNotesPanel';
import { StarDecoration } from './icons';

interface Props {
  userId: string;
  onClose: () => void;
}

export default function AdminUserDetails({ userId, onClose }: Props) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [userId]);

  const fetchDetails = async () => {
    try {
      const res = await getUserFullDetails(userId);
      setUser(res.data.user);
    } catch (error) {
      console.error("Failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center p-4 bg-dreamxec-navy/90 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-dreamxec-cream p-6 border-b-4 border-dreamxec-navy flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-dreamxec-navy font-display">User Profile</h2>
            <p className="text-dreamxec-navy/70 text-sm">ID: {userId}</p>
          </div>
          <button onClick={onClose} className="text-dreamxec-navy hover:text-red-600 font-bold text-xl">✕</button>
        </div>

        {loading || !user ? (
          <div className="p-12 text-center">Loading...</div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Col: Info */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Basic Info */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-dreamxec-navy rounded-full flex items-center justify-center text-white text-3xl font-display">
                    {user.name?.[0] || 'U'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-dreamxec-navy">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-xs font-bold rounded">{user.role}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase font-bold">Campaigns</p>
                    <p className="text-2xl font-bold text-dreamxec-navy">{user.userProjects.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase font-bold">Total Donations</p>
                    <p className="text-2xl font-bold text-green-600">{user.donations.length}</p>
                  </div>
                </div>

                {/* Campaigns List */}
                <div>
                  <h4 className="font-bold text-dreamxec-navy mb-2 flex items-center gap-2">
                    <StarDecoration className="w-4 h-4" color="#F97316" /> Recent Campaigns
                  </h4>
                  {user.userProjects.length === 0 ? <p className="text-sm text-gray-400">No campaigns created.</p> : (
                    <ul className="space-y-2">
                      {user.userProjects.map((p: any) => (
                        <li key={p.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <span className="font-bold text-sm text-dreamxec-navy">{p.title}</span>
                          <span className={`text-xs px-2 py-1 rounded font-bold ${p.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>

              {/* Right Col: Notes */}
              <div className="md:col-span-1">
                <AdminNotesPanel entityType="user" entityId={user.id} />
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
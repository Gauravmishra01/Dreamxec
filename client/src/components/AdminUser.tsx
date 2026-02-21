import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminUserDetails from './AdminUserDetails'; // Ensure this modal is created from Step 11
import { getAllUsers, manageUserStatus } from '../services/adminService';
import type { User, AccountStatus } from '../types/index';
import { StarDecoration } from './icons';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data.users);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(userId: string, newStatus: AccountStatus) {
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    try {
      await manageUserStatus(userId, newStatus);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, accountStatus: newStatus } : u));
    } catch (error) {
      alert("Failed to update status");
    }
  }

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <AdminSidebar />

      {/* Render Modal if a user is selected */}
      {selectedUserId && (
        <AdminUserDetails userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      )}

      {/* Main Content Area - Fluid full width layout */}
      <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-20 z-0 opacity-20 pointer-events-none">
          <StarDecoration className="w-16 h-16" color="#FF7F00" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
                User Management <StarDecoration className="w-8 h-8 hidden sm:block" color="#0B9C2C" />
              </h1>
              <p className="text-gray-600 mt-2 font-sans text-lg">Total Users: {users.length}</p>
            </div>
            
            <div className="relative w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search users by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-10 py-3 rounded-xl border-2 border-dreamxec-navy w-full md:w-80 focus:ring-2 focus:ring-dreamxec-orange bg-white shadow-sm font-sans"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-navy overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20">
                  <tr>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">User Details</th>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Role</th>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Joined</th>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Status</th>
                    <th className="p-5 text-right font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={5} className="p-12 text-center text-gray-500 font-bold font-display text-xl animate-pulse">Loading users...</td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan={5} className="p-12 text-center text-gray-500 font-display text-lg">No users match your search.</td></tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-dreamxec-cream/50 transition-colors">
                        <td className="p-5">
                          <div className="font-bold text-dreamxec-navy text-lg font-display">{user.name || 'No Name'}</div>
                          <div className="text-sm text-gray-500 font-mono mt-1">{user.email}</div>
                        </td>
                        <td className="p-5">
                          <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase border-2 border-gray-200 tracking-wide text-gray-600 shadow-sm">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-5 text-sm text-gray-600 font-mono">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border-2 shadow-sm ${
                            user.accountStatus === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 
                            user.accountStatus === 'BLOCKED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}>
                            {user.accountStatus || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-4 items-center">
                            <button 
                              onClick={() => setSelectedUserId(user.id)}
                              className="text-dreamxec-navy hover:text-dreamxec-orange font-bold text-sm underline decoration-2 underline-offset-4 transition-colors"
                            >
                              View Profile
                            </button>
                            {user.accountStatus === 'ACTIVE' || !user.accountStatus ? (
                              <button 
                                onClick={() => handleStatusChange(user.id, 'BLOCKED')}
                                className="text-red-600 hover:text-red-800 font-bold text-sm underline decoration-2 underline-offset-4 transition-colors"
                              >
                                Block
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                                className="text-green-600 hover:text-green-800 font-bold text-sm underline decoration-2 underline-offset-4 transition-colors"
                              >
                                Unblock
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
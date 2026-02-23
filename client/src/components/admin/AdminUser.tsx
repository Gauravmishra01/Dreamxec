import React, { useEffect, useState, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminUserDetails from './AdminUserDetails';
import Pagination from './Pagination';
import { getAllUsers, manageUserStatus } from '../../services/adminService';
import type { User, AccountStatus } from '../../types';
import { StarDecoration } from '../icons/StarDecoration';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Phase 2: Filters, Sorting, and Pagination State
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });
  const itemsPerPage = 20;

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await getAllUsers();
      // Safely handle varying response structures
      const fetchedUsers = Array.isArray(res.data) ? res.data : (res.data?.users || []);
      setUsers(fetchedUsers as User[]);
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

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // 1. Filter
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // 2. Sort
  const sortedUsers = useMemo(() => {
    let sortable = [...filteredUsers];
    sortable.sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'asc'
          ? (a.name || '').localeCompare(b.name || '')
          : (b.name || '').localeCompare(a.name || '');
      }
      if (sortConfig.key === 'email') {
        return sortConfig.direction === 'asc' ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email);
      }
      if (sortConfig.key === 'role' || sortConfig.key === 'status') {
        const valA = sortConfig.key === 'role' ? a.role : (a.accountStatus || 'ACTIVE');
        const valB = sortConfig.key === 'role' ? b.role : (b.accountStatus || 'ACTIVE');
        return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      // Default: Date
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return sortable;
  }, [filteredUsers, sortConfig]);

  // 3. Paginate
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Ensure unique roles for the filter (e.g., STUDENT, ADMIN, etc.)
  const availableRoles = ['ALL', ...Array.from(new Set(users.map(u => u.role)))].filter(Boolean);

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <AdminSidebar />

      {selectedUserId && (
        <AdminUserDetails userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
      )}

      <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">
        <div className="absolute top-20 right-20 z-0 opacity-20 pointer-events-none">
          <StarDecoration className="w-16 h-16" color="#FF7F00" />
        </div>

        <div className="relative z-10 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
                User Management <StarDecoration className="w-8 h-8 hidden sm:block" color="#0B9C2C" />
              </h1>
              <p className="text-gray-600 mt-2 font-sans text-lg">Total Users: {filteredUsers.length}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="flex bg-white p-1 rounded-xl border-2 border-dreamxec-navy/20 shadow-sm overflow-x-auto">
                {availableRoles.map(role => (
                  <button
                    key={role} onClick={() => { setRoleFilter(role); setPage(1); }}
                    className={`px-4 py-2 rounded-lg font-bold text-xs tracking-wide transition-all ${roleFilter === role ? 'bg-dreamxec-navy text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <input
                type="text" placeholder="Search name or email..."
                value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="pl-4 pr-4 py-2.5 rounded-xl border-2 border-dreamxec-navy w-full sm:w-64 focus:ring-2 focus:ring-dreamxec-orange shadow-sm font-sans"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-navy overflow-hidden flex flex-col">
            <div className="overflow-x-auto overflow-y-auto max-h-[600px] relative">
              <table className="w-full text-left border-collapse">
                <thead className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20 sticky top-0 z-20 shadow-sm">
                  <tr>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-dreamxec-navy/5" onClick={() => handleSort('name')}>
                      User Details {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-dreamxec-navy/5" onClick={() => handleSort('role')}>
                      Role {sortConfig.key === 'role' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-dreamxec-navy/5" onClick={() => handleSort('createdAt')}>
                      Joined {sortConfig.key === 'createdAt' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-dreamxec-navy/5" onClick={() => handleSort('status')}>
                      Status {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th className="p-5 text-right font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={5} className="p-12 text-center text-gray-500 font-bold font-display text-xl animate-pulse">Loading users...</td></tr>
                  ) : paginatedUsers.length === 0 ? (
                    <tr><td colSpan={5} className="p-12 text-center text-gray-500 font-display text-lg">No users match your filters.</td></tr>
                  ) : (
                    paginatedUsers.map(user => (
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
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border-2 shadow-sm ${user.accountStatus === 'ACTIVE' || !user.accountStatus ? 'bg-green-50 text-green-700 border-green-200' :
                              user.accountStatus === 'BLOCKED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                            }`}>
                            {user.accountStatus || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-3 items-center">
                            <button onClick={() => setSelectedUserId(user.id)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded border font-bold text-xs">View Profile</button>
                            {user.accountStatus === 'ACTIVE' || !user.accountStatus ? (
                              <button onClick={() => handleStatusChange(user.id, 'BLOCKED')} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded font-bold text-xs">Block</button>
                            ) : (
                              <button onClick={() => handleStatusChange(user.id, 'ACTIVE')} className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded font-bold text-xs">Unblock</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Standardized Pagination */}
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>

        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { getAuditLogs } from '../services/adminService';
import { StarDecoration } from './icons';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('ALL');
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  useEffect(() => {
    fetchLogs();
  }, [page, filterType]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await getAuditLogs(page, 20, filterType === 'ALL' ? undefined : filterType);
      setLogs(res.data.logs);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('REJECT') || action.includes('BLOCK')) return 'text-red-700 bg-red-50 border-red-200';
    if (action.includes('APPROVE') || action.includes('VERIFY')) return 'text-green-700 bg-green-50 border-green-200';
    if (action.includes('WITHDRAWAL')) return 'text-purple-700 bg-purple-50 border-purple-200';
    return 'text-gray-700 bg-gray-50 border-gray-200';
  };

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <AdminSidebar />
      
      {/* Main Content Area - Fluid full width layout */}
      <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-10 left-10 z-0 opacity-10 pointer-events-none">
          <StarDecoration className="w-24 h-24" color="#003366" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
                System Activity <StarDecoration className="w-8 h-8 hidden sm:block" color="#FF7F00" />
              </h1>
              <p className="text-gray-600 mt-2 font-sans text-lg">Audit trail of all administrative actions.</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 md:gap-3 bg-white p-1.5 rounded-xl border-2 border-dreamxec-navy/20 shadow-sm">
              {['ALL', 'User', 'Project', 'Milestone', 'Withdrawal'].map(type => (
                <button
                  key={type}
                  onClick={() => { setFilterType(type); setPage(1); }}
                  className={`px-5 py-2.5 rounded-lg font-bold text-xs tracking-wide transition-all shadow-sm ${
                    filterType === type 
                      ? 'bg-dreamxec-navy text-white border-2 border-dreamxec-navy scale-105' 
                      : 'bg-white text-gray-500 border-2 border-transparent hover:border-dreamxec-navy/50 hover:bg-dreamxec-navy/5 hover:text-dreamxec-navy'
                  }`}
                >
                  {type === 'ALL' ? 'All Logs' : type + 's'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500 animate-pulse font-bold font-display text-xl">Loading activity logs...</div>
            ) : logs.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-display text-lg">No activity recorded yet.</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20">
                      <tr>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Action</th>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Entity</th>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Performed By</th>
                        <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Details</th>
                        <th className="p-5 text-right font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {logs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-dreamxec-cream/50 transition-colors">
                          <td className="p-5">
                            <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border-2 shadow-sm ${getActionColor(log.action)}`}>
                              {log.action.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="p-5">
                            <div className="font-bold text-dreamxec-navy text-lg font-display">{log.entityType}</div>
                            <div className="text-xs font-mono text-gray-500 mt-1">ID: {log.entityId.slice(-6)}...</div>
                          </td>
                          <td className="p-5">
                            <div className="font-bold text-dreamxec-navy text-sm">{log.admin?.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500 font-mono mt-1">{log.admin?.email}</div>
                          </td>
                          <td className="p-5 text-sm text-gray-600 font-sans max-w-xs truncate" title={log.details ? JSON.stringify(log.details) : ''}>
                            {log.details ? JSON.stringify(log.details) : '-'}
                          </td>
                          <td className="p-5 text-right text-sm font-mono text-gray-600">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-5 border-t-2 border-dreamxec-navy/10 flex justify-between items-center bg-gray-50/50">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-5 py-2.5 bg-white border-2 border-gray-200 rounded-lg hover:border-dreamxec-navy hover:text-dreamxec-navy disabled:opacity-50 disabled:hover:border-gray-200 font-bold text-sm text-gray-600 shadow-sm transition-all"
                  >
                    ← Previous
                  </button>
                  <span className="text-sm font-bold text-dreamxec-navy font-sans bg-white px-4 py-2 rounded-lg border-2 border-gray-200 shadow-sm">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <button 
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-5 py-2.5 bg-white border-2 border-gray-200 rounded-lg hover:border-dreamxec-navy hover:text-dreamxec-navy disabled:opacity-50 disabled:hover:border-gray-200 font-bold text-sm text-gray-600 shadow-sm transition-all"
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
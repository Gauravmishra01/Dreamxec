import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import Pagination from './Pagination';
import { getAuditLogs } from '@/services/adminService';
import { StarDecoration } from '../icons';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('ALL');
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  useEffect(() => { fetchLogs(); }, [page, filterType]);

const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await getAuditLogs(page, 20, filterType === 'ALL' ? undefined : filterType);
      
      // ✅ Crash-Proof Extraction
      if (res && res.data) {
        setLogs(res.data.logs || []);
        setPagination(res.data.pagination || { totalPages: 1, total: 0 });
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error("Fetch error", error);
      setLogs([]); 
      setPagination({ totalPages: 1, total: 0 });
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
      <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">
        <div className="relative z-10 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
                System Activity <StarDecoration className="w-8 h-8 hidden sm:block" color="#FF7F00" />
              </h1>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 bg-white p-1.5 rounded-xl border-2 border-dreamxec-navy/20 shadow-sm">
              {['ALL', 'User', 'UserProject', 'Milestone', 'Withdrawal'].map(type => (
                <button
                  key={type}
                  onClick={() => { setFilterType(type); setPage(1); }}
                  className={`px-5 py-2.5 rounded-lg font-bold text-xs tracking-wide transition-all shadow-sm ${
                    filterType === type ? 'bg-dreamxec-navy text-white scale-105' : 'bg-white text-gray-500 hover:bg-dreamxec-navy/5'
                  }`}
                >
                  {type === 'ALL' ? 'All Logs' : type.replace('UserProject', 'Campaign')}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500 animate-pulse font-bold font-display text-xl">Loading...</div>
            ) : (
              <>
                {/* STICKY HEADER IMPLEMENTED HERE via max-h and overflow-y-auto */}
                <div className="overflow-y-auto max-h-[600px] relative">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20 sticky top-0 z-20 shadow-sm">
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
                          <td className="p-5"><span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase border-2 ${getActionColor(log.action)}`}>{log.action.replace(/_/g, ' ')}</span></td>
                          {/* BUG FIX: log.entity instead of log.entityType */}
                          <td className="p-5"><div className="font-bold text-dreamxec-navy text-lg">{log.entity}</div><div className="text-xs text-gray-500">ID: {log.entityId.slice(-6)}</div></td>
                          <td className="p-5"><div className="font-bold text-dreamxec-navy text-sm">{log.admin?.name || 'System'}</div></td>
                          <td className="p-5 text-sm text-gray-600 max-w-xs truncate">{log.details ? JSON.stringify(log.details) : '-'}</td>
                          <td className="p-5 text-right text-sm text-gray-600">{new Date(log.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Standardized Pagination */}
                <Pagination page={page} totalPages={pagination.totalPages} setPage={setPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
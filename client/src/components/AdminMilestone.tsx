import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { getAllMilestones, verifyMilestone } from '../services/adminService';
import { StarDecoration } from './icons';

// Icons
const Icons = {
  Link: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
};

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  PENDING: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-400' },
  SUBMITTED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-400' },
  APPROVED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-400' },
  REJECTED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-400' },
};

type FilterStatus = '' | 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export default function AdminMilestones() {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({ PENDING: 0, SUBMITTED: 0, APPROVED: 0, REJECTED: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('');

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAllMilestones(filter || undefined);
      setMilestones(res.data.milestones);
      setCounts(res.data.counts);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const feedback = status === 'REJECTED' ? prompt("Enter feedback for rejection:") : '';
    if (status === 'REJECTED' && !feedback) return;

    if (!window.confirm(`Are you sure you want to ${status} this milestone?`)) return;

    try {
      await verifyMilestone(id, status, feedback || undefined);
      loadData(); // Refresh list
    } catch (error) {
      alert("Action failed");
    }
  };

  const filterTabs: { label: string; value: FilterStatus; color: string }[] = [
    { label: 'All', value: '', color: 'border-dreamxec-navy text-dreamxec-navy bg-white' },
    { label: 'Pending', value: 'PENDING', color: 'border-yellow-400 text-yellow-700 bg-yellow-50' },
    { label: 'Submitted', value: 'SUBMITTED', color: 'border-blue-400 text-blue-700 bg-blue-50' },
    { label: 'Approved', value: 'APPROVED', color: 'border-green-400 text-green-700 bg-green-50' },
    { label: 'Rejected', value: 'REJECTED', color: 'border-red-400 text-red-700 bg-red-50' },
  ];

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">

        {/* Decorative Background Elements */}
        <div className="absolute top-10 right-10 z-0 opacity-20 pointer-events-none">
          <StarDecoration className="w-24 h-24" color="#F97316" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full">

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
              Milestone Review <StarDecoration className="w-8 h-8 hidden sm:block" color="#FF7F00" />
            </h1>
            <p className="text-gray-600 mt-2 font-sans text-lg">View and manage all project milestones.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {([
              { label: 'Pending', key: 'PENDING', color: 'yellow' },
              { label: 'Submitted', key: 'SUBMITTED', color: 'blue' },
              { label: 'Approved', key: 'APPROVED', color: 'green' },
              { label: 'Rejected', key: 'REJECTED', color: 'red' },
            ] as const).map(s => (
              <div key={s.key} className={`bg-${s.color}-50 border-2 border-${s.color}-200 rounded-xl p-4 text-center`}>
                <p className={`text-3xl font-bold text-${s.color}-700 font-display`}>{counts[s.key] || 0}</p>
                <p className={`text-xs font-bold text-${s.color}-600 uppercase tracking-wider mt-1`}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filterTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-lg border-2 font-bold text-sm font-display transition-all hover:scale-105 ${filter === tab.value
                    ? tab.color + ' shadow-md scale-105'
                    : 'border-gray-200 text-gray-500 bg-white hover:border-gray-300'
                  }`}
              >
                {tab.label}
                {tab.value ? ` (${counts[tab.value] || 0})` : ` (${counts.total || 0})`}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500 animate-pulse font-bold font-display text-xl">Loading milestones...</div>
            ) : milestones.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-dreamxec-navy font-display">
                  {filter ? `No ${filter.toLowerCase()} milestones` : 'No milestones found'}
                </h3>
                <p className="text-gray-500 font-sans mt-2">
                  {filter ? 'Try selecting a different filter.' : 'Milestones will appear here when projects are created.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20">
                    <tr>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Milestone</th>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Campaign</th>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Status</th>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Proof</th>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Budget</th>
                      <th className="p-5 text-right font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {milestones.map((m: any) => {
                      const sc = STATUS_COLORS[m.status] || STATUS_COLORS.PENDING;
                      return (
                        <tr key={m.id} className="hover:bg-dreamxec-cream/50 transition-colors">
                          <td className="p-5">
                            <div className="font-bold text-dreamxec-navy text-lg font-display">{m.title}</div>
                            <div className="text-sm text-gray-500 font-mono mt-1">{m.timeline}</div>
                            {m.description && (
                              <div className="text-sm text-gray-400 mt-1 line-clamp-2">{m.description}</div>
                            )}
                          </td>
                          <td className="p-5">
                            <div className="font-bold text-sm text-dreamxec-navy">{m.project?.title}</div>
                            <div className="text-sm text-gray-500 mt-1">By {m.project?.user?.name || 'Unknown'}</div>
                          </td>
                          <td className="p-5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
                              <span className={`w-2 h-2 rounded-full ${sc.dot}`}></span>
                              {m.status}
                            </span>
                            {m.adminFeedback && (
                              <div className="text-xs text-gray-400 mt-1 italic max-w-[200px] truncate" title={m.adminFeedback}>
                                Feedback: {m.adminFeedback}
                              </div>
                            )}
                          </td>
                          <td className="p-5">
                            {m.proofUrl ? (
                              <a
                                href={m.proofUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-blue-300 rounded-full text-xs font-bold text-blue-600 shadow-sm hover:bg-blue-50 hover:text-blue-700 transition-colors"
                              >
                                View Proof <Icons.Link />
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs font-bold bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                                No Proof
                              </span>
                            )}
                          </td>
                          <td className="p-5 font-mono font-bold text-green-700 text-lg">₹{m.budget?.toLocaleString()}</td>
                          <td className="p-5 text-right">
                            {m.status === 'SUBMITTED' ? (
                              <div className="flex justify-end gap-3 items-center">
                                <button
                                  onClick={() => handleVerify(m.id, 'APPROVED')}
                                  className="p-2.5 bg-green-50 text-green-700 rounded-lg border-2 border-green-200 shadow-sm hover:bg-green-100 hover:scale-105 transition-transform"
                                  title="Approve"
                                >
                                  <Icons.Check />
                                </button>
                                <button
                                  onClick={() => handleVerify(m.id, 'REJECTED')}
                                  className="p-2.5 bg-red-50 text-red-700 rounded-lg border-2 border-red-200 shadow-sm hover:bg-red-100 hover:scale-105 transition-transform"
                                  title="Reject"
                                >
                                  <Icons.X />
                                </button>
                              </div>
                            ) : m.status === 'APPROVED' ? (
                              <span className="text-xs text-green-600 font-bold">
                                ✓ {m.approvedAt ? new Date(m.approvedAt).toLocaleDateString() : 'Approved'}
                              </span>
                            ) : m.status === 'REJECTED' ? (
                              <span className="text-xs text-red-600 font-bold">✗ Rejected</span>
                            ) : (
                              <span className="text-xs text-gray-400 font-bold">Awaiting submission</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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
import React, { useEffect, useState, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';
import { getAllMilestones, verifyMilestone } from '../services/adminService';
import { StarDecoration } from './icons';

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
  Link: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Chevron: ({ open }: { open: boolean }) => (
    <svg
      className={`w-5 h-5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Folder: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  ),
};

// ─── Types & Constants ────────────────────────────────────────────────────────
type FilterStatus = '' | 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

const STATUS_CONFIG = {
  PENDING:   { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-400',   label: 'Pending' },
  SUBMITTED: { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    dot: 'bg-blue-400',    label: 'Submitted' },
  APPROVED:  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400', label: 'Approved' },
  REJECTED:  { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     dot: 'bg-red-400',     label: 'Rejected' },
} as const;

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Milestone Row ────────────────────────────────────────────────────────────
function MilestoneRow({ m, onVerify }: { m: any; onVerify: (id: string, status: 'APPROVED' | 'REJECTED') => void }) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-start px-6 py-4 bg-white hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-0 group">

      {/* Left: Title + Meta */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-800 text-sm">{m.title}</span>
          <StatusBadge status={m.status} />
        </div>
        {m.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{m.description}</p>
        )}
        {m.timeline && (
          <p className="text-xs text-slate-400 font-mono mt-0.5">{m.timeline}</p>
        )}
        {m.adminFeedback && (
          <p className="text-xs text-rose-500 mt-1 italic">↳ {m.adminFeedback}</p>
        )}
      </div>

      {/* Budget */}
      <div className="text-right pt-0.5">
        <span className="text-sm font-bold text-emerald-700 font-mono">₹{m.budget?.toLocaleString()}</span>
      </div>

      {/* Proof */}
      <div className="flex items-center">
        {m.proofUrl ? (
          <a
            href={m.proofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Proof <Icons.Link />
          </a>
        ) : (
          <span className="text-xs text-slate-300 font-medium">—</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 justify-end">
        {m.status === 'SUBMITTED' ? (
          <>
            <button
              onClick={() => onVerify(m.id, 'APPROVED')}
              title="Approve"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 hover:scale-105 transition-all"
            >
              <Icons.Check /> Approve
            </button>
            <button
              onClick={() => onVerify(m.id, 'REJECTED')}
              title="Reject"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 hover:scale-105 transition-all"
            >
              <Icons.X /> Reject
            </button>
          </>
        ) : m.status === 'APPROVED' ? (
          <span className="text-xs text-emerald-600 font-semibold">
            ✓ {m.approvedAt ? new Date(m.approvedAt).toLocaleDateString() : 'Approved'}
          </span>
        ) : m.status === 'REJECTED' ? (
          <span className="text-xs text-rose-500 font-semibold">✗ Rejected</span>
        ) : (
          <span className="text-xs text-slate-300 font-medium">Awaiting submission</span>
        )}
      </div>
    </div>
  );
}

// ─── Campaign Accordion ───────────────────────────────────────────────────────
function CampaignAccordion({
  projectTitle,
  projectOwner,
  milestones,
  onVerify,
  defaultOpen,
}: {
  projectTitle: string;
  projectOwner: string;
  milestones: any[];
  onVerify: (id: string, status: 'APPROVED' | 'REJECTED') => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { PENDING: 0, SUBMITTED: 0, APPROVED: 0, REJECTED: 0 };
    milestones.forEach(m => { if (c[m.status] !== undefined) c[m.status]++; });
    return c;
  }, [milestones]);

  const totalBudget = milestones.reduce((sum, m) => sum + (m.budget ?? 0), 0);

  // Highlight ring: blue if any SUBMITTED, else default
  const hasSubmitted = statusCounts.SUBMITTED > 0;
  const ringClass = hasSubmitted
    ? 'border-blue-300 shadow-blue-100'
    : 'border-slate-200 shadow-slate-100';

  return (
    <div className={`rounded-xl border-2 shadow-sm overflow-hidden transition-shadow ${ringClass}`}>
      {/* ── Header ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 bg-white hover:bg-slate-50 transition-colors text-left"
      >
        {/* Folder icon */}
        <div className={`p-2 rounded-lg ${hasSubmitted ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-400'}`}>
          <Icons.Folder />
        </div>

        {/* Title + owner */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 text-base truncate">{projectTitle}</p>
          <p className="text-xs text-slate-400 mt-0.5">By {projectOwner}</p>
        </div>

        {/* Pill counts */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          {Object.entries(statusCounts).map(([status, count]) =>
            count > 0 ? (
              <span
                key={status}
                className={`px-2 py-0.5 rounded-full text-xs font-bold border ${STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].bg} ${STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].text} ${STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].border}`}
              >
                {count} {STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].label}
              </span>
            ) : null
          )}
        </div>

        {/* Budget */}
        <div className="text-right shrink-0 hidden md:block">
          <p className="text-xs text-slate-400 font-medium">Total Budget</p>
          <p className="text-sm font-bold text-emerald-700 font-mono">₹{totalBudget.toLocaleString()}</p>
        </div>

        {/* Count + chevron */}
        <div className="flex items-center gap-2 shrink-0 text-slate-500">
          <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
            {milestones.length} milestone{milestones.length !== 1 ? 's' : ''}
          </span>
          <Icons.Chevron open={open} />
        </div>
      </button>

      {/* ── Column Headers (only shown when expanded) ── */}
      {open && (
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-2 bg-slate-50 border-t border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Milestone</span>
          <span className="text-right">Budget</span>
          <span>Proof</span>
          <span className="text-right">Actions</span>
        </div>
      )}

      {/* ── Milestone Rows (animated) ── */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? `${milestones.length * 120}px` : '0px' }}
      >
        {milestones.map(m => (
          <MilestoneRow key={m.id} m={m} onVerify={onVerify} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminMilestones() {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({ PENDING: 0, SUBMITTED: 0, APPROVED: 0, REJECTED: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('');

  useEffect(() => { loadData(); }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAllMilestones(filter || undefined);
      setMilestones(res.data.milestones);
      setCounts(res.data.counts);
    } catch (err) {
      console.error('Fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const feedback = status === 'REJECTED' ? prompt('Enter feedback for rejection:') : '';
    if (status === 'REJECTED' && !feedback) return;
    if (!window.confirm(`Are you sure you want to ${status} this milestone?`)) return;
    try {
      await verifyMilestone(id, status, feedback || undefined);
      loadData();
    } catch {
      alert('Action failed');
    }
  };

  // Group milestones by project id
  const grouped = useMemo(() => {
    const map = new Map<string, { title: string; owner: string; items: any[] }>();
    milestones.forEach(m => {
      const pid = m.project?.id ?? 'unknown';
      if (!map.has(pid)) {
        map.set(pid, {
          title: m.project?.title ?? 'Untitled Campaign',
          owner: m.project?.user?.name ?? 'Unknown',
          items: [],
        });
      }
      map.get(pid)!.items.push(m);
    });
    return Array.from(map.entries());
  }, [milestones]);

  const filterTabs: { label: string; value: FilterStatus }[] = [
    { label: 'All',       value: '' },
    { label: 'Pending',   value: 'PENDING' },
    { label: 'Submitted', value: 'SUBMITTED' },
    { label: 'Approved',  value: 'APPROVED' },
    { label: 'Rejected',  value: 'REJECTED' },
  ];

  const tabActiveClass: Record<FilterStatus, string> = {
    '':          'bg-dreamxec-navy text-white border-dreamxec-navy',
    PENDING:     'bg-amber-500   text-white border-amber-500',
    SUBMITTED:   'bg-blue-500    text-white border-blue-500',
    APPROVED:    'bg-emerald-500 text-white border-emerald-500',
    REJECTED:    'bg-rose-500    text-white border-rose-500',
  };

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <AdminSidebar />

      <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">

        {/* Decorative */}
        <div className="absolute top-10 right-10 z-0 opacity-20 pointer-events-none">
          <StarDecoration className="w-24 h-24" color="#F97316" />
        </div>

        <div className="relative z-10 w-full max-w-5xl">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
              Milestone Review
              <StarDecoration className="w-8 h-8 hidden sm:block" color="#FF7F00" />
            </h1>
            <p className="text-gray-600 mt-2 font-sans text-lg">
              Grouped by campaign — review submitted milestones.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {([
              { label: 'Pending',   key: 'PENDING',   color: 'amber'   },
              { label: 'Submitted', key: 'SUBMITTED', color: 'blue'    },
              { label: 'Approved',  key: 'APPROVED',  color: 'emerald' },
              { label: 'Rejected',  key: 'REJECTED',  color: 'rose'    },
            ] as const).map(s => (
              <div key={s.key} className={`bg-${s.color}-50 border-2 border-${s.color}-200 rounded-xl p-4 text-center`}>
                <p className={`text-3xl font-bold text-${s.color}-700 font-display`}>{counts[s.key] || 0}</p>
                <p className={`text-xs font-bold text-${s.color}-500 uppercase tracking-wider mt-1`}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filterTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-lg border-2 font-bold text-sm font-display transition-all hover:scale-105 ${
                  filter === tab.value
                    ? tabActiveClass[tab.value] + ' shadow-md scale-105'
                    : 'border-slate-200 text-slate-500 bg-white hover:border-slate-300'
                }`}
              >
                {tab.label}
                {' '}
                <span className={`${filter === tab.value ? 'opacity-80' : 'opacity-60'} text-xs`}>
                  ({tab.value ? counts[tab.value] || 0 : counts.total || 0})
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="p-12 text-center text-gray-500 animate-pulse font-bold font-display text-xl rounded-xl border-2 border-slate-200 bg-white">
              Loading milestones...
            </div>
          ) : grouped.length === 0 ? (
            <div className="p-12 text-center rounded-xl border-2 border-slate-200 bg-white">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-dreamxec-navy font-display">
                {filter ? `No ${filter.toLowerCase()} milestones` : 'No milestones found'}
              </h3>
              <p className="text-gray-500 font-sans mt-2">
                {filter ? 'Try selecting a different filter.' : 'Milestones will appear here when projects are created.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {grouped.map(([pid, { title, owner, items }], idx) => (
                <CampaignAccordion
                  key={pid}
                  projectTitle={title}
                  projectOwner={owner}
                  milestones={items}
                  onVerify={handleVerify}
                  defaultOpen={idx === 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
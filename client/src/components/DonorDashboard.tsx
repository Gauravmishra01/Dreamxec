import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
import axios from 'axios';
import DonorAnalyticsChart from "./DonorAnalyticsChart";
import DonationHeatmap from './CalendarHeatmap';
import { ApiResponse } from '../services/api';

// ─── API Setup ────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(null, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserProject { id: string; title: string; organization?: string; }
interface Donation { id: string; amount: number; createdAt: string; message?: string; userProjectId: string; userProject: UserProject; }
interface ApplicationUser { name?: string; email?: string; }
interface DonorProject { title?: string; organization?: string; }
type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
interface Application { id: string; status: ApplicationStatus; coverLetter: string; skills?: string[]; createdAt: string; rejectionReason?: string; user?: ApplicationUser; donorProject?: DonorProject; }
interface Campaign { id: string; title: string; description?: string; imageUrl?: string; status: string; goalAmount: number; amountRaised?: number; }
interface Eligibility { canCreateOpportunity: boolean; createdProjects: number; allowedProjects: number; remainingProjects: number; perProjectCost: number; }
interface DonorDashboardProps { donorName: string; projectsCount: number; onCreateProject?: () => void; onViewProjects?: () => void; getDonorApplications: () => Promise<{ success: boolean; data?: { applications: Application[] } }>; updateApplicationStatus: (id: string, payload: { status: ApplicationStatus; rejectionReason?: string | null }) => Promise<ApiResponse<{ application: Application }>>; getDonationSummary: () => Promise<any>; }
interface Toast { id: number; message: string; type: 'success' | 'error' | 'info'; }
interface ToastApi { success: (msg: string) => void; error: (msg: string) => void; info: (msg: string) => void; }
interface ConfirmInfo { id: string; title: string; }
interface RejectionInfo { id: string; title: string; }

// ─── Utilities ────────────────────────────────────────────────────────────────
const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

const formatCurrency = (amount: number | undefined): string =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const exportCSV = (donations: Donation[]): void => {
  const headers = '"Project Title","Amount (₹)","Date","Message"\n';
  const rows = donations.map(d => `"${(d.userProject?.title || '').replace(/"/g, '""')}",${d.amount},"${formatDate(d.createdAt)}","${(d.message || '').replace(/"/g, '""')}"`).join('\n');
  const blob = new Blob([headers + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  URL.revokeObjectURL(url);
};

// ─── Toast System ─────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastApi | null>(null);

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  const toast: ToastApi = { success: (msg) => addToast(msg, 'success'), error: (msg) => addToast(msg, 'error'), info: (msg) => addToast(msg, 'info') };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className="px-4 py-3 pointer-events-auto max-w-sm text-sm font-black uppercase tracking-widest"
            style={{
              background: t.type === 'success' ? '#0B9C2C' : t.type === 'error' ? '#dc2626' : '#FF7F00',
              color: '#fff',
              border: '3px solid #003366',
              boxShadow: '4px 4px 0 #003366',
            }}
          >
            {t.type === 'success' && '✓ '}
            {t.type === 'error' && '✕ '}
            {t.type === 'info' && 'ℹ '}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const useToast = (): ToastApi => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

// ─── Icons ────────────────────────────────────────────────────────────────────
type IconName = 'dashboard' | 'folder' | 'file' | 'plus' | 'menu' | 'x' | 'check' | 'star' | 'heart' | 'trash' | 'refresh' | 'download' | 'alert' | 'check-circle' | 'x-circle' | 'clock';

const Ico: React.FC<{ name: IconName; className?: string }> = ({ name, className = 'w-5 h-5' }) => {
  const paths: Partial<Record<IconName, string>> = {
    dashboard: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    folder: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
    file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
    plus: 'M12 5v14M5 12h14',
    menu: 'M3 12h18M3 6h18M3 18h18',
    x: 'M18 6L6 18M6 6l12 12',
    check: 'M9 12l2 2 4-4',
    star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
    refresh: 'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15',
    download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
    alert: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
  };
  if (name === 'check-circle') return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></svg>;
  if (name === 'x-circle') return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>;
  if (name === 'clock') return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={paths[name] || ''} /></svg>;
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`} style={{ background: '#e0e7f0' }} />
);

const StatCardSkeleton: React.FC = () => (
  <div className="bg-white p-5" style={{ border: '3px solid #003366', boxShadow: '5px 5px 0 #FF7F00' }}>
    <Skeleton className="h-10 w-10 mb-3" />
    <Skeleton className="h-4 w-24 mb-2" />
    <Skeleton className="h-8 w-32" />
  </div>
);

const CardSkeleton: React.FC = () => (
  <div className="bg-white p-6 space-y-3" style={{ border: '3px solid #003366', boxShadow: '5px 5px 0 #FF7F00' }}>
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12" />
      <div className="space-y-2 flex-1"><Skeleton className="h-5 w-40" /><Skeleton className="h-3 w-28" /></div>
    </div>
    <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-20 w-full" />
  </div>
);

// ─── Confirm Modal ────────────────────────────────────────────────────────────
const ConfirmModal: React.FC<{ title: string; message: string; confirmLabel: string; confirmAccent: string; onClose: () => void; onConfirm: () => void }> = ({ title, message, confirmLabel, confirmAccent, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex justify-center items-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="bg-white w-full max-w-md" style={{ border: '4px solid #003366', boxShadow: '8px 8px 0 #FF7F00' }}>
      <div className="flex h-2"><div className="flex-1" style={{ background: '#FF7F00' }} /><div className="flex-1" style={{ background: '#003366' }} /><div className="flex-1" style={{ background: '#0B9C2C' }} /></div>
      <div className="p-6">
        <h2 className="text-xl font-black text-[#003366] uppercase tracking-tight mb-2">{title}</h2>
        <p className="text-sm font-medium text-[#003366]/70 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 font-black text-xs uppercase tracking-widest text-[#003366]" style={{ border: '3px solid #003366', background: '#fff', boxShadow: '3px 3px 0 #003366' }}>Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 font-black text-xs uppercase tracking-widest text-white" style={{ background: confirmAccent, border: '3px solid #003366', boxShadow: `3px 3px 0 #003366` }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  </div>
);

// ─── Rejection Modal ──────────────────────────────────────────────────────────
const RejectionModal: React.FC<{ applicationTitle: string; onClose: () => void; onSubmit: (reason: string) => void }> = ({ applicationTitle, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-md" style={{ border: '4px solid #003366', boxShadow: '8px 8px 0 #dc2626' }}>
        <div className="flex items-stretch" style={{ borderBottom: '3px solid #003366' }}>
          <div className="w-2.5 flex-shrink-0" style={{ background: '#dc2626' }} />
          <div className="flex-1 px-5 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#003366]/50 mb-0.5">Reject Application</p>
            <p className="font-black text-sm text-[#003366] uppercase tracking-tight">{applicationTitle}</p>
          </div>
          <button onClick={onClose} className="w-12 flex items-center justify-center font-black text-white" style={{ background: '#003366', borderLeft: '3px solid #003366' }}>✕</button>
        </div>
        <div className="p-5 space-y-4">
          <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Provide a reason for rejection..." rows={4}
            className="w-full px-4 py-3 text-sm font-medium text-[#003366] bg-white resize-none focus:outline-none"
            style={{ border: '3px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }} autoFocus />
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 font-black text-xs uppercase tracking-widest text-[#003366]" style={{ border: '3px solid #003366', background: '#fff', boxShadow: '3px 3px 0 #003366' }}>Cancel</button>
            <button onClick={() => reason.trim() && onSubmit(reason.trim())} disabled={!reason.trim()}
              className="flex-1 py-2.5 font-black text-xs uppercase tracking-widest text-white disabled:opacity-40"
              style={{ background: '#dc2626', border: '3px solid #003366', boxShadow: '3px 3px 0 #003366' }}>
              Reject →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard: React.FC<{ icon: string; title: string; value: string | number; accent: string; loading?: boolean }> = ({ icon, title, value, accent, loading = false }) => {
  if (loading) return <StatCardSkeleton />;
  return (
    <div className="bg-white flex flex-col gap-3 p-5 transition-all duration-150 hover:translate-x-[-3px] hover:translate-y-[-3px]"
      style={{ border: '3px solid #003366', boxShadow: `6px 6px 0 ${accent}` }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${accent}22`, border: `2px solid ${accent}` }}>{icon}</div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#003366]/50">{title}</p>
      </div>
      <p className="text-3xl font-black text-[#003366] leading-none">{value}</p>
    </div>
  );
};

// ─── Tier Progress ────────────────────────────────────────────────────────────
const TIERS = [
  { name: 'Bronze', min: 0, max: 5000, accent: '#b45309' },
  { name: 'Silver', min: 5000, max: 20000, accent: '#6b7280' },
  { name: 'Gold', min: 20000, max: 50000, accent: '#d97706' },
  { name: 'Platinum', min: 50000, max: Infinity, accent: '#2563eb' },
];

const TierProgress: React.FC<{ totalDonated: number }> = ({ totalDonated }) => {
  const idx = TIERS.findIndex((t, i) => totalDonated >= t.min && (i === TIERS.length - 1 || totalDonated < TIERS[i + 1].min));
  const current = TIERS[idx];
  const next = TIERS[idx + 1];
  const progress = next ? Math.min(((totalDonated - current.min) / (next.min - current.min)) * 100, 100) : 100;
  return (
    <div className="p-4 min-w-[240px]" style={{ background: '#fff', border: '3px solid #003366', boxShadow: `5px 5px 0 ${current.accent}` }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#003366]/50">Donor Tier</p>
        <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white"
          style={{ background: current.accent, border: '2px solid #003366' }}>⭐ {current.name}</span>
      </div>
      <div className="w-full h-3 mb-2 overflow-hidden" style={{ background: '#fff7ed', border: '2px solid #FF7F00' }}>
        <div className="h-full transition-all duration-700" style={{ width: `${progress}%`, background: current.accent }} />
      </div>
      <p className="text-[10px] font-bold text-[#003366]/50 uppercase tracking-wide">
        {next ? `${formatCurrency(next.min - totalDonated)} to ${next.name}` : '🎉 Highest Tier!'}
      </p>
    </div>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const cfg = {
    PENDING:  { bg: '#fffbeb', color: '#92400e', border: '#FF7F00' },
    ACCEPTED: { bg: '#f0fdf4', color: '#166534', border: '#0B9C2C' },
    REJECTED: { bg: '#fef2f2', color: '#991b1b', border: '#dc2626' },
  }[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest"
      style={{ background: cfg.bg, color: cfg.color, border: `2px solid ${cfg.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.border }} />
      {status === 'PENDING' && '⏳ '}{status === 'ACCEPTED' && '✓ '}{status === 'REJECTED' && '✕ '}{status}
    </span>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination: React.FC<{ total: number; page: number; pageSize: number; onChange: (p: number) => void }> = ({ total, page, pageSize, onChange }) => {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={() => onChange(page - 1)} disabled={page === 1}
        className="px-3 py-2 font-black text-xs uppercase tracking-widest disabled:opacity-30 transition-all"
        style={{ border: '2px solid #003366', color: '#003366', background: '#fff' }}>←</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onChange(p)}
          className="w-9 h-9 font-black text-xs transition-all"
          style={p === page
            ? { background: '#FF7F00', color: '#003366', border: '3px solid #003366', boxShadow: '2px 2px 0 #003366' }
            : { background: '#fff', color: '#003366', border: '2px solid #003366' }}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === pages}
        className="px-3 py-2 font-black text-xs uppercase tracking-widest disabled:opacity-30 transition-all"
        style={{ border: '2px solid #003366', color: '#003366', background: '#fff' }}>→</button>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState: React.FC<{ icon: string; title: string; description: string; action?: React.ReactNode }> = ({ icon, title, description, action }) => (
  <div className="p-12 text-center bg-white" style={{ border: '4px solid #003366', boxShadow: '8px 8px 0 #FF7F00' }}>
    <div className="flex h-2 mb-8 max-w-xs mx-auto">
      <div className="flex-1" style={{ background: '#FF7F00' }} /><div className="flex-1" style={{ background: '#003366' }} /><div className="flex-1" style={{ background: '#0B9C2C' }} />
    </div>
    <div className="w-16 h-16 flex items-center justify-center mx-auto mb-5 text-3xl"
      style={{ background: '#fff7ed', border: '3px solid #FF7F00', boxShadow: '4px 4px 0 #003366' }}>{icon}</div>
    <h3 className="font-black text-xl text-[#003366] uppercase tracking-tight mb-2">{title}</h3>
    <p className="text-sm font-medium text-[#003366]/60 mb-6 max-w-xs mx-auto">{description}</p>
    {action}
  </div>
);

// ─── Error Banner ─────────────────────────────────────────────────────────────
const ErrorBanner: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex items-center justify-between p-4" style={{ background: '#fef2f2', border: '3px solid #dc2626', boxShadow: '4px 4px 0 #003366' }}>
    <div className="flex items-center gap-3">
      <Ico name="alert" className="w-5 h-5 text-red-600 flex-shrink-0" />
      <p className="text-sm font-black text-red-700 uppercase tracking-wide">{message}</p>
    </div>
    {onRetry && (
      <button onClick={onRetry} className="px-4 py-2 text-xs font-black uppercase tracking-widest text-white ml-4"
        style={{ background: '#dc2626', border: '2px solid #003366', boxShadow: '2px 2px 0 #003366' }}>Retry</button>
    )}
  </div>
);

// ─── Nav Item ─────────────────────────────────────────────────────────────────
const SideNavItem: React.FC<{ icon: IconName; label: string; active: boolean; badge?: number; onClick: () => void }> = ({ icon, label, active, badge, onClick }) => (
  <button onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-widest transition-all duration-150"
    style={active
      ? { background: '#FF7F00', color: '#003366', border: '3px solid #003366', boxShadow: '4px 4px 0 #003366', transform: 'translate(-2px,-2px)' }
      : { background: 'transparent', color: '#fed7aa', border: '3px solid transparent' }}
    onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,127,0,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = '#FF7F00'; } }}
    onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#fed7aa'; } }}
  >
    <Ico name={icon} className="w-5 h-5 flex-shrink-0" />
    <span className="flex-1 text-left">{label}</span>
    {badge != null && badge > 0 && (
      <span className="px-2 py-0.5 text-[10px] font-black" style={{ background: '#003366', color: '#FF7F00', border: '2px solid #FF7F00' }}>{badge}</span>
    )}
  </button>
);

type Tab = 'overview' | 'projects' | 'applications' | 'donations' | 'wishlist';

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD INNER
// ═══════════════════════════════════════════════════════════════════════════════
const DonorDashboardInner: React.FC<DonorDashboardProps> = ({ donorName, projectsCount, onCreateProject, onViewProjects, getDonorApplications, updateApplicationStatus }) => {
  const toast = useToast();

  const [selectedTab, setSelectedTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [myDonations, setMyDonations] = useState<Donation[]>([]);
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [donationsError, setDonationsError] = useState<string | null>(null);
  const [filterAmount, setFilterAmount] = useState(0);
  const [donationsPage, setDonationsPage] = useState(1);
  const DONATIONS_PAGE_SIZE = 5;
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [applicationsError, setApplicationsError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [applicationsPage, setApplicationsPage] = useState(1);
  const APPS_PAGE_SIZE = 5;
  const [rejectionInfo, setRejectionInfo] = useState<RejectionInfo | null>(null);
  const [confirmInfo, setConfirmInfo] = useState<ConfirmInfo | null>(null);
  const [wishlist, setWishlist] = useState<Campaign[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [wishlistError, setWishlistError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [eligibility, setEligibility] = useState<Eligibility | null>(null);

  const totalDonated = myDonations.reduce((s, d) => s + d.amount, 0);
  const avgDonation = myDonations.length ? Math.round(totalDonated / myDonations.length) : 0;
  const maxDonation = myDonations.length ? Math.max(...myDonations.map(d => d.amount)) : 0;
  const projectsSupported = new Set(myDonations.map(d => d.userProjectId)).size;
  const now = new Date();
  const monthlyTotal = myDonations.filter(d => { const dt = new Date(d.createdAt); return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear(); }).reduce((s, d) => s + d.amount, 0);
  const impactScore = totalDonated + projectsSupported * 500 + myDonations.length * 50;
  const pendingApplicationsCount = applications.filter(a => a.status === 'PENDING').length;
  const filteredDonations = myDonations.filter(d => d.amount >= filterAmount);
  const paginatedDonations = filteredDonations.slice((donationsPage - 1) * DONATIONS_PAGE_SIZE, donationsPage * DONATIONS_PAGE_SIZE);
  const filteredApps = applications.filter(a => statusFilter === 'ALL' || a.status === statusFilter);
  const paginatedApps = filteredApps.slice((applicationsPage - 1) * APPS_PAGE_SIZE, applicationsPage * APPS_PAGE_SIZE);

  const loadMyDonations = useCallback(async () => {
    setLoadingDonations(true); setDonationsError(null);
    try {
      const res = await axios.get<{ success: boolean; donations: Donation[] }>(`${API_BASE}/donations/my`);
      if (res.data.success) setMyDonations(res.data.donations); else throw new Error('Unexpected response');
    } catch (err) {
      const msg = (err as any).response?.data?.message || 'Failed to load donations';
      setDonationsError(msg); toast.error(msg);
    } finally { setLoadingDonations(false); }
  }, []);

  const loadApplications = useCallback(async () => {
    setLoadingApplications(true); setApplicationsError(null);
    try {
      const response = await getDonorApplications();
      setApplications(response.success === true && response.data ? response.data.applications : []);
    } catch {
      const msg = 'Failed to load applications'; setApplicationsError(msg); toast.error(msg); setApplications([]);
    } finally { setLoadingApplications(false); }
  }, [getDonorApplications]);

  const loadWishlist = useCallback(async () => {
    setLoadingWishlist(true); setWishlistError(null);
    try {
      const res = await axios.get<{ status: string; data: { campaigns: Campaign[] } }>(`${API_BASE}/wishlist`);
      if (res.data.status === 'success') setWishlist(res.data.data.campaigns);
    } catch { const msg = 'Failed to load wishlist'; setWishlistError(msg); toast.error(msg); }
    finally { setLoadingWishlist(false); }
  }, []);

  const removeFromWishlist = async (campaignId: string) => {
    setRemovingId(campaignId);
    try { await axios.delete(`${API_BASE}/wishlist/${campaignId}`); setWishlist(prev => prev.filter(c => c.id !== campaignId)); toast.success('Removed from wishlist'); }
    catch { toast.error('Failed to remove from wishlist'); }
    finally { setRemovingId(null); }
  };

  const handleApplicationAction = async (id: string, status: ApplicationStatus, rejectionReason: string | null) => {
    try {
      const response = await updateApplicationStatus(id, { status, rejectionReason });
      if (response.success === true) { toast.success(`Application ${status === 'ACCEPTED' ? 'accepted' : 'rejected'} successfully`); await loadApplications(); }
    } catch { toast.error('Failed to update application. Please try again.'); }
  };

  useEffect(() => { loadMyDonations(); }, []);
  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        const res = await axios.get<{ status: string; data: Eligibility }>(`${API_BASE}/donations/me/eligibility`);
        if (res.data.status === 'success') setEligibility(res.data.data);
      } catch {}
    };
    fetchEligibility();
  }, []);
  useEffect(() => { if (selectedTab === 'applications') loadApplications(); if (selectedTab === 'wishlist') loadWishlist(); }, [selectedTab]);
  useEffect(() => { setDonationsPage(1); }, [filterAmount]);
  useEffect(() => { setApplicationsPage(1); }, [statusFilter]);

  const switchTab = (tab: Tab) => { setSelectedTab(tab); setSidebarOpen(false); };

  const tabTitle: Record<Tab, string> = {
    overview: 'Dashboard Overview', projects: 'My Projects',
    applications: 'Student Applications', donations: 'Donation History', wishlist: 'My Wishlist',
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#fffbf5' }}>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,0.65)' }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: '#003366', borderRight: '4px solid #FF7F00' }}
      >
        {/* Brand */}
        <div className="px-6 py-5 flex items-center gap-3" style={{ borderBottom: '3px solid #FF7F00' }}>
          <div className="w-10 h-10 flex items-center justify-center font-black text-xl"
            style={{ background: '#FF7F00', color: '#003366', border: '3px solid #fff', boxShadow: '3px 3px 0 #0B9C2C' }}>D</div>
          <div>
            <p className="font-black text-base text-white uppercase tracking-widest leading-none">DreamXec</p>
            <p className="text-[10px] font-bold text-orange-300 uppercase tracking-[0.2em]">Donor Portal</p>
          </div>
        </div>

        {/* User */}
        <div className="px-5 py-5" style={{ borderBottom: '3px solid rgba(255,127,0,0.35)' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center font-black text-xl flex-shrink-0"
              style={{ background: '#FF7F00', color: '#003366', border: '3px solid #fff', boxShadow: '3px 3px 0 #0B9C2C' }}>
              {donorName?.charAt(0) || 'D'}
            </div>
            <div>
              <p className="font-black text-sm text-white uppercase tracking-wide truncate">{donorName || 'Donor'}</p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest mt-1"
                style={{ background: '#FF7F00', color: '#003366', border: '2px solid #003366' }}>
                💝 Donor
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <SideNavItem icon="dashboard" label="Overview" active={selectedTab === 'overview'} onClick={() => switchTab('overview')} />
          <SideNavItem icon="folder" label="My Projects" active={selectedTab === 'projects'} badge={projectsCount} onClick={() => { switchTab('projects'); onViewProjects?.(); }} />
          <SideNavItem icon="file" label="Applications" active={selectedTab === 'applications'} badge={pendingApplicationsCount} onClick={() => switchTab('applications')} />
          <SideNavItem icon="heart" label="Donations" active={selectedTab === 'donations'} onClick={() => switchTab('donations')} />
          <SideNavItem icon="star" label="Wishlist" active={selectedTab === 'wishlist'} onClick={() => switchTab('wishlist')} />
        </nav>

        {/* Create Project CTA */}
        <div className="p-4" style={{ borderTop: '3px solid #FF7F00' }}>
          {eligibility && !eligibility.canCreateOpportunity && (
            <p className="text-[10px] font-black text-orange-300 uppercase tracking-widest text-center mb-2">
              Donate {formatCurrency(eligibility.perProjectCost)} more to unlock
            </p>
          )}
          <button
            onClick={() => { onCreateProject?.(); setSidebarOpen(false); }}
            disabled={!eligibility?.canCreateOpportunity}
            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest transition-all"
            style={eligibility?.canCreateOpportunity
              ? { background: '#FF7F00', color: '#003366', border: '3px solid #fff', boxShadow: '4px 4px 0 #0B9C2C' }
              : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', border: '2px solid rgba(255,255,255,0.15)', cursor: 'not-allowed' }}>
            <Ico name="plus" className="w-4 h-4" /> Create Project
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════
          MAIN
      ══════════════════════════════════ */}
      <main className="flex-1 overflow-auto min-w-0 flex flex-col">

        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-4 bg-white"
          style={{ borderBottom: '4px solid #003366', boxShadow: '0 4px 0 #FF7F00' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 transition-all"
              style={{ border: '2px solid #003366', color: '#003366' }} aria-label="Open sidebar">
              <Ico name="menu" className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-black text-[#003366] uppercase tracking-tight leading-none">{tabTitle[selectedTab]}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-3 h-1" style={{ background: '#FF7F00' }} />
                <div className="w-3 h-1" style={{ background: '#0B9C2C' }} />
                <div className="w-3 h-1" style={{ background: '#003366' }} />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-5 sm:p-6 lg:p-8 space-y-6">

          {/* ══════ OVERVIEW ══════ */}
          {selectedTab === 'overview' && (
            <>
              {/* Welcome + Tier */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 bg-white"
                style={{ border: '3px solid #003366', boxShadow: '6px 6px 0 #FF7F00' }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-6" style={{ background: '#FF7F00' }} />
                    <h1 className="text-2xl font-black text-[#003366] uppercase tracking-tight">Welcome back, {donorName}! 👋</h1>
                  </div>
                  <p className="text-xs font-bold text-[#003366]/50 uppercase tracking-widest ml-4">Research Karega India, Toh aage Badhega India</p>
                </div>
                <TierProgress totalDonated={totalDonated} />
              </div>

              {/* Eligibility / Project Slots */}
              {eligibility && (
                <div className="p-5 bg-white" style={{ border: '3px solid #003366', boxShadow: '6px 6px 0 #0B9C2C' }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#003366]/50">Project Slots</p>
                    <span className="text-xs font-black text-[#003366] uppercase tracking-widest">
                      {eligibility.createdProjects} / {eligibility.allowedProjects} used &nbsp;·&nbsp; {eligibility.remainingProjects} remaining
                    </span>
                  </div>
                  <div className="w-full h-3 overflow-hidden" style={{ background: '#fff7ed', border: '2px solid #FF7F00' }}>
                    <div className="h-full transition-all duration-700"
                      style={{ width: eligibility.allowedProjects === 0 ? '0%' : `${(eligibility.createdProjects / eligibility.allowedProjects) * 100}%`, background: '#0B9C2C' }} />
                  </div>
                  {!eligibility.canCreateOpportunity && (
                    <p className="mt-2 text-xs font-black text-red-600 uppercase tracking-wide">
                      Donate {formatCurrency(eligibility.perProjectCost)} more to unlock project creation
                    </p>
                  )}
                </div>
              )}

              {/* KPI grid */}
              {loadingDonations ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}</div>
              ) : donationsError ? (
                <ErrorBanner message={donationsError} onRetry={loadMyDonations} />
              ) : myDonations.length === 0 ? (
                <div className="p-6 text-center bg-white" style={{ border: '3px dashed #003366' }}>
                  <p className="text-sm font-bold text-[#003366]/60">Make your first donation to see your stats here 💝</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <KpiCard icon="💝" title="Total Donated" value={formatCurrency(totalDonated)} accent="#0B9C2C" />
                  <KpiCard icon="📊" title="Avg Donation" value={formatCurrency(avgDonation)} accent="#FF7F00" />
                  <KpiCard icon="🏆" title="Biggest Gift" value={formatCurrency(maxDonation)} accent="#003366" />
                  <KpiCard icon="🎯" title="Campaigns" value={projectsSupported} accent="#dc2626" />
                </div>
              )}

              {/* Charts */}
              <div className="grid md:grid-cols-1 gap-4">
                <DonorAnalyticsChart monthlyTotal={monthlyTotal} impactScore={impactScore} />
                <DonationHeatmap donations={myDonations} />
              </div>

              {/* Impact Banner */}
              {!loadingDonations && myDonations.length > 0 && (
                <div className="p-6" style={{ background: '#003366', border: '3px solid #FF7F00', boxShadow: '6px 6px 0 #FF7F00' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-6" style={{ background: '#FF7F00' }} />
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Your Impact 🚀</h3>
                  </div>
                  <p className="text-[10px] font-bold text-orange-300 uppercase tracking-widest mb-5 ml-4">
                    Impact Score = Total donated + (campaigns × 500) + (donations × 50)
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { label: 'This Month', value: formatCurrency(monthlyTotal) },
                      { label: 'Impact Score', value: impactScore.toLocaleString() },
                      { label: 'Research Enabled', value: `${projectsSupported} Projects` },
                    ].map(({ label, value }) => (
                      <div key={label} className="p-4" style={{ background: 'rgba(255,127,0,0.15)', border: '2px solid #FF7F00' }}>
                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-300 mb-1">{label}</p>
                        <p className="text-2xl font-black text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={onCreateProject}
                  className="flex flex-col gap-4 p-6 text-left bg-white transition-all duration-150"
                  style={{ border: '3px solid #003366', boxShadow: '6px 6px 0 #0B9C2C' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translate(-3px,-3px)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translate(0,0)')}>
                  <div className="w-12 h-12 flex items-center justify-center" style={{ background: '#0B9C2C', border: '3px solid #003366' }}>
                    <Ico name="plus" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-base text-[#003366] uppercase tracking-tight">Create New Project</p>
                    <p className="text-xs font-medium text-[#003366]/60 mt-1">Post a new opportunity for students</p>
                  </div>
                </button>
                <button onClick={onViewProjects}
                  className="flex flex-col gap-4 p-6 text-left bg-white transition-all duration-150"
                  style={{ border: '3px solid #003366', boxShadow: '6px 6px 0 #FF7F00' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translate(-3px,-3px)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translate(0,0)')}>
                  <div className="w-12 h-12 flex items-center justify-center" style={{ background: '#FF7F00', border: '3px solid #003366' }}>
                    <Ico name="folder" className="w-6 h-6 text-[#003366]" />
                  </div>
                  <div>
                    <p className="font-black text-base text-[#003366] uppercase tracking-tight">View My Projects</p>
                    <p className="text-xs font-medium text-[#003366]/60 mt-1">Manage existing projects and applications</p>
                  </div>
                </button>
              </div>
            </>
          )}

          {/* ══════ APPLICATIONS ══════ */}
          {selectedTab === 'applications' && (
            <div className="space-y-4">
              {/* Status filters */}
              <div className="flex flex-wrap gap-2">
                {(['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'] as const).map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                    style={statusFilter === s
                      ? { background: '#003366', color: '#FF7F00', border: '3px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }
                      : { background: '#fff', color: '#003366', border: '3px solid #003366' }}>
                    {s}
                    {s !== 'ALL' && <span className="ml-1.5 opacity-60">({applications.filter(a => a.status === s).length})</span>}
                  </button>
                ))}
              </div>

              {applicationsError && <ErrorBanner message={applicationsError} onRetry={loadApplications} />}

              {loadingApplications ? (
                <div className="space-y-4">{[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}</div>
              ) : filteredApps.length === 0 ? (
                <EmptyState icon="📄" title="No Applications"
                  description={statusFilter === 'ALL' ? "Students haven't applied yet." : `No ${statusFilter.toLowerCase()} applications.`} />
              ) : (
                <>
                  {paginatedApps.map(app => (
                    <div key={app.id} className="bg-white p-6 transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                      style={{ border: '3px solid #003366', boxShadow: '6px 6px 0 #FF7F00' }}>
                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 flex items-center justify-center font-black text-xl flex-shrink-0"
                            style={{ background: '#FF7F00', color: '#003366', border: '3px solid #003366' }}>
                            {app.user?.name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <h3 className="font-black text-base text-[#003366] uppercase tracking-tight">{app.user?.name || 'Student'}</h3>
                            <p className="text-xs font-bold text-[#003366]/50">{app.user?.email}</p>
                          </div>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>

                      {/* Project info */}
                      <div className="mb-4 px-4 py-3" style={{ background: '#fffbf5', border: '2px dashed #003366' }}>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#003366]/40 mb-1">Applied For</p>
                        <p className="font-black text-sm text-[#003366] uppercase tracking-tight">{app.donorProject?.title || 'Project'}</p>
                        {app.donorProject?.organization && <p className="text-xs font-bold text-[#003366]/50 mt-0.5">{app.donorProject.organization}</p>}
                      </div>

                      {/* Cover letter */}
                      <div className="mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#003366]/50 mb-2">Cover Letter</p>
                        <p className="text-sm font-medium text-[#003366] leading-relaxed px-4 py-3 line-clamp-4"
                          style={{ background: '#fffbf5', border: '2px solid #003366' }}>
                          {app.coverLetter}
                        </p>
                      </div>

                      {/* Skills */}
                      {app.skills && app.skills.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1.5">
                          {app.skills.map((skill, idx) => (
                            <span key={idx} className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wide"
                              style={{ background: '#f0fdf4', color: '#166534', border: '2px solid #0B9C2C' }}>{skill}</span>
                          ))}
                        </div>
                      )}

                      <p className="text-[10px] font-bold text-[#003366]/40 uppercase tracking-widest mb-4">Applied: {formatDate(app.createdAt)}</p>

                      {/* Rejection reason */}
                      {app.status === 'REJECTED' && app.rejectionReason && (
                        <div className="mb-4 p-3" style={{ background: '#fef2f2', border: '2px solid #dc2626' }}>
                          <p className="text-[10px] font-black uppercase tracking-widest text-red-700 mb-1">Rejection Reason</p>
                          <p className="text-sm font-medium text-red-700 italic">{app.rejectionReason}</p>
                        </div>
                      )}

                      {/* Actions */}
                      {app.status === 'PENDING' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => setConfirmInfo({ id: app.id, title: `${app.user?.name || 'Student'} — ${app.donorProject?.title || 'Project'}` })}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]"
                            style={{ background: '#0B9C2C', border: '3px solid #003366', boxShadow: '3px 3px 0 #003366' }}>
                            <Ico name="check-circle" className="w-4 h-4" /> Accept
                          </button>
                          <button
                            onClick={() => setRejectionInfo({ id: app.id, title: `${app.user?.name || 'Student'} — ${app.donorProject?.title || 'Project'}` })}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]"
                            style={{ background: '#dc2626', border: '3px solid #003366', boxShadow: '3px 3px 0 #003366' }}>
                            <Ico name="x-circle" className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <Pagination total={filteredApps.length} page={applicationsPage} pageSize={APPS_PAGE_SIZE} onChange={setApplicationsPage} />
                </>
              )}
            </div>
          )}

          {/* ══════ PROJECTS ══════ */}
          {selectedTab === 'projects' && (
            <EmptyState icon="📁" title="Projects View" description="Your projects will appear here"
              action={
                <button onClick={onViewProjects} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  style={{ background: '#FF7F00', color: '#003366', border: '3px solid #003366', boxShadow: '4px 4px 0 #003366' }}>
                  Browse Projects
                </button>
              }
            />
          )}

          {/* ══════ DONATIONS ══════ */}
          {selectedTab === 'donations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard icon="💝" title="Total Donated" value={formatCurrency(totalDonated)} accent="#0B9C2C" loading={loadingDonations} />
                <KpiCard icon="📊" title="Avg Donation" value={formatCurrency(avgDonation)} accent="#FF7F00" loading={loadingDonations} />
                <KpiCard icon="🏆" title="Biggest Gift" value={formatCurrency(maxDonation)} accent="#003366" loading={loadingDonations} />
                <KpiCard icon="🎯" title="Projects" value={projectsSupported} accent="#dc2626" loading={loadingDonations} />
              </div>

              {/* Filters & actions */}
              <div className="flex flex-wrap gap-3 items-center p-4 bg-white" style={{ border: '3px solid #003366', boxShadow: '4px 4px 0 #FF7F00' }}>
                <input type="number" placeholder="Min Amount Filter"
                  className="px-3 py-2 text-sm font-bold text-[#003366] focus:outline-none w-44 uppercase tracking-wide"
                  style={{ border: '2px solid #003366', background: '#fffbf5' }}
                  onChange={e => setFilterAmount(Number(e.target.value))} />
                <button onClick={() => exportCSV(myDonations)} disabled={myDonations.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-white disabled:opacity-40"
                  style={{ background: '#0B9C2C', border: '2px solid #003366', boxShadow: '2px 2px 0 #003366' }}>
                  <Ico name="download" className="w-4 h-4" /> Export CSV
                </button>
                <button onClick={loadMyDonations}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-white"
                  style={{ background: '#003366', border: '2px solid #003366', boxShadow: '2px 2px 0 #FF7F00' }}>
                  <Ico name="refresh" className="w-4 h-4" /> Refresh
                </button>
                {filterAmount > 0 && (
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#003366]/50 ml-auto">
                    {filteredDonations.length} / {myDonations.length} shown
                  </p>
                )}
              </div>

              {donationsError && <ErrorBanner message={donationsError} onRetry={loadMyDonations} />}

              {loadingDonations ? (
                <div className="space-y-4">{[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}</div>
              ) : filteredDonations.length === 0 ? (
                <EmptyState icon="💝" title="No Donations Found"
                  description={filterAmount > 0 ? `No donations above ${formatCurrency(filterAmount)}.` : "You haven't made any donations yet."} />
              ) : (
                <>
                  {paginatedDonations.map(d => (
                    <div key={d.id} className="bg-white p-5 flex items-start justify-between gap-4 transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                      style={{ border: '3px solid #003366', boxShadow: '5px 5px 0 #0B9C2C' }}>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-base text-[#003366] uppercase tracking-tight truncate">{d.userProject?.title}</p>
                        <p className="text-[10px] font-bold text-[#003366]/50 uppercase tracking-widest mt-1">{formatDate(d.createdAt)}</p>
                        {d.message && <p className="italic text-sm font-medium text-[#003366]/70 mt-2 line-clamp-2">"{d.message}"</p>}
                      </div>
                      <div className="flex-shrink-0 px-3 py-2" style={{ background: '#f0fdf4', border: '2px solid #0B9C2C' }}>
                        <p className="font-black text-xl text-[#166534]">{formatCurrency(d.amount)}</p>
                      </div>
                    </div>
                  ))}
                  <Pagination total={filteredDonations.length} page={donationsPage} pageSize={DONATIONS_PAGE_SIZE} onChange={setDonationsPage} />
                </>
              )}
            </div>
          )}

          {/* ══════ WISHLIST ══════ */}
          {selectedTab === 'wishlist' && (
            <div className="space-y-6">
              {wishlistError && <ErrorBanner message={wishlistError} onRetry={loadWishlist} />}
              {loadingWishlist ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}</div>
              ) : wishlist.length === 0 ? (
                <EmptyState icon="⭐" title="Your Wishlist is Empty" description="Browse campaigns and click the heart icon to save them here." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((campaign, idx) => {
                    const shadowAccents = ['#FF7F00', '#0B9C2C', '#003366'];
                    const accent = shadowAccents[idx % 3];
                    const progress = Math.min(((campaign.amountRaised || 0) / campaign.goalAmount) * 100, 100);
                    return (
                      <div key={campaign.id} className="bg-white flex flex-col transition-all duration-150 hover:translate-x-[-3px] hover:translate-y-[-3px]"
                        style={{ border: '3px solid #003366', boxShadow: `6px 6px 0 ${accent}` }}>
                        {/* Image / no-image */}
                        <div className="relative w-full h-48 overflow-hidden flex-shrink-0" style={{ borderBottom: '3px solid #003366' }}>
                          {campaign.imageUrl ? (
                            <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center px-4" style={{ background: '#003366' }}>
                              <div className="absolute -top-3 -right-3 w-16 h-16 rotate-12 opacity-20" style={{ background: accent, border: '3px solid #fff' }} />
                              <p className="font-black text-white uppercase text-center leading-tight" style={{ fontSize: campaign.title.length > 25 ? '0.9rem' : '1.1rem', textShadow: `3px 3px 0 ${accent}`, letterSpacing: '-0.02em' }}>{campaign.title}</p>
                            </div>
                          )}
                          {/* Status badge */}
                          <div className="absolute top-2 right-2 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white"
                            style={{ background: '#FF7F00', border: '2px solid #003366' }}>{campaign.status}</div>
                          {/* Remove btn */}
                          <button onClick={() => removeFromWishlist(campaign.id)} disabled={removingId === campaign.id}
                            className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center disabled:opacity-50"
                            style={{ background: '#fff', border: '2px solid #003366', boxShadow: '2px 2px 0 #003366' }}
                            title="Remove from wishlist">
                            {removingId === campaign.id ? <span className="animate-spin text-xs">⏳</span> : <Ico name="trash" className="w-4 h-4 text-red-600" />}
                          </button>
                        </div>

                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-black text-sm text-[#003366] uppercase tracking-tight mb-1 truncate">{campaign.title}</h3>
                          <p className="text-xs font-medium text-[#003366]/60 mb-4 line-clamp-2">{campaign.description}</p>
                          {/* Progress */}
                          <div className="mb-4 mt-auto">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs font-black text-[#003366]">{formatCurrency(campaign.amountRaised)}</span>
                              <span className="text-[10px] font-bold text-[#003366]/50">of {formatCurrency(campaign.goalAmount)}</span>
                            </div>
                            <div className="w-full h-3 overflow-hidden" style={{ background: '#fff7ed', border: '2px solid #FF7F00' }}>
                              <div className="h-full transition-all duration-700" style={{ width: `${progress}%`, background: '#0B9C2C' }} />
                            </div>
                          </div>
                          <a href={`/campaign/${campaign.id}`}
                            className="block w-full text-center py-2.5 text-xs font-black uppercase tracking-widest text-[#003366] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]"
                            style={{ background: '#FF7F00', border: '3px solid #003366', boxShadow: '3px 3px 0 #003366' }}>
                            View Details →
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Modals */}
      {rejectionInfo && (
        <RejectionModal applicationTitle={rejectionInfo.title} onClose={() => setRejectionInfo(null)}
          onSubmit={reason => { const { id } = rejectionInfo; setRejectionInfo(null); handleApplicationAction(id, 'REJECTED', reason); }} />
      )}
      {confirmInfo && (
        <ConfirmModal title="Accept Application"
          message={`Are you sure you want to accept ${confirmInfo.title}? This action cannot be undone.`}
          confirmLabel="Accept" confirmAccent="#0B9C2C"
          onClose={() => setConfirmInfo(null)}
          onConfirm={() => { const { id } = confirmInfo; setConfirmInfo(null); handleApplicationAction(id, 'ACCEPTED', null); }} />
      )}
    </div>
  );
};

// ─── Export wrapped with ToastProvider ───────────────────────────────────────
const DonorDashboard: React.FC<DonorDashboardProps> = (props) => (
  <ToastProvider><DonorDashboardInner {...props} /></ToastProvider>
);

export default DonorDashboard;
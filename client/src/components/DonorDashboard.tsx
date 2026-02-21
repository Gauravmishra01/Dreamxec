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

// ─── Types & Interfaces ───────────────────────────────────────────────────────
interface UserProject {
  id: string;
  title: string;
  organization?: string;
}

interface Donation {
  id: string;
  amount: number;
  createdAt: string;
  message?: string;
  userProjectId: string;
  userProject: UserProject;
}

interface ApplicationUser {
  name?: string;
  email?: string;
}

interface DonorProject {
  title?: string;
  organization?: string;
}

type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

interface Application {
  id: string;
  status: ApplicationStatus;
  coverLetter: string;
  skills?: string[];
  createdAt: string;
  rejectionReason?: string;
  user?: ApplicationUser;
  donorProject?: DonorProject;
}

interface Campaign {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  status: string;
  goalAmount: number;
  amountRaised?: number;
}

interface Eligibility {
  canCreateOpportunity: boolean;
  createdProjects: number;
  allowedProjects: number;
  remainingProjects: number;
  perProjectCost: number;
}

interface DonorDashboardProps {
  donorName: string;
  projectsCount: number;
  onCreateProject?: () => void;
  onViewProjects?: () => void;
  getDonorApplications: () => Promise<{ success: boolean; data?: { applications: Application[] } }>;
  updateApplicationStatus: (
    id: string,
    payload: {
      status: ApplicationStatus;
      rejectionReason?: string | null;
    }
  ) => Promise<ApiResponse<{ application: Application }>>;
  getDonationSummary: () => Promise<any>; // ✅ ADD THIS
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastApi {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
}

interface ConfirmInfo {
  id: string;
  title: string;
}

interface RejectionInfo {
  id: string;
  title: string;
}

// ─── Utilities ────────────────────────────────────────────────────────────────
const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const formatCurrency = (amount: number | undefined): string =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const exportCSV = (donations: Donation[]): void => {
  const headers = '"Project Title","Amount (₹)","Date","Message"\n';
  const rows = donations
    .map(
      (d) =>
        `"${(d.userProject?.title || '').replace(/"/g, '""')}",${d.amount},"${formatDate(
          d.createdAt
        )}","${(d.message || '').replace(/"/g, '""')}"`
    )
    .join('\n');
  const blob = new Blob([headers + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Toast System ─────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastApi | null>(null);

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const toast: ToastApi = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl border-2 border-blue-900 shadow-lg font-bold text-sm pointer-events-auto max-w-sm
              ${t.type === 'success' ? 'bg-green-400 text-blue-900' : ''}
              ${t.type === 'error' ? 'bg-red-500 text-white' : ''}
              ${t.type === 'info' ? 'bg-orange-400 text-blue-900' : ''}
            `}
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
type IconName =
  | 'dashboard' | 'folder' | 'file' | 'plus' | 'menu' | 'x'
  | 'check' | 'star' | 'heart' | 'trash' | 'refresh' | 'download'
  | 'alert' | 'check-circle' | 'x-circle' | 'clock';

interface IcoProps {
  name: IconName;
  className?: string;
}

const Ico: React.FC<IcoProps> = ({ name, className = 'w-5 h-5' }) => {
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

  if (name === 'check-circle') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  }

  if (name === 'x-circle') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    );
  }

  if (name === 'clock') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d={paths[name] || ''} />
    </svg>
  );
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-blue-100 rounded-lg ${className}`} />
);

const StatCardSkeleton: React.FC = () => (
  <div className="bg-white border-2 border-blue-900/20 rounded-xl p-5 shadow">
    <div className="flex items-center gap-3 mb-3">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <Skeleton className="h-4 w-24" />
    </div>
    <Skeleton className="h-8 w-32" />
  </div>
);

const CardSkeleton: React.FC = () => (
  <div className="bg-white border-2 border-blue-900/20 rounded-xl p-6 shadow-lg space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-20 w-full rounded-lg" />
  </div>
);

// ─── Confirm Modal ────────────────────────────────────────────────────────────
interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  confirmClass: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title, message, confirmLabel, confirmClass, onClose, onConfirm,
}) => (
  <div
    className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/50"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="bg-orange-50 rounded-xl border-2 border-blue-900 shadow-xl max-w-md w-full p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-2">{title}</h2>
      <p className="text-blue-900/70 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2 bg-gray-200 text-blue-900 rounded-lg font-bold border-2 border-blue-900 hover:scale-105 transition-transform"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`px-5 py-2 text-white rounded-lg font-bold border-2 border-blue-900 hover:scale-105 transition-transform ${confirmClass}`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

// ─── Rejection Modal ──────────────────────────────────────────────────────────
interface RejectionModalProps {
  applicationTitle: string;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const RejectionModal: React.FC<RejectionModalProps> = ({ applicationTitle, onClose, onSubmit }) => {
  const [reason, setReason] = useState<string>('');

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-orange-50 rounded-xl border-2 border-blue-900 shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-900 hover:scale-110 transition-transform"
        >
          <Ico name="x-circle" className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Reject Application</h2>
        <div className="mb-4 p-3 bg-orange-100 rounded-lg border-2 border-orange-400">
          <p className="text-blue-900">
            Rejecting: <span className="font-bold">{applicationTitle}</span>
          </p>
        </div>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please provide a reason for rejection..."
          className="w-full h-32 p-3 border-2 border-blue-900 rounded-lg text-blue-900 bg-white focus:outline-none focus:border-orange-500 resize-none"
          autoFocus
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-blue-900 rounded-lg font-bold border-2 border-blue-900 hover:scale-105 transition-transform"
          >
            Cancel
          </button>
          <button
            onClick={() => reason.trim() && onSubmit(reason.trim())}
            disabled={!reason.trim()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold border-2 border-blue-900 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface EliteStatProps {
  icon: string;
  title: string;
  value: string | number;
  loading?: boolean;
}

const EliteStat: React.FC<EliteStatProps> = ({ icon, title, value, loading = false }) => {
  if (loading) return <StatCardSkeleton />;
  return (
    <div className="bg-white rounded-xl border-2 border-blue-900 p-5 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center text-xl">
          {icon}
        </div>
        <p className="font-bold text-blue-900/70 text-sm">{title}</p>
      </div>
      <p className="text-2xl font-bold text-blue-900">{value}</p>
    </div>
  );
};

// ─── Tier Progress ────────────────────────────────────────────────────────────
interface Tier {
  name: string;
  min: number;
  max: number;
  color: string;
}

const TIERS: Tier[] = [
  { name: 'Bronze', min: 0, max: 5000, color: 'bg-amber-600' },
  { name: 'Silver', min: 5000, max: 20000, color: 'bg-gray-400' },
  { name: 'Gold', min: 20000, max: 50000, color: 'bg-yellow-400' },
  { name: 'Platinum', min: 50000, max: Infinity, color: 'bg-blue-300' },
];

interface TierProgressProps {
  totalDonated: number;
}

const TierProgress: React.FC<TierProgressProps> = ({ totalDonated }) => {
  const currentTierIdx = TIERS.findIndex(
    (t, i) => totalDonated >= t.min && (i === TIERS.length - 1 || totalDonated < TIERS[i + 1].min)
  );
  const current = TIERS[currentTierIdx];
  const next: Tier | undefined = TIERS[currentTierIdx + 1];
  const progress = next
    ? Math.min(((totalDonated - current.min) / (next.min - current.min)) * 100, 100)
    : 100;

  return (
    <div className="bg-white border-2 border-blue-900 rounded-xl p-5 shadow-lg min-w-[260px]">
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-blue-900">Donor Tier</p>
        <span className={`px-3 py-1 rounded-full text-sm font-bold text-blue-900 ${current.color}`}>
          ⭐ {current.name}
        </span>
      </div>
      <div className="w-full h-3 bg-orange-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-700 ${current.color}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {next ? (
        <p className="text-sm text-blue-900/60 font-medium">
          {formatCurrency(totalDonated)} / {formatCurrency(next.min)} to reach{' '}
          <strong>{next.name}</strong> — {formatCurrency(next.min - totalDonated)} to go
        </p>
      ) : (
        <p className="text-sm text-blue-900/60 font-medium">🎉 You've reached the highest tier!</p>
      )}
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ total, page, pageSize, onChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 rounded-lg border-2 border-blue-900 font-bold text-blue-900 disabled:opacity-40 hover:bg-orange-100 transition"
      >
        ←
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-9 h-9 rounded-lg border-2 border-blue-900 font-bold transition
            ${p === page ? 'bg-orange-400 text-blue-900' : 'text-blue-900 hover:bg-orange-100'}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-2 rounded-lg border-2 border-blue-900 font-bold text-blue-900 disabled:opacity-40 hover:bg-orange-100 transition"
      >
        →
      </button>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="bg-white rounded-xl border-2 border-blue-900 p-12 text-center shadow-lg">
    <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-blue-900 mb-2">{title}</h3>
    <p className="text-blue-900/70 mb-6">{description}</p>
    {action}
  </div>
);

// ─── Error Banner ─────────────────────────────────────────────────────────────
interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry }) => (
  <div className="bg-red-50 border-2 border-red-400 rounded-xl p-5 flex items-center justify-between shadow">
    <div className="flex items-center gap-3">
      <Ico name="alert" className="w-6 h-6 text-red-600 shrink-0" />
      <p className="text-red-700 font-bold">{message}</p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold border-2 border-red-800 hover:scale-105 transition-transform ml-4 shrink-0"
      >
        Retry
      </button>
    )}
  </div>
);

// ─── Nav Item ─────────────────────────────────────────────────────────────────
interface NavItemProps {
  icon: IconName;
  label: string;
  active: boolean;
  badge?: number;
  badgeColor?: string;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  icon, label, active, badge, badgeColor = 'bg-red-500 text-white', onClick,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all
      ${active ? 'bg-orange-400 text-blue-900' : 'text-white hover:bg-blue-800'}`}
  >
    <Ico name={icon} className="w-5 h-5" />
    {label}
    {badge != null && badge > 0 && (
      <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${badgeColor}`}>
        {badge}
      </span>
    )}
  </button>
);

// ─── Tab type ─────────────────────────────────────────────────────────────────
type Tab = 'overview' | 'projects' | 'applications' | 'donations' | 'wishlist';

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD INNER
// ═══════════════════════════════════════════════════════════════════════════════
const DonorDashboardInner: React.FC<DonorDashboardProps> = ({
  donorName,
  projectsCount,
  onCreateProject,
  onViewProjects,
  getDonorApplications,
  updateApplicationStatus,
}) => {
  const toast = useToast();

  // ── State ──────────────────────────────────────────────────────────────────
  const [selectedTab, setSelectedTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Donations
  const [myDonations, setMyDonations] = useState<Donation[]>([]);
  const [loadingDonations, setLoadingDonations] = useState<boolean>(true);
  const [donationsError, setDonationsError] = useState<string | null>(null);
  const [filterAmount, setFilterAmount] = useState<number>(0);
  const [donationsPage, setDonationsPage] = useState<number>(1);
  const DONATIONS_PAGE_SIZE = 5;

  // Applications
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState<boolean>(false);
  const [applicationsError, setApplicationsError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [applicationsPage, setApplicationsPage] = useState<number>(1);
  const APPS_PAGE_SIZE = 5;
  const [rejectionInfo, setRejectionInfo] = useState<RejectionInfo | null>(null);
  const [confirmInfo, setConfirmInfo] = useState<ConfirmInfo | null>(null);

  // Wishlist
  const [wishlist, setWishlist] = useState<Campaign[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState<boolean>(false);
  const [wishlistError, setWishlistError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Eligibility
  const [eligibility, setEligibility] = useState<Eligibility | null>(null);

  // ── Analytics ───────────────────────────────────────────────────────────────
  const totalDonated = myDonations.reduce((s, d) => s + d.amount, 0);
  const avgDonation = myDonations.length ? Math.round(totalDonated / myDonations.length) : 0;
  const maxDonation = myDonations.length ? Math.max(...myDonations.map((d) => d.amount)) : 0;
  const projectsSupported = new Set(myDonations.map((d) => d.userProjectId)).size;

  const now = new Date();
  const monthlyTotal = myDonations
    .filter((d) => {
      const dt = new Date(d.createdAt);
      return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
    })
    .reduce((s, d) => s + d.amount, 0);

  const impactScore = totalDonated + projectsSupported * 500 + myDonations.length * 50;

  const pendingApplicationsCount = applications.filter((a) => a.status === 'PENDING').length;

  const filteredDonations = myDonations.filter((d) => d.amount >= filterAmount);
  const paginatedDonations = filteredDonations.slice(
    (donationsPage - 1) * DONATIONS_PAGE_SIZE,
    donationsPage * DONATIONS_PAGE_SIZE
  );

  const filteredApps = applications.filter(
    (a) => statusFilter === 'ALL' || a.status === statusFilter
  );
  const paginatedApps = filteredApps.slice(
    (applicationsPage - 1) * APPS_PAGE_SIZE,
    applicationsPage * APPS_PAGE_SIZE
  );

  // ── Fetchers ────────────────────────────────────────────────────────────────
  const loadMyDonations = useCallback(async (): Promise<void> => {
    setLoadingDonations(true);
    setDonationsError(null);
    try {
      const res = await axios.get<{ success: boolean; donations: Donation[] }>(
        `${API_BASE}/donations/my`
      );
      if (res.data.success) {
        setMyDonations(res.data.donations);
      } else {
        throw new Error('Unexpected response');
      }
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Failed to load donations';
      setDonationsError(msg);
      toast.error(msg);
    } finally {
      setLoadingDonations(false);
    }
  }, []);

  const loadApplications = useCallback(async (): Promise<void> => {
    setLoadingApplications(true);
    setApplicationsError(null);
    try {
      const response = await getDonorApplications();
      if (response.success === true && response.data) {
        setApplications(response.data.applications);
      } else {
        setApplications([]);
      }
    } catch {
      const msg = 'Failed to load applications';
      setApplicationsError(msg);
      toast.error(msg);
      setApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  }, [getDonorApplications]);

  const loadWishlist = useCallback(async (): Promise<void> => {
    setLoadingWishlist(true);
    setWishlistError(null);
    try {
      const res = await axios.get<{ status: string; data: { campaigns: Campaign[] } }>(
        `${API_BASE}/wishlist`
      );
      if (res.data.status === 'success') {
        setWishlist(res.data.data.campaigns);
      }
    } catch {
      const msg = 'Failed to load wishlist';
      setWishlistError(msg);
      toast.error(msg);
    } finally {
      setLoadingWishlist(false);
    }
  }, []);

  const removeFromWishlist = async (campaignId: string): Promise<void> => {
    setRemovingId(campaignId);
    try {
      await axios.delete(`${API_BASE}/wishlist/${campaignId}`);
      setWishlist((prev) => prev.filter((c) => c.id !== campaignId));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove from wishlist');
    } finally {
      setRemovingId(null);
    }
  };

  const handleApplicationAction = async (
    applicationId: string,
    status: ApplicationStatus,
    rejectionReason: string | null
  ): Promise<void> => {
    try {
      const response = await updateApplicationStatus(applicationId, { status, rejectionReason });
      if (response.success === true) {
        toast.success(`Application ${status === 'ACCEPTED' ? 'accepted' : 'rejected'} successfully`);
        await loadApplications();
      }
    } catch {
      toast.error('Failed to update application. Please try again.');
    }
  };

  const handleRejectSubmit = (reason: string): void => {
    if (rejectionInfo) {
      const { id } = rejectionInfo;
      setRejectionInfo(null);
      handleApplicationAction(id, 'REJECTED', reason);
    }
  };

  const handleAcceptConfirm = (): void => {
    if (confirmInfo) {
      const { id } = confirmInfo;
      setConfirmInfo(null);
      handleApplicationAction(id, 'ACCEPTED', null);
    }
  };

  // ── Effects ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    loadMyDonations();
  }, []);

  useEffect(() => {
    const fetchEligibility = async (): Promise<void> => {
      try {
        const res = await axios.get<{ status: string; data: Eligibility }>(
          `${API_BASE}/donations/me/eligibility`
        );
        if (res.data.status === 'success') setEligibility(res.data.data);
      } catch {
        // non-critical
      }
    };
    fetchEligibility();
  }, []);

  useEffect(() => {
    if (selectedTab === 'applications') loadApplications();
    if (selectedTab === 'wishlist') loadWishlist();
  }, [selectedTab]);

  useEffect(() => { setDonationsPage(1); }, [filterAmount]);
  useEffect(() => { setApplicationsPage(1); }, [statusFilter]);

  const switchTab = (tab: Tab): void => {
    setSelectedTab(tab);
    setSidebarOpen(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-orange-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-blue-900 border-r-4 border-orange-400
          transform transition-transform duration-300 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-6 border-b-2 border-orange-400">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center text-blue-900 font-bold text-xl">
              {donorName?.charAt(0) || 'D'}
            </div>
            <div>
              <p className="text-white font-bold">{donorName || 'Donor'}</p>
              <p className="text-orange-200 text-sm">Donor</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem icon="dashboard" label="Dashboard" active={selectedTab === 'overview'} onClick={() => switchTab('overview')} />
          <NavItem
            icon="folder" label="My Projects" active={selectedTab === 'projects'}
            badge={projectsCount} badgeColor="bg-orange-400 text-blue-900"
            onClick={() => { switchTab('projects'); onViewProjects?.(); }}
          />
          <NavItem
            icon="file" label="Applications" active={selectedTab === 'applications'}
            badge={pendingApplicationsCount}
            onClick={() => switchTab('applications')}
          />
          <NavItem icon="heart" label="Donations" active={selectedTab === 'donations'} onClick={() => switchTab('donations')} />
          <NavItem icon="star" label="Wishlist" active={selectedTab === 'wishlist'} onClick={() => switchTab('wishlist')} />
        </nav>

        <div className="p-4 border-t-2 border-orange-400">
          {eligibility && !eligibility.canCreateOpportunity && (
            <p className="text-orange-200 text-xs text-center mb-2">
              Donate {formatCurrency(eligibility.perProjectCost)} more to unlock
            </p>
          )}
          <button
            onClick={() => { onCreateProject?.(); setSidebarOpen(false); }}
            disabled={!eligibility?.canCreateOpportunity}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all
              ${eligibility?.canCreateOpportunity
                ? 'bg-orange-400 text-blue-900 hover:scale-105'
                : 'bg-blue-800 text-blue-400 cursor-not-allowed border-2 border-blue-700'}`}
          >
            <Ico name="plus" className="w-5 h-5" />
            Create Project
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto min-w-0">
        <header className="bg-white border-b-4 border-blue-900 sticky top-0 z-30 px-4 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-blue-900">
            <Ico name="menu" className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-blue-900">
            {selectedTab === 'overview' && 'Dashboard Overview'}
            {selectedTab === 'projects' && 'My Projects'}
            {selectedTab === 'applications' && 'Student Applications'}
            {selectedTab === 'donations' && 'Donation History'}
            {selectedTab === 'wishlist' && 'My Wishlist'}
          </h2>
          <div className="w-6 lg:hidden" />
        </header>

        <div className="p-4 lg:p-8">

          {/* ═══════ OVERVIEW ═══════ */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-blue-900/30 px-5 py-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-blue-900">Welcome back, {donorName}! 👋</h1>
                    <p className="text-blue-900/60 text-sm mt-1">Research Karega India, Toh aage Badhega India</p>
                  </div>
                  <TierProgress totalDonated={totalDonated} />
                </div>
              </div>

              {eligibility && (
                <div className="bg-white border-2 border-blue-900 rounded-xl p-5 shadow-lg">
                  <p className="font-bold text-blue-900 mb-2">Project Slots</p>
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span>{eligibility.createdProjects} / {eligibility.allowedProjects} used</span>
                    <span>{eligibility.remainingProjects} remaining</span>
                  </div>
                  <div className="w-full h-3 bg-orange-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-700"
                      style={{
                        width: eligibility.allowedProjects === 0
                          ? '0%'
                          : `${(eligibility.createdProjects / eligibility.allowedProjects) * 100}%`,
                      }}
                    />
                  </div>
                  {!eligibility.canCreateOpportunity && (
                    <p className="mt-2 text-sm text-red-600 font-bold">
                      Donate {formatCurrency(eligibility.perProjectCost)} more to unlock project creation
                    </p>
                  )}
                </div>
              )}

              {loadingDonations ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
                </div>
              ) : donationsError ? (
                <ErrorBanner message={donationsError} onRetry={loadMyDonations} />
              ) : myDonations.length === 0 ? (
                <div className="bg-white border-2 border-blue-900/30 rounded-xl p-6 text-center">
                  <p className="text-blue-900/60">Make your first donation to see your stats here 💝</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <EliteStat icon="💝" title="Total Donated" value={formatCurrency(totalDonated)} />
                  <EliteStat icon="📊" title="Avg Donation" value={formatCurrency(avgDonation)} />
                  <EliteStat icon="🏆" title="Biggest Gift" value={formatCurrency(maxDonation)} />
                  <EliteStat icon="🎯" title="Campaigns Supported" value={projectsSupported} />
                </div>
              )}
              <div className="grid md:grid-cols-1 gap-4">

                <DonorAnalyticsChart
                  monthlyTotal={monthlyTotal}
                  impactScore={impactScore}
                />
                <DonationHeatmap donations={myDonations} />

              </div>
              {!loadingDonations && myDonations.length > 0 && (
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl border-2 border-orange-400 p-6 shadow-lg text-white">
                  <h3 className="text-2xl font-bold mb-1">Your Impact 🚀</h3>
                  <p className="text-orange-200 text-sm mb-4">
                    Impact Score = Total donated + (campaigns × 500) + (donations × 50)
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-orange-200 text-sm">This Month</p>
                      <p className="text-3xl font-bold">{formatCurrency(monthlyTotal)}</p>
                    </div>
                    <div>
                      <p className="text-orange-200 text-sm">Impact Score</p>
                      <p className="text-3xl font-bold">{impactScore.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-orange-200 text-sm">Research Enabled</p>
                      <p className="text-3xl font-bold">{projectsSupported} Projects</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={onCreateProject}
                  className="bg-white rounded-xl border-2 border-blue-900 p-6 shadow-lg hover:scale-105 transition-transform text-left group"
                >
                  <div className="w-16 h-16 bg-green-400 rounded-lg flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                    <Ico name="plus" className="w-8 h-8 text-blue-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">Create New Project</h3>
                  <p className="text-blue-900/70">Post a new project opportunity for students</p>
                </button>
                <button
                  onClick={onViewProjects}
                  className="bg-white rounded-xl border-2 border-blue-900 p-6 shadow-lg hover:scale-105 transition-transform text-left group"
                >
                  <div className="w-16 h-16 bg-orange-400 rounded-lg flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                    <Ico name="folder" className="w-8 h-8 text-blue-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">View My Projects</h3>
                  <p className="text-blue-900/70">Manage your existing projects and applications</p>
                </button>
              </div>
            </div>
          )}

          {/* ═══════ APPLICATIONS ═══════ */}
          {selectedTab === 'applications' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-2 rounded-lg font-bold border-2 border-blue-900 text-sm transition-all
                      ${statusFilter === s ? 'bg-orange-400 text-blue-900' : 'bg-white text-blue-900 hover:bg-orange-100'}`}
                  >
                    {s}
                    {s !== 'ALL' && (
                      <span className="ml-2 text-xs opacity-60">
                        ({applications.filter((a) => a.status === s).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {applicationsError && <ErrorBanner message={applicationsError} onRetry={loadApplications} />}

              {loadingApplications ? (
                <div className="space-y-4">{[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}</div>
              ) : filteredApps.length === 0 ? (
                <EmptyState
                  icon="📄"
                  title="No Applications"
                  description={
                    statusFilter === 'ALL'
                      ? "Students haven't applied to your projects yet."
                      : `No ${statusFilter.toLowerCase()} applications.`
                  }
                />
              ) : (
                <>
                  {paginatedApps.map((app) => (
                    <div key={app.id} className="bg-white rounded-xl border-2 border-blue-900 p-6 shadow-lg">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center text-blue-900 font-bold text-xl">
                            {app.user?.name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-blue-900">{app.user?.name || 'Student'}</h3>
                            <p className="text-blue-900/70 text-sm">{app.user?.email}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 self-start
                          ${app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''}
                          ${app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800 border-green-300' : ''}
                          ${app.status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-300' : ''}`}
                        >
                          {app.status === 'PENDING' && '⏳ '}
                          {app.status === 'ACCEPTED' && '✓ '}
                          {app.status === 'REJECTED' && '✕ '}
                          {app.status}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-blue-900/70 mb-1">Applied for:</p>
                        <p className="text-lg font-bold text-blue-900">{app.donorProject?.title || 'Project'}</p>
                        <p className="text-blue-900/70">{app.donorProject?.organization}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-bold text-blue-900 mb-2">Cover Letter:</p>
                        <p className="text-blue-900 bg-orange-50 p-4 rounded-lg border-2 border-blue-900 line-clamp-4">
                          {app.coverLetter}
                        </p>
                      </div>

                      {app.skills && app.skills.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {app.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-yellow-100 text-blue-900 rounded-full border-2 border-yellow-400 text-sm font-bold"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-blue-900/60 mb-4">Applied on: {formatDate(app.createdAt)}</p>

                      {app.status === 'REJECTED' && app.rejectionReason && (
                        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg mb-4">
                          <p className="text-sm font-bold text-red-800 mb-1">Rejection Reason:</p>
                          <p className="text-red-700 text-sm">{app.rejectionReason}</p>
                        </div>
                      )}

                      {app.status === 'PENDING' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => setConfirmInfo({ id: app.id, title: `${app.user?.name || 'Student'} — ${app.donorProject?.title || 'Project'}` })}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-bold border-2 border-blue-900 hover:scale-105 transition-transform"
                          >
                            <Ico name="check-circle" className="w-5 h-5" /> Accept
                          </button>
                          <button
                            onClick={() => setRejectionInfo({ id: app.id, title: `${app.user?.name || 'Student'} — ${app.donorProject?.title || 'Project'}` })}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-bold border-2 border-blue-900 hover:scale-105 transition-transform"
                          >
                            <Ico name="x-circle" className="w-5 h-5" /> Reject
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

          {/* ═══════ PROJECTS ═══════ */}
          {selectedTab === 'projects' && (
            <EmptyState
              icon="📁"
              title="Projects View"
              description="Your projects will appear here"
              action={
                <button
                  onClick={onViewProjects}
                  className="px-6 py-3 bg-orange-400 text-blue-900 rounded-xl font-bold border-2 border-blue-900 hover:scale-105 transition-transform"
                >
                  Browse Projects
                </button>
              }
            />
          )}

          {/* ═══════ DONATIONS ═══════ */}
          {selectedTab === 'donations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <EliteStat icon="💝" title="Total Donated" value={formatCurrency(totalDonated)} loading={loadingDonations} />
                <EliteStat icon="📊" title="Avg Donation" value={formatCurrency(avgDonation)} loading={loadingDonations} />
                <EliteStat icon="🏆" title="Biggest Gift" value={formatCurrency(maxDonation)} loading={loadingDonations} />
                <EliteStat icon="🎯" title="Projects" value={projectsSupported} loading={loadingDonations} />
              </div>

              <div className="flex flex-wrap gap-3 items-center bg-white border-2 border-blue-900 rounded-xl p-4">
                <input
                  type="number"
                  placeholder="Min Amount Filter"
                  className="border-2 border-blue-900 p-2 rounded-lg text-blue-900 font-bold focus:outline-none focus:border-orange-500 w-48"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterAmount(Number(e.target.value))}
                />
                <button
                  onClick={() => exportCSV(myDonations)}
                  disabled={myDonations.length === 0}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-bold border-2 border-blue-900 hover:scale-105 transition-transform disabled:opacity-50"
                >
                  <Ico name="download" className="w-4 h-4" /> Export CSV
                </button>
                <button
                  onClick={loadMyDonations}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-bold border-2 border-blue-900 hover:scale-105 transition-transform"
                >
                  <Ico name="refresh" className="w-4 h-4" /> Refresh
                </button>
                {filterAmount > 0 && (
                  <p className="text-sm text-blue-900/60 font-medium ml-auto">
                    Showing {filteredDonations.length} of {myDonations.length} donations
                  </p>
                )}
              </div>

              {donationsError && <ErrorBanner message={donationsError} onRetry={loadMyDonations} />}

              {loadingDonations ? (
                <div className="space-y-4">{[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}</div>
              ) : filteredDonations.length === 0 ? (
                <EmptyState
                  icon="💝"
                  title="No Donations Found"
                  description={filterAmount > 0 ? `No donations above ${formatCurrency(filterAmount)}.` : "You haven't made any donations yet."}
                />
              ) : (
                <>
                  {paginatedDonations.map((d) => (
                    <div key={d.id} className="bg-white border-2 border-blue-900 rounded-xl p-6 shadow-lg hover:scale-[1.01] transition-transform">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-xl font-bold text-blue-900 truncate">{d.userProject?.title}</p>
                          <p className="text-sm text-blue-900/60 mt-1">{formatDate(d.createdAt)}</p>
                          {d.message && (
                            <p className="italic mt-2 text-blue-900/80 line-clamp-2">"{d.message}"</p>
                          )}
                        </div>
                        <p className="text-green-600 font-bold text-2xl shrink-0">{formatCurrency(d.amount)}</p>
                      </div>
                    </div>
                  ))}
                  <Pagination total={filteredDonations.length} page={donationsPage} pageSize={DONATIONS_PAGE_SIZE} onChange={setDonationsPage} />
                </>
              )}
            </div>
          )}

          {/* ═══════ WISHLIST ═══════ */}
          {selectedTab === 'wishlist' && (
            <div className="space-y-6">
              {wishlistError && <ErrorBanner message={wishlistError} onRetry={loadWishlist} />}

              {loadingWishlist ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
                </div>
              ) : wishlist.length === 0 ? (
                <EmptyState
                  icon="⭐"
                  title="Your Wishlist is Empty"
                  description="Browse campaigns and click the heart icon to save them here."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((campaign) => (
                    <div key={campaign.id} className="bg-white rounded-xl border-2 border-blue-900 overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={campaign.imageUrl || 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800'}
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-orange-400 text-blue-900 text-xs font-bold px-2 py-1 rounded border-2 border-blue-900">
                          {campaign.status}
                        </div>
                        <button
                          onClick={() => removeFromWishlist(campaign.id)}
                          disabled={removingId === campaign.id}
                          className="absolute top-2 left-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center border-2 border-blue-900 hover:bg-red-100 transition disabled:opacity-50"
                          title="Remove from wishlist"
                        >
                          {removingId === campaign.id
                            ? <span className="animate-spin text-xs">⏳</span>
                            : <Ico name="trash" className="w-4 h-4 text-red-600" />}
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-blue-900 mb-1 truncate">{campaign.title}</h3>
                        <p className="text-blue-900/70 text-sm line-clamp-2 mb-4">{campaign.description}</p>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm font-bold text-blue-900 mb-1">
                            <span>{formatCurrency(campaign.amountRaised)}</span>
                            <span>of {formatCurrency(campaign.goalAmount)}</span>
                          </div>
                          <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full transition-all duration-700"
                              style={{ width: `${Math.min(((campaign.amountRaised || 0) / campaign.goalAmount) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                        <a
                          href={`/campaign/${campaign.id}`}
                          className="block w-full text-center py-2 bg-orange-400 text-blue-900 font-bold rounded-lg border-2 border-blue-900 hover:bg-orange-500 transition-colors"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {rejectionInfo && (
        <RejectionModal
          applicationTitle={rejectionInfo.title}
          onClose={() => setRejectionInfo(null)}
          onSubmit={handleRejectSubmit}
        />
      )}
      {confirmInfo && (
        <ConfirmModal
          title="Accept Application"
          message={`Are you sure you want to accept ${confirmInfo.title}? This action cannot be undone.`}
          confirmLabel="Accept"
          confirmClass="bg-green-500"
          onClose={() => setConfirmInfo(null)}
          onConfirm={handleAcceptConfirm}
        />
      )}
    </div>
  );
};

// ─── Export wrapped with ToastProvider ───────────────────────────────────────
const DonorDashboard: React.FC<DonorDashboardProps> = (props) => (
  <ToastProvider>
    <DonorDashboardInner {...props} />
  </ToastProvider>
);

export default DonorDashboard;
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { VerificationModal } from './VerificationModal';
import { RestrictionModal } from './RestictionModal';
import type { Campaign, User } from '../types';
import { useNavigate } from "react-router-dom";
import PresidentDashboard from "./president/PresidentDashboard";
import PresidentMembers from "./president/PresidentMembers";
import PresidentCampaigns from "./president/PresidentCampaigns";
import UploadMembers from "./president/UploadMembers";
import AddMemberManually from "./president/AddMemberManually";
import { X } from 'lucide-react';

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);
const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const DashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);
const FolderIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const TrendingUpIcon = ({ className }: { className?: string , style?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
const ClockIcon = ({ className }: { className?: string , style?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
);
const CheckCircleIcon = ({ className }: { className?: string, style?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
  </svg>
);
const XCircleIcon = ({ className }: { className?: string, style?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
  </svg>
);
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const AwardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);
const FilterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const ArrowUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M12 19V5m-7 7l7-7 7 7" />
  </svg>
);

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface StudentDashboardProps {
  studentName: string;
  campaigns: Campaign[];
  onCreateCampaign: () => void;
  onViewCampaign: (id: string) => void;
  isClubPresident: boolean;
  isClubMember: boolean;
  clubVerified: boolean;
  user?: User | null;
  studentVerified?: boolean;
  onCreateCampaignDemo?: () => void;
}

type PresidentTab = 'dashboard' | 'members' | 'campaigns' | 'upload' | 'manual';

/* ─────────────────────────────────────────────
   NAV ITEM
───────────────────────────────────────────── */
function NavItem({
  icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-widest transition-all duration-150"
      style={
        active
          ? {
              background: '#FF7F00',
              color: '#003366',
              border: '3px solid #003366',
              boxShadow: '4px 4px 0 #003366',
              transform: 'translate(-2px,-2px)',
            }
          : {
              background: 'transparent',
              color: '#fed7aa',
              border: '3px solid transparent',
            }
      }
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,127,0,0.15)';
          (e.currentTarget as HTMLButtonElement).style.color = '#FF7F00';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.color = '#fed7aa';
        }
      }}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          className="px-2 py-0.5 text-xs font-black"
          style={{ background: '#003366', color: '#FF7F00', border: '2px solid #FF7F00' }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────
   KPI CARD
───────────────────────────────────────────── */
function KpiCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div
      className="bg-white flex flex-col gap-3 p-5 transition-all duration-150 hover:translate-x-[-3px] hover:translate-y-[-3px]"
      style={{ border: '3px solid #003366', boxShadow: `6px 6px 0 ${accent}` }}
    >
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#003366]/50">{label}</p>
        <div
          className="w-10 h-10 flex items-center justify-center flex-shrink-0"
          style={{ background: `${accent}22`, border: `2px solid ${accent}` }}
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-black text-[#003366] leading-none">{value}</p>
      <p className="text-xs font-bold text-[#003366]/50 uppercase tracking-wide">{sub}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; color: string; border: string }> = {
    approved: { bg: '#f0fdf4', color: '#166534', border: '#0B9C2C' },
    pending:  { bg: '#fffbeb', color: '#92400e', border: '#FF7F00' },
    rejected: { bg: '#fef2f2', color: '#991b1b', border: '#dc2626' },
  };
  const s = config[status.toLowerCase()] ?? config.pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest"
      style={{ background: s.bg, color: s.color, border: `2px solid ${s.border}` }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: s.border }}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function StudentDashboard({
  studentName = 'Rahul',
  campaigns = [],
  onCreateCampaign,
  user = null,
  onViewCampaign,
  studentVerified = false,
  isClubPresident = false,
  isClubMember = false,
  clubVerified = false,
  onCreateCampaignDemo,
}: StudentDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [presidentTab, setPresidentTab] = useState<PresidentTab>('dashboard');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isPresidentRestrictionOpen, setIsPresidentRestrictionOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isPartOfClub = isClubPresident || isClubMember;
  const canCreateCampaign = studentVerified && isPartOfClub;

  const analytics = useMemo(() => {
    const normalized = campaigns.map(c => ({
      status: c.status?.toLowerCase(),
      currentAmount: Number(c.currentAmount || 0),
      goalAmount: Number(c.goalAmount || 0),
    }));
    const approved = normalized.filter(c => c.status === 'approved');
    const pending = normalized.filter(c => c.status === 'pending');
    const rejected = normalized.filter(c => c.status === 'rejected');
    return {
      totalRaised: approved.reduce((sum, c) => sum + c.currentAmount, 0),
      approvedCount: approved.length,
      pendingCount: pending.length,
      rejectedCount: rejected.length,
    };
  }, [campaigns]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen && window.innerWidth < 1024 ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [sidebarOpen]);

  useEffect(() => {
    if (selectedTab === 'president' && !isClubPresident) setSelectedTab('overview');
  }, [selectedTab, isClubPresident]);

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch =
      !searchQuery ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.club?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || c.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handlePresidentClick = () => {
    studentVerified ? (window.location.href = '/verify-president') : setIsPresidentRestrictionOpen(true);
  };

  const handleCreateCampaign = () => {
    if (canCreateCampaign) onCreateCampaign();
    else if (!studentVerified) setIsVerificationModalOpen(true);
    else alert('You must be part of a club (Member or President) to create a campaign.');
  };

  const tabLabel = (t: string) => {
    if (t === 'overview') return 'Overview';
    if (t === 'campaigns') return 'Campaigns';
    if (t === 'milestones') return 'Milestones';
    if (t === 'president') return 'President Panel';
    return '';
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#fffbf5', fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── SIDEBAR OVERLAY ── */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside
        ref={sidebarRef}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: '#003366', borderRight: '4px solid #FF7F00' }}
        aria-label="Sidebar navigation"
      >
        {/* Brand */}
        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '3px solid #FF7F00' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center font-black text-xl"
              style={{ background: '#FF7F00', color: '#003366', border: '3px solid #fff', boxShadow: '3px 3px 0 #0B9C2C' }}
            >
              D
            </div>
            <div>
              <p className="font-black text-base text-white uppercase tracking-widest leading-none">DreamXec</p>
              <p className="text-[10px] font-bold text-orange-300 uppercase tracking-[0.2em]">Student Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-orange-300 hover:text-white p-1"
            aria-label="Close sidebar"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* User card */}
        <div className="px-5 py-5" style={{ borderBottom: '3px solid rgba(255,127,0,0.4)' }}>
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 flex items-center justify-center font-black text-xl flex-shrink-0"
              style={{ background: '#FF7F00', color: '#003366', border: '3px solid #fff', boxShadow: '3px 3px 0 #0B9C2C' }}
            >
              {studentName?.charAt(0) || 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm text-white uppercase tracking-wide truncate">{studentName}</p>
              <p className="text-[10px] text-orange-300 font-bold uppercase tracking-widest">Student Account</p>
              <div className="mt-2">
                {studentVerified ? (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest"
                    style={{ background: '#0B9C2C', color: '#fff', border: '2px solid #fff' }}
                  >
                    <CheckCircleIcon className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest"
                    style={{ background: '#FF7F00', color: '#003366', border: '2px solid #003366' }}
                  >
                    <ClockIcon className="w-3 h-3" /> Unverified
                  </span>
                )}
              </div>
            </div>
          </div>

          {isClubPresident && (
            <div
              className="mt-3 px-3 py-1.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white"
              style={{ background: 'rgba(255,127,0,0.2)', border: '2px solid #FF7F00' }}
            >
              <AwardIcon className="w-3.5 h-3.5 text-orange-300" />
              Club President
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavItem
            icon={<DashboardIcon className="w-5 h-5" />}
            label="Overview"
            active={selectedTab === 'overview'}
            onClick={() => { setSelectedTab('overview'); setSidebarOpen(false); }}
          />
          <NavItem
            icon={<FolderIcon className="w-5 h-5" />}
            label="Campaigns"
            active={selectedTab === 'campaigns'}
            badge={campaigns.length}
            onClick={() => { setSelectedTab('campaigns'); setSidebarOpen(false); }}
          />
          <NavItem
            icon={<ClockIcon className="w-5 h-5" />}
            label="Milestones"
            active={selectedTab === 'milestones'}
            onClick={() => { setSelectedTab('milestones'); setSidebarOpen(false); }}
          />
          {isClubPresident && (
            <NavItem
              icon={<UsersIcon className="w-5 h-5" />}
              label="President Panel"
              active={selectedTab === 'president'}
              onClick={() => { setSelectedTab('president'); setPresidentTab('dashboard'); setSidebarOpen(false); }}
            />
          )}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 space-y-2" style={{ borderTop: '3px solid #FF7F00' }}>
          {!clubVerified && !isClubPresident && (
            <>
              <button
                onClick={() => { handlePresidentClick(); setSidebarOpen(false); }}
                className="w-full py-2.5 text-xs font-black uppercase tracking-widest transition-all"
                style={{ background: 'transparent', color: '#FF7F00', border: '2px solid rgba(255,127,0,0.5)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#FF7F00'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,127,0,0.5)'; }}
              >
                Register as President
              </button>
              <button
                onClick={() => { window.location.href = '/refer-club'; setSidebarOpen(false); }}
                className="w-full py-2.5 text-xs font-black uppercase tracking-widest transition-all"
                style={{ background: 'transparent', color: '#FF7F00', border: '2px solid rgba(255,127,0,0.5)' }}
              >
                Refer Your Club
              </button>
            </>
          )}
          <button
            onClick={() => { handleCreateCampaign(); setSidebarOpen(false); }}
            disabled={!canCreateCampaign}
            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest transition-all"
            style={
              canCreateCampaign
                ? { background: '#FF7F00', color: '#003366', border: '3px solid #fff', boxShadow: '4px 4px 0 #0B9C2C' }
                : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', border: '2px solid rgba(255,255,255,0.15)', cursor: 'not-allowed' }
            }
          >
            <PlusIcon className="w-4 h-4" />
            Create Campaign
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════
          MAIN
      ══════════════════════════════════ */}
      <main className="flex-1 overflow-auto flex flex-col">

        {/* ── HEADER ── */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-5 py-4 bg-white"
          style={{ borderBottom: '4px solid #003366', boxShadow: '0 4px 0 #FF7F00' }}
        >
          <div className="flex items-center gap-4">
            <button
              ref={menuButtonRef}
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 transition-all"
              style={{ border: '2px solid #003366', color: '#003366' }}
              aria-label="Open sidebar"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-black text-[#003366] uppercase tracking-tight leading-none">
                {tabLabel(selectedTab)}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-3 h-1" style={{ background: '#FF7F00' }} />
                <div className="w-3 h-1" style={{ background: '#0B9C2C' }} />
                <div className="w-3 h-1" style={{ background: '#003366' }} />
                <p className="text-[10px] font-bold text-[#003366]/50 uppercase tracking-widest ml-1">
                  {selectedTab === 'overview' ? 'Monitor your performance' : 'Manage your campaigns'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div
              className="hidden md:flex items-center gap-2 px-3 py-2"
              style={{ border: '2px solid #003366', background: '#fffbf5' }}
            >
              <SearchIcon className="w-4 h-4 text-[#003366]/40" />
              <input
                type="text"
                placeholder="Quick search..."
                className="bg-transparent border-none outline-none text-xs font-bold text-[#003366] placeholder:text-[#003366]/40 w-40 uppercase tracking-wide"
              />
            </div>

            {/* Bell */}
            <button
              className="relative p-2.5 transition-all"
              style={{ border: '2px solid #003366', color: '#003366' }}
              aria-label="Notifications"
            >
              <BellIcon className="w-4 h-4" />
              {analytics.pendingCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-black text-white"
                  style={{ background: '#FF7F00', border: '2px solid #003366' }}
                >
                  {analytics.pendingCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <div className="flex-1 p-5 sm:p-6 lg:p-8 space-y-6">

          {/* ── PRESIDENT SUB NAV ── */}
          {selectedTab === 'president' && isClubPresident && (
            <div className="flex flex-wrap gap-2" style={{ borderBottom: '3px solid #003366', paddingBottom: '16px' }}>
              {([
                ['dashboard', 'Overview'],
                ['campaigns', 'Campaigns'],
                ['members', 'Members'],
                ['manual', 'Add Member'],
                ['upload', 'Upload CSV'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setPresidentTab(key as PresidentTab)}
                  className="px-4 py-2 text-xs font-black uppercase tracking-widest transition-all"
                  style={
                    presidentTab === key
                      ? { background: '#003366', color: '#FF7F00', border: '3px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }
                      : { background: '#fff', color: '#003366', border: '3px solid #003366' }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* ════════════════════════
              OVERVIEW TAB
          ════════════════════════ */}
          {selectedTab === 'overview' && (
            <>
              {/* Verification alert */}
              {!studentVerified && (
                <div
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4"
                  style={{ background: '#fffbeb', border: '3px solid #FF7F00', boxShadow: '5px 5px 0 #003366' }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                    style={{ background: '#FF7F00', border: '2px solid #003366' }}
                  >
                    <ClockIcon className="w-5 h-5 text-[#003366]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-sm text-[#003366] uppercase tracking-wide">Action Required: Verify Your Account</p>
                    <p className="text-xs font-medium text-[#003366]/70 mt-0.5">
                      Complete student verification to unlock campaign creation and full platform access.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="flex-shrink-0 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                    style={{ background: '#003366', border: '3px solid #003366', boxShadow: '4px 4px 0 #FF7F00' }}
                  >
                    Verify Now →
                  </button>
                </div>
              )}

              {/* KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <KpiCard
                  label="Total Raised"
                  value={`₹${analytics.totalRaised > 0 ? (analytics.totalRaised / 1000).toFixed(1) + 'K' : '0'}`}
                  sub="From approved campaigns"
                  icon={<TrendingUpIcon className="w-5 h-5" style={{ color: '#0B9C2C' } as any} />}
                  accent="#0B9C2C"
                />
                <KpiCard
                  label="Active"
                  value={analytics.approvedCount}
                  sub="Running campaigns"
                  icon={<CheckCircleIcon className="w-5 h-5" style={{ color: '#003366' } as any} />}
                  accent="#003366"
                />
                <KpiCard
                  label="Pending"
                  value={analytics.pendingCount}
                  sub="Under review"
                  icon={<ClockIcon className="w-5 h-5" style={{ color: '#FF7F00' } as any} />}
                  accent="#FF7F00"
                />
                <KpiCard
                  label="Rejected"
                  value={analytics.rejectedCount}
                  sub="Needs attention"
                  icon={<XCircleIcon className="w-5 h-5" style={{ color: '#dc2626' } as any} />}
                  accent="#dc2626"
                />
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Create Campaign */}
                <button
                  onClick={handleCreateCampaign}
                  disabled={!canCreateCampaign}
                  className="flex flex-col gap-4 p-6 text-left transition-all duration-150"
                  style={
                    canCreateCampaign
                      ? { background: '#fff', border: '3px solid #003366', boxShadow: '6px 6px 0 #0B9C2C', cursor: 'pointer' }
                      : { background: '#f5f5f5', border: '3px dashed #003366', opacity: 0.5, cursor: 'not-allowed' }
                  }
                  onMouseEnter={e => canCreateCampaign && ((e.currentTarget as HTMLElement).style.transform = 'translate(-3px,-3px)')}
                  onMouseLeave={e => canCreateCampaign && ((e.currentTarget as HTMLElement).style.transform = 'translate(0,0)')}
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center"
                    style={{ background: canCreateCampaign ? '#0B9C2C' : '#ccc', border: '3px solid #003366' }}
                  >
                    <PlusIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-[#003366] uppercase tracking-wide">Create New Campaign</p>
                    <p className="text-xs font-medium text-[#003366]/60 mt-1">Launch a fundraising initiative for your club</p>
                  </div>
                </button>

                {/* Demo Mode */}
                <button
                  onClick={() => navigate('/create-demo-campaign')}
                  className="flex flex-col gap-4 p-6 text-left transition-all duration-150"
                  style={{ background: '#fff7ed', border: '3px solid #FF7F00', boxShadow: '6px 6px 0 #003366' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translate(-3px,-3px)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translate(0,0)')}
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center text-2xl"
                    style={{ background: '#FF7F00', border: '3px solid #003366' }}
                  >
                    🎓
                  </div>
                  <div>
                    <p className="font-black text-sm text-[#003366] uppercase tracking-wide">Try Demo Mode</p>
                    <p className="text-xs font-medium text-[#003366]/60 mt-1">Explore campaign creation without commitment</p>
                  </div>
                </button>

                {/* View All */}
                <button
                  onClick={() => setSelectedTab('campaigns')}
                  className="flex flex-col gap-4 p-6 text-left transition-all duration-150"
                  style={{ background: '#fff', border: '3px solid #003366', boxShadow: '6px 6px 0 #FF7F00' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translate(-3px,-3px)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translate(0,0)')}
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center"
                    style={{ background: '#003366', border: '3px solid #003366' }}
                  >
                    <FolderIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-[#003366] uppercase tracking-wide">View All Campaigns</p>
                    <p className="text-xs font-medium text-[#003366]/60 mt-1">Access and manage your portfolio</p>
                  </div>
                </button>
              </div>

              {/* Tip Banner */}
              <div
                className="flex items-start gap-4 p-5"
                style={{ background: '#003366', border: '3px solid #FF7F00', boxShadow: '6px 6px 0 #FF7F00' }}
              >
                <div
                  className="w-11 h-11 flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: '#FF7F00', border: '3px solid #fff' }}
                >
                  💡
                </div>
                <div>
                  <p className="font-black text-sm text-[#FF7F00] uppercase tracking-widest mb-1">Pro Tip</p>
                  <p className="text-xs font-medium text-orange-200 leading-relaxed">
                    High-performing campaigns include clear goals, compelling storytelling, high-quality visuals, and regular updates.
                    Campaigns with detailed budgets see <span className="font-black text-white">40% higher</span> funding rates.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ════════════════════════
              CAMPAIGNS TAB
          ════════════════════════ */}
          {selectedTab === 'campaigns' && (
            <>
              {/* Filter bar */}
              <div
                className="p-4"
                style={{ background: '#fff', border: '3px solid #003366', boxShadow: '4px 4px 0 #FF7F00' }}
              >
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="flex-1 relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#003366]/40" />
                    <input
                      type="text"
                      placeholder="Search by title or club name..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm font-bold text-[#003366] placeholder:text-[#003366]/40 focus:outline-none uppercase tracking-wide"
                      style={{ border: '2px solid #003366', background: '#fffbf5' }}
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <FilterIcon className="w-4 h-4 text-[#003366]/50 flex-shrink-0" />
                    {['ALL', 'approved', 'pending', 'rejected'].map(s => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className="px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                        style={
                          filterStatus === s
                            ? { background: '#003366', color: '#FF7F00', border: '2px solid #003366', boxShadow: '2px 2px 0 #FF7F00' }
                            : { background: '#fff', color: '#003366', border: '2px solid #003366' }
                        }
                      >
                        {s === 'ALL' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Count */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-[#003366]/50 uppercase tracking-widest">Showing</span>
                <span
                  className="px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest"
                  style={{ background: '#FF7F00', border: '2px solid #003366' }}
                >
                  {filteredCampaigns.length} / {campaigns.length}
                </span>
              </div>

              {/* Empty state */}
              {campaigns.length === 0 ? (
                <div
                  className="p-12 text-center"
                  style={{ background: '#fff', border: '4px solid #003366', boxShadow: '8px 8px 0 #FF7F00' }}
                >
                  <div className="flex h-2 mb-8 max-w-xs mx-auto">
                    <div className="flex-1" style={{ background: '#FF7F00' }} />
                    <div className="flex-1" style={{ background: '#003366' }} />
                    <div className="flex-1" style={{ background: '#0B9C2C' }} />
                  </div>
                  <div
                    className="w-16 h-16 flex items-center justify-center mx-auto mb-5"
                    style={{ background: '#fff7ed', border: '3px solid #FF7F00', boxShadow: '4px 4px 0 #003366' }}
                  >
                    <FolderIcon className="w-8 h-8 text-[#FF7F00]" />
                  </div>
                  <h3 className="font-black text-xl text-[#003366] uppercase tracking-tight mb-2">No Campaigns Yet</h3>
                  <p className="text-sm font-medium text-[#003366]/60 mb-6 max-w-xs mx-auto">
                    Start your fundraising journey by creating your first campaign
                  </p>
                  <button
                    onClick={handleCreateCampaign}
                    disabled={!canCreateCampaign}
                    className="px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-all"
                    style={
                      canCreateCampaign
                        ? { background: '#003366', border: '3px solid #003366', boxShadow: '4px 4px 0 #FF7F00' }
                        : { background: '#ccc', border: '3px solid #999', cursor: 'not-allowed' }
                    }
                  >
                    Create Campaign
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCampaigns.map(campaign => {
                    const progress =
                      campaign.goalAmount > 0
                        ? Math.min((Number(campaign.currentAmount || 0) / Number(campaign.goalAmount || 1)) * 100, 100)
                        : 0;

                    return (
                      <div
                        key={campaign.id}
                        className="p-5 bg-white transition-all duration-150 hover:translate-x-[-3px] hover:translate-y-[-3px]"
                        style={{ border: '3px solid #003366', boxShadow: '6px 6px 0 #FF7F00' }}
                      >
                        {/* Campaign header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-black text-base text-[#003366] uppercase tracking-tight">{campaign.title}</h3>
                              <StatusBadge status={campaign.status} />
                            </div>
                            <p className="text-xs font-bold text-[#003366]/50 uppercase tracking-wide">
                              {campaign.club?.name}{campaign.club?.college && ` — ${campaign.club.college}`}
                            </p>
                          </div>
                        </div>

                        {/* Progress bar */}
                        {campaign.status === 'approved' && (
                          <div className="mb-4">
                            <div className="flex justify-between mb-2">
                              <span className="text-xs font-black text-[#003366]">₹{campaign.currentAmount.toLocaleString()}</span>
                              <span className="text-xs font-bold text-[#003366]/50">of ₹{campaign.goalAmount.toLocaleString()}</span>
                            </div>
                            <div
                              className="w-full h-3 overflow-hidden"
                              style={{ background: '#fff7ed', border: '2px solid #FF7F00' }}
                            >
                              <div
                                className="h-full transition-all duration-500"
                                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #0B9C2C, #16a34a)' }}
                              />
                            </div>
                            <p className="text-[10px] font-black text-[#003366]/50 mt-1 uppercase tracking-widest">
                              {progress.toFixed(1)}% funded
                            </p>
                          </div>
                        )}

                        {/* Rejection panel */}
                        {campaign.status?.toLowerCase() === 'rejected' && (
                          <div
                            className="mb-4"
                            style={{ border: '2px solid #dc2626', background: '#fef2f2' }}
                          >
                            <div
                              className="flex items-center justify-between px-3 py-2"
                              style={{ borderBottom: '2px solid #dc2626', background: '#fee2e2' }}
                            >
                              <span className="text-[10px] font-black uppercase tracking-widest text-red-800 flex items-center gap-1">
                                <XCircleIcon className="w-3.5 h-3.5" /> Campaign Rejected
                              </span>
                              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                                Attempt {(campaign.reapprovalCount || 0) + 1} / 3
                              </span>
                            </div>
                            <div className="p-3 space-y-2">
                              {campaign.rejectionReason && (
                                <p className="text-xs font-medium text-red-800 italic">
                                  "{campaign.rejectionReason}"
                                </p>
                              )}
                              <button
                                onClick={() => navigate(`/campaign/${campaign.id}/edit`)}
                                disabled={(campaign.reapprovalCount || 0) >= 3}
                                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all"
                                style={
                                  (campaign.reapprovalCount || 0) >= 3
                                    ? { background: '#9ca3af', border: '2px solid #9ca3af', cursor: 'not-allowed' }
                                    : { background: '#dc2626', border: '2px solid #991b1b', boxShadow: '3px 3px 0 #991b1b' }
                                }
                              >
                                {(campaign.reapprovalCount || 0) >= 3 ? 'Max Attempts Reached' : 'Edit & Resubmit →'}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* View button */}
                        <button
                          onClick={() => onViewCampaign(campaign.id)}
                          className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                          style={{ background: '#003366', border: '3px solid #003366', boxShadow: '4px 4px 0 #FF7F00' }}
                        >
                          View Details →
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ════════════════════════
              PRESIDENT PANEL
          ════════════════════════ */}
          {selectedTab === 'president' && isClubPresident && (
            <div className="space-y-6">
              {presidentTab === 'dashboard' && <PresidentDashboard />}
              {presidentTab === 'campaigns' && user?.clubIds?.[0] && <PresidentCampaigns clubId={user.clubIds[0]} />}
              {presidentTab === 'members' && <PresidentMembers clubId={user?.clubIds?.[0] || ''} currentUserId={user?.id || ''} />}
              {presidentTab === 'manual' && <AddMemberManually clubId={user?.clubIds?.[0] || ''} />}
              {presidentTab === 'upload' && <UploadMembers />}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <VerificationModal isOpen={isVerificationModalOpen} onClose={() => setIsVerificationModalOpen(false)} />
      <RestrictionModal
        isOpen={isPresidentRestrictionOpen}
        onClose={() => setIsPresidentRestrictionOpen(false)}
        onVerify={() => { setIsPresidentRestrictionOpen(false); setIsVerificationModalOpen(true); }}
      />
    </div>
  );
}
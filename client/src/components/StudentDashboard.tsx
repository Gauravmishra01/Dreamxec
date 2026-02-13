import React, { useState, useEffect, useRef, useMemo } from 'react';
import { VerificationModal } from './VerificationModal';
import { RestrictionModal } from './RestictionModal';
import type { Campaign, User } from '../types';
import CreateCampaignDemo from './CreateCampaignDemo';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PresidentDashboard from "./president/PresidentDashboard";
import PresidentMembers from "./president/PresidentMembers";
import PresidentCampaigns from "./president/PresidentCampaigns";
import UploadMembers from "./president/UploadMembers";
import AddMemberManually from "./president/AddMemberManually";
import { getMyClubs, type MyClub } from '../services/clubService';


// --- Icons (same as before) ---
const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const DashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const FolderIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const XCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M15 9l-6 6M9 9l6 6" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const AwardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
  </svg>
);

const ArrowUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 19V5m-7 7l7-7 7 7" />
  </svg>
);

const FilterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

// --- Interface Definition ---
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

type PresidentTab =
  | "dashboard"
  | "members"
  | "campaigns"
  | "upload"
  | "manual";



// --- Main Component ---
export default function StudentDashboard({
  studentName = "Rahul",
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
  const navigate = useNavigate();




  // Modals state
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isPresidentRestrictionOpen, setIsPresidentRestrictionOpen] = useState(false);

  const [presidentTab, setPresidentTab] = useState<PresidentTab>("dashboard");

  // Refs for accessibility
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // 🔒 SECURITY RULES
  const isPartOfClub = isClubPresident || isClubMember;
  const canCreateCampaign = studentVerified && isPartOfClub;

  // ✅ Production-safe analytics
  const analytics = useMemo(() => {
    const normalized = campaigns.map(c => ({
      status: c.status?.toLowerCase(),
      currentAmount: Number(c.currentAmount || 0),
      goalAmount: Number(c.goalAmount || 0),
    }));

    const approved = normalized.filter(c => c.status === "approved");
    const pending = normalized.filter(c => c.status === "pending");
    const rejected = normalized.filter(c => c.status === "rejected");

    return {
      totalRaised: approved.reduce((sum, c) => sum + c.currentAmount, 0),
      approvedCount: approved.length,
      pendingCount: pending.length,
      rejectedCount: rejected.length,
    };
  }, [campaigns]);


  // Calculate growth percentage (mock data)
  const growthPercentage = 0;

  // 🎯 Close sidebar on Escape key
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

  // 🎯 Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (selectedTab === "president" && !isClubPresident) {
      setSelectedTab("overview");
    }
  }, [selectedTab, isClubPresident]);


  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = searchQuery === '' ||
      campaign.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.club?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || campaign.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; dot: string }> = {
      approved: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
      pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
      rejected: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    };
    const styles = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${styles.bg} ${styles.text} border border-current border-opacity-20`}>
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handlePresidentClick = () => {
    if (studentVerified) {
      window.location.href = "/verify-president";
    } else {
      setIsPresidentRestrictionOpen(true);
    }
  };

  const handleCreateCampaign = () => {
    if (canCreateCampaign) {
      onCreateCampaign();
    } else if (!studentVerified) {
      setIsVerificationModalOpen(true);
    } else {
      alert("You must be part of a club (Member or President) to create a campaign.");
    }
  };

  useEffect(() => {
    console.log("Analytics:", analytics);
  }, [analytics]);

  console.log("StudentDashboard received campaigns:", campaigns);

  return (
    <div className="min-h-screen bg-orange-50 flex overflow-hidden">
      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-blue-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ease-in-out ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar - DreamXec Navy Theme */}
      <aside
        ref={sidebarRef}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-blue-900 border-r-2 border-orange-400 transform transition-all duration-300 ease-in-out shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        aria-label="Sidebar navigation"
        role="navigation"
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          {/* <div className="p-6 border-b-2 border-orange-400 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-blue-900 font-bold text-lg">D</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-orange-400">DreamXec</h1>
                <p className="text-xs text-orange-200">Student Portal</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-orange-400 hover:text-orange-300 p-2 rounded-lg hover:bg-blue-800 transition-all"
              aria-label="Close sidebar"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div> */}

          {/* User Profile Card */}
          <div className="p-6 border-b-2 border-orange-400">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-blue-900 font-semibold text-base shadow-lg ring-2 ring-orange-300">
                {studentName?.charAt(0) || 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{studentName}</p>
                <p className="text-xs text-orange-200">Student Account</p>
                {studentVerified ? (
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                    <CheckCircleIcon className="w-3 h-3" />
                    Student Status Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                    <ClockIcon className="w-3 h-3" />
                    Unverified
                  </span>
                )}
              </div>
            </div>
            {isClubPresident && (
              <div className="mt-3 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5">
                <AwardIcon className="w-3.5 h-3.5" />
                Club President
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto" role="menu">
            <button
              onClick={() => {
                setSelectedTab('overview');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${selectedTab === 'overview'
                ? 'bg-orange-400 text-blue-900 shadow-lg'
                : 'text-orange-100 hover:text-white hover:bg-blue-800'
                }`}
              role="menuitem"
            >
              <DashboardIcon className="w-5 h-5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => {
                setSelectedTab('campaigns');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${selectedTab === 'campaigns'
                ? 'bg-orange-400 text-blue-900 shadow-lg'
                : 'text-orange-100 hover:text-white hover:bg-blue-800'
                }`}
              role="menuitem"
            >
              <FolderIcon className="w-5 h-5" />
              <span>Campaigns</span>
              {campaigns.length > 0 && (
                <span className="ml-auto px-2 py-0.5 bg-orange-400 text-blue-900 rounded-md text-xs font-semibold">
                  {campaigns.length}
                </span>
              )}
            </button>

            {isClubPresident && (
              <button
                onClick={() => {
                  setSelectedTab("president");
                  setPresidentTab("dashboard");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
      ${selectedTab === "president"
                    ? "bg-orange-400 text-blue-900 shadow-lg"
                    : "text-orange-100 hover:text-white hover:bg-blue-800"
                  }`}
              >
                <UsersIcon className="w-5 h-5" />
                <span>President Panel</span>
              </button>
            )}

          </nav>

          {/* Action Buttons */}
          <div className="p-4 space-y-2 border-t-2 border-orange-400">
            {!clubVerified && !isClubPresident && (
              <>
                <button
                  onClick={() => {
                    handlePresidentClick();
                    setSidebarOpen(false);
                  }}
                  className="w-full px-4 py-2.5 bg-blue-800 hover:bg-blue-700 text-orange-400 rounded-lg text-sm font-medium transition-all duration-200 border border-orange-400/30"
                >
                  Register as President
                </button>

                <button
                  onClick={() => {
                    window.location.href = "/refer-club";
                    setSidebarOpen(false);
                  }}
                  className="w-full px-4 py-2.5 bg-blue-800 hover:bg-blue-700 text-orange-400 rounded-lg text-sm font-medium transition-all duration-200 border border-orange-400/30"
                >
                  Refer Your Club
                </button>
              </>
            )}

            <button
              onClick={() => {
                handleCreateCampaign();
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${canCreateCampaign
                ? 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-blue-900 shadow-lg shadow-orange-500/25'
                : 'bg-blue-800 text-blue-600 cursor-not-allowed border border-blue-700'
                }`}
              disabled={!canCreateCampaign}
            >
              <PlusIcon className="w-4 h-4" />
              Create Campaign
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {/* Professional Header - DreamXec Theme */}
        <header className="bg-white border-b-2 border-blue-900 sticky top-0 z-30 shadow-md">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                ref={menuButtonRef}
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-blue-900 p-2 hover:bg-orange-50 rounded-lg transition-all"
                aria-label="Open sidebar"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-blue-900">
                  {selectedTab === 'overview' && 'Dashboard'}
                  {selectedTab === 'campaigns' && 'Campaigns'}
                </h2>
                <p className="text-xs text-blue-900/60 mt-0.5">
                  {selectedTab === 'overview' && 'Monitor your campaign performance'}
                  {selectedTab === 'campaigns' && 'Manage all your fundraising initiatives'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar - Desktop */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                <SearchIcon className="w-4 h-4 text-blue-900/50" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="bg-transparent border-none outline-none text-sm text-blue-900 placeholder:text-blue-900/50 w-48"
                />
              </div>

              <button
                className="relative p-2 hover:bg-orange-50 rounded-lg transition-all"
                aria-label="Notifications"
              >
                <BellIcon className="w-5 h-5 text-blue-900" />
                {analytics.pendingCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              <button className="p-2 hover:bg-orange-50 rounded-lg transition-all" aria-label="Settings">
                <SettingsIcon className="w-5 h-5 text-blue-900" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* President Sub Navigation */}
          {selectedTab === "president" && isClubPresident && (
            <div className="border-b-2 border-blue-900 pb-4">
              <div className="flex items-center gap-3 flex-wrap">
                {[
                  ["dashboard", "Overview"],
                  ["campaigns", "Campaigns"],
                  ["members", "Members"],
                  ["manual", "Add Member"],
                  ["upload", "Upload Members CSV"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setPresidentTab(key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
           ${presidentTab === key
                        ? "bg-blue-900 text-white"
                        : "bg-white text-blue-900 border-2 border-blue-900/20 hover:bg-orange-50"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>


          )}


          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <>
              {/* Alert Banner */}
              {!studentVerified && (
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-400 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                      <ClockIcon className="w-5 h-5 text-blue-900" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-blue-900">Action Required: Verify Your Account</h3>
                      <p className="text-xs text-blue-900/70 mt-1">
                        Complete student verification to unlock campaign creation and full platform access.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsVerificationModalOpen(true)}
                      className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-all shadow-sm"
                    >
                      Verify Now
                    </button>
                  </div>
                </div>
              )}

              {/* KPI Cards Grid - DreamXec Theme */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Raised */}
                <div className="bg-white border-2 border-blue-900 rounded-xl p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-900/60 uppercase tracking-wider">Total Raised</p>
                      <p className="text-2xl font-bold text-blue-900 mt-2">₹{analytics.totalRaised > 0
                        ? (analytics.totalRaised / 1000).toFixed(1)
                        : "0"}K</p>
                      <div className="flex items-center gap-1 mt-2">
                        <ArrowUpIcon className="w-3 h-3 text-green-600" />
                        <span className="text-xs font-semibold text-green-600">+{growthPercentage}%</span>
                        <span className="text-xs text-blue-900/50">vs last month</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400 rounded-xl flex items-center justify-center">
                      <TrendingUpIcon className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Active Campaigns */}
                <div className="bg-white border-2 border-blue-900 rounded-xl p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-900/60 uppercase tracking-wider">Active</p>
                      <p className="text-2xl font-bold text-blue-900 mt-2">{analytics.approvedCount}</p>
                      <p className="text-xs text-blue-900/50 mt-2">Running campaigns</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-400 rounded-xl flex items-center justify-center">
                      <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Pending */}
                <div className="bg-white border-2 border-blue-900 rounded-xl p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-900/60 uppercase tracking-wider">Pending</p>
                      <p className="text-2xl font-bold text-blue-900 mt-2">{analytics.pendingCount}</p>
                      <p className="text-xs text-blue-900/50 mt-2">Under review</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-xl flex items-center justify-center">
                      <ClockIcon className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>

                {/* Total Campaigns */}
                <div className="bg-white border-2 border-blue-900 rounded-xl p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-900/60 uppercase tracking-wider">Total</p>
                      <p className="text-2xl font-bold text-blue-900 mt-2">{campaigns.length}</p>
                      <p className="text-xs text-blue-900/50 mt-2">All campaigns</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-400 rounded-xl flex items-center justify-center">
                      <FolderIcon className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Create Campaign */}
                <button
                  onClick={handleCreateCampaign}
                  disabled={!canCreateCampaign}
                  className={`bg-white border-2 border-dashed rounded-xl p-6 text-left transition-all ${canCreateCampaign
                    ? 'border-blue-900 hover:border-orange-400 hover:bg-orange-50 cursor-pointer'
                    : 'border-blue-900/30 bg-gray-50 cursor-not-allowed opacity-60'
                    }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border-2 ${canCreateCampaign ? 'bg-green-100 border-green-400' : 'bg-gray-200 border-gray-300'
                      }`}
                  >
                    <PlusIcon className={`w-6 h-6 ${canCreateCampaign ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <h3 className="text-base font-semibold text-blue-900 mb-1">Create New Campaign</h3>
                  <p className="text-sm text-blue-900/60">Launch a fundraising initiative for your club</p>
                </button>

                {/* Demo */}
                <button
                  onClick={() => navigate("/create-demo-campaign")}
                  className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-400 rounded-xl p-6 text-left hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 border-2 border-orange-600 rounded-xl flex items-center justify-center mb-4 text-2xl">
                    🎓
                  </div>
                  <h3 className="text-base font-semibold text-blue-900 mb-1">Try Demo Mode</h3>
                  <p className="text-sm text-blue-900/70">Explore campaign creation without commitment</p>
                </button>

                {/* View All */}
                <button
                  onClick={() => setSelectedTab('campaigns')}
                  className="bg-white border-2 border-blue-900 rounded-xl p-6 text-left hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-blue-100 border-2 border-blue-400 rounded-xl flex items-center justify-center mb-4">
                    <FolderIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-blue-900 mb-1">View All Campaigns</h3>
                  <p className="text-sm text-blue-900/60">Access and manage your portfolio</p>
                </button>
              </div>

              {/* Tips Section */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 border-2 border-orange-400 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">💡</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-orange-400">Success Tips</h3>
                    <p className="text-sm text-orange-100 leading-relaxed">
                      High-performing campaigns include clear goals, compelling storytelling, high-quality visuals, and regular updates.
                      Campaigns with detailed budgets see 40% higher funding rates.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Campaigns Tab */}
          {selectedTab === 'campaigns' && (
            <>
              {/* Filters Bar */}
              <div className="bg-white border-2 border-blue-900 rounded-xl p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-900/50" />
                    <input
                      type="text"
                      placeholder="Search by title or club name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-blue-900/20 rounded-lg text-sm text-blue-900 placeholder:text-blue-900/50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <FilterIcon className="w-4 h-4 text-blue-900/50" />
                    {['ALL', 'approved', 'pending', 'rejected'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all ${filterStatus === status
                          ? 'bg-blue-900 text-white border-blue-900'
                          : 'bg-white text-blue-900 border-blue-900/20 hover:bg-orange-50 hover:border-orange-400'
                          }`}
                      >
                        {status === 'ALL' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-900/70">
                  Showing <span className="font-semibold text-blue-900">{filteredCampaigns.length}</span> of{' '}
                  <span className="font-semibold text-blue-900">{campaigns.length}</span> campaigns
                </p>
              </div>

              {/* Campaigns List */}
              {campaigns.length === 0 ? (
                <div className="bg-white border-2 border-blue-900 rounded-xl p-12 text-center">
                  <div className="w-16 h-16 bg-orange-100 border-2 border-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FolderIcon className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">No campaigns yet</h3>
                  <p className="text-sm text-blue-900/60 mb-6 max-w-sm mx-auto">
                    Start your fundraising journey by creating your first campaign
                  </p>
                  <button
                    onClick={handleCreateCampaign}
                    disabled={!canCreateCampaign}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold border-2 transition-all ${canCreateCampaign
                      ? 'bg-blue-900 text-white border-blue-900 hover:bg-blue-800'
                      : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                      }`}
                  >
                    Create Campaign
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCampaigns.map((campaign) => {
                    const progress =
                      campaign.goalAmount > 0
                        ? Math.min(
                          (Number(campaign.currentAmount || 0) /
                            Number(campaign.goalAmount || 1)) * 100,
                          100
                        )
                        : 0;
                    return (
                      <div
                        key={campaign.id}
                        className="bg-white border-2 border-blue-900 rounded-xl p-6 hover:shadow-lg transition-all"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-base font-semibold text-blue-900">{campaign.title}</h3>
                              {getStatusBadge(campaign.status)}
                            </div>
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-base font-semibold text-blue-900">{campaign.title}</h3>
                                  {getStatusBadge(campaign.status)}
                                </div>
                                <p className="text-sm text-blue-900/60">
                                  {campaign.club?.name}
                                  {campaign.club?.college && ` — ${campaign.club.college}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {campaign.status === 'approved' && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-semibold text-blue-900">
                                ₹{campaign.currentAmount.toLocaleString()}
                              </span>
                              <span className="text-blue-900/60">of ₹{campaign.goalAmount.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-orange-100 border-2 border-orange-400 rounded-full h-3 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                            <p className="text-xs text-blue-900/60 mt-1.5 font-semibold">{progress.toFixed(1)}% funded</p>
                          </div>
                        )}

                        {campaign.status === 'rejected' && campaign.rejectionReason && (
                          <div className="mb-4 p-3 bg-red-50 border-2 border-red-300 rounded-lg">
                            <p className="text-xs font-semibold text-red-900 mb-1">Rejection Reason</p>
                            <p className="text-xs text-red-700">{campaign.rejectionReason}</p>
                          </div>
                        )}

                        <button
                          onClick={() => onViewCampaign(campaign.id)}
                          className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg border-2 border-blue-900 transition-all"
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

          {/* President Panel */}
          {selectedTab === "president" && isClubPresident && (
            <div className="space-y-6">
              {presidentTab === "dashboard" && <PresidentDashboard />}
              {presidentTab === "campaigns" && user?.clubIds?.[0] && (<PresidentCampaigns clubId={user.clubIds[0]} />)}
              {presidentTab === "members" && <PresidentMembers clubId={user?.clubIds?.[0] || ""} currentUserId={user?.id || ""} />}
              {presidentTab === "manual" && <AddMemberManually clubId={user?.clubIds?.[0] || ""} />}
              {presidentTab === "upload" && <UploadMembers />}
            </div>
          )}


        </div>
      </main>

      {/* Modals */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />
      <RestrictionModal
        isOpen={isPresidentRestrictionOpen}
        onClose={() => setIsPresidentRestrictionOpen(false)}
        onVerify={() => {
          setIsPresidentRestrictionOpen(false);
          setIsVerificationModalOpen(true);
        }}
      />
    </div>
  );
}

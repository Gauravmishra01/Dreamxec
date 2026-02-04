import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DonorAnalyticsChart from "./DonorAnalyticsChart";
import DonationHeatmap from './CalendarHeatmap';

// API Base URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Icons
const StarDecoration = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const XCircleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M15 9l-6 6M9 9l6 6" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const MenuIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);

const DashboardIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const FolderIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const FileTextIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const HeartIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// Rejection Modal
const RejectionModal = ({ applicationTitle, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason.trim());
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black bg-opacity-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-orange-50 rounded-xl border-4 border-blue-900 shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-900 hover:scale-110 transition-transform"
        >
          <XCircleIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-blue-900 mb-4">Reject Application</h2>

        <div className="mb-4 p-3 bg-orange-100 rounded-lg border-2 border-orange-400">
          <p className="text-blue-900">
            Rejecting: <span className="font-bold">{applicationTitle}</span>
          </p>
        </div>

        <div>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
            className="w-full h-32 p-3 border-3 border-blue-900 rounded-lg text-blue-900 bg-white focus:outline-none focus:border-orange-500 resize-none"
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
              onClick={handleSubmit}
              disabled={!reason.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold border-2 border-blue-900 hover:scale-105 transition-transform disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function DonorDashboard({
  donorName,
  projectsCount,
  onCreateProject,
  onViewProjects,
  getDonorApplications,
  updateApplicationStatus,
  getDonationSummary
}) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [donationSummary, setDonationSummary] = useState(null);
  const [rejectionInfo, setRejectionInfo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [myDonations, setMyDonations] = useState([]);
  const [loadingDonations, setLoadingDonations] = useState(false);
  const [filterAmount, setFilterAmount] = useState(0);



  // Wishlist State
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const pendingApplicationsCount = applications.filter(app => app.status === 'PENDING').length;

  // ===== CORE ANALYTICS =====

  const totalDonated =
    myDonations.reduce((sum, d) => sum + d.amount, 0);

  const avgDonation =
    myDonations.length
      ? Math.round(totalDonated / myDonations.length)
      : 0;

  const maxDonation =
    myDonations.length
      ? Math.max(...myDonations.map(d => d.amount))
      : 0;

  const projectsSupported =
    new Set(myDonations.map(d => d.userProjectId)).size;

  const filteredDonations =
    myDonations.filter(d => d.amount >= filterAmount);


  // ===== ELITE ANALYTICS =====

  // 1️⃣ Most Supported Project
  const projectTotals = {};

  myDonations.forEach(d => {
    const title = d.userProject?.title || "Unknown";
    projectTotals[title] =
      (projectTotals[title] || 0) + d.amount;
  });



  // 2️⃣ Monthly Donations (this month)
  const now = new Date();

  const monthlyTotal =
    myDonations
      .filter(d => {
        const dt = new Date(d.createdAt);
        return dt.getMonth() === now.getMonth() &&
          dt.getFullYear() === now.getFullYear();
      })
      .reduce((s, d) => s + d.amount, 0);


  // 3️⃣ Impact Score (fun metric)
  const impactScore =
    totalDonated +
    projectsSupported * 500 +
    myDonations.length * 50;


  // 4️⃣ Donor Tier
  let donorTier = "Bronze";

  if (totalDonated > 5000) donorTier = "Silver";
  if (totalDonated > 20000) donorTier = "Gold";
  if (totalDonated > 50000) donorTier = "Platinum";



  const exportCSV = () => {
    const rows = myDonations.map(d =>
      `${d.userProject.title},${d.amount},${d.createdAt}`
    ).join("\n");

    const blob = new Blob([rows]);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "donations.csv";
    a.click();
  };


  // Load applications
  const loadApplications = async () => {
    console.log('DonorDashboard: Loading applications...');
    setLoadingApplications(true);
    try {
      const response = await getDonorApplications();
      if (response.status === 'success' && response.data) {
        console.log('DonorDashboard: Found applications:', response.data.applications.length);
        setApplications(response.data.applications);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('DonorDashboard: Failed to load applications:', error);
      setApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  // Load Wishlist
  const loadWishlist = async () => {
    setLoadingWishlist(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.status === 'success') {
        setWishlist(response.data.data.campaigns);
      }
    } catch (error) {
      console.error('Failed to load wishlist', error);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const loadMyDonations = async () => {
    try {
      setLoadingDonations(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE}/donations/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setMyDonations(res.data.donations);
      }
    } catch (err) {
      console.error("Failed to load donations", err);
    } finally {
      setLoadingDonations(false);
    }
  };


  // Handle application actions
  const handleApplicationAction = async (applicationId, status, rejectionReason) => {
    try {
      const response = await updateApplicationStatus(applicationId, {
        status,
        rejectionReason,
      });
      if (response.status === 'success') {
        await loadApplications();
      }
    } catch (error) {
      console.error('Failed to update application:', error);
    }
  };

  const handleRejectSubmit = (reason) => {
    if (rejectionInfo) {
      const { id } = rejectionInfo;
      setRejectionInfo(null);
      handleApplicationAction(id, 'REJECTED', reason);
    }
  };

  // Load donation summary
  useEffect(() => {
    const loadSummary = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No token found");
          return;
        }

        const res = await axios.get(
          `${API_BASE}/donations/summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("SUMMARY:", res.data);

        if (res.data.status === "success") {
          setDonationSummary(res.data.data);
        }

      } catch (err) {
        console.error("Summary error:", err);
      }
    };

    loadSummary();
  }, []);



  // Load data based on tab
  useEffect(() => {
    if (selectedTab === 'applications') {
      loadApplications();
    } else if (selectedTab === 'wishlist') {
      loadWishlist();
    }
    else if (selectedTab === 'donations') {
      loadMyDonations();
    }
  }, [selectedTab]);

  const EliteCard = ({ title, value }) => (
    <div className="bg-white border-2 border-blue-900 rounded-xl p-4 shadow text-center">
      <p className="opacity-70 font-bold">{title}</p>
      <p className="text-2xl font-bold text-blue-900">{value}</p>
    </div>
  );

  const EliteStat = ({ icon, title, value }) => (
    <div className="bg-white rounded-xl border-2 border-blue-900 p-5 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center text-xl">
          {icon}
        </div>
        <p className="font-bold text-blue-900 opacity-70">
          {title}
        </p>
      </div>

      <p className="text-2xl font-bold text-blue-900">
        {value}
      </p>
    </div>
  );


  return (
    <div className="min-h-screen bg-orange-50 flex">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dreamxec-berkeley-blue border-r-4 border-orange-400 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo/Brand */}
          {/* <div className="p-6 border-b-4 border-orange-400">
            <h1 className="text-2xl font-bold text-orange-400">DreamXec</h1>
            <p className="text-orange-200 text-sm mt-1">Donor Portal</p>
          </div> */}

          {/* User Info */}
          <div className="p-6 border-b-2 border-orange-400">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center text-blue-900 font-bold text-xl">
                {donorName ? donorName.charAt(0) : 'D'}
              </div>
              <div>
                <p className="text-white font-bold">{donorName || 'Donor'}</p>
                <p className="text-orange-200 text-sm">Donor</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => {
                setSelectedTab('overview');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${selectedTab === 'overview'
                ? 'bg-orange-400 text-blue-900'
                : 'text-white hover:bg-blue-800'
                }`}
            >
              <DashboardIcon className="w-5 h-5" />
              Dashboard
            </button>

            <button
              onClick={() => {
                setSelectedTab('projects');
                setSidebarOpen(false);
                if (onViewProjects) onViewProjects();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${selectedTab === 'projects'
                ? 'bg-orange-400 text-blue-900'
                : 'text-white hover:bg-blue-800'
                }`}
            >
              <FolderIcon className="w-5 h-5" />
              My Projects
              {projectsCount > 0 && (
                <span className="ml-auto bg-orange-400 text-blue-900 px-2 py-1 rounded-full text-xs">
                  {projectsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setSelectedTab('applications');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${selectedTab === 'applications'
                ? 'bg-orange-400 text-blue-900'
                : 'text-white hover:bg-blue-800'
                }`}
            >
              <FileTextIcon className="w-5 h-5" />
              Applications
              {pendingApplicationsCount > 0 && (
                <span className="ml-auto bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                  {pendingApplicationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setSelectedTab('donations');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${selectedTab === 'donations'
                ? 'bg-orange-400 text-blue-900'
                : 'text-white hover:bg-blue-800'
                }`}
            >
              <HeartIcon className="w-5 h-5" />
              Donations
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                setSelectedTab('wishlist');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${selectedTab === 'wishlist'
                ? 'bg-orange-400 text-blue-900'
                : 'text-white hover:bg-blue-800'
                }`}
            >
              <StarDecoration className="w-5 h-5" />
              Wishlist
            </button>
          </nav>

          {/* Create Project Button */}
          <div className="p-4 border-t-2 border-orange-400">
            <button
              onClick={onCreateProject}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-400 text-blue-900 rounded-lg font-bold hover:scale-105 transition-transform"
            >
              <PlusIcon className="w-5 h-5" />
              Create Project
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b-4 border-blue-900 sticky top-0 z-30">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-blue-900"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-blue-900">
              {selectedTab === 'overview' && 'Dashboard Overview'}
              {selectedTab === 'projects' && 'My Projects'}
              {selectedTab === 'applications' && 'Student Applications'}
              {selectedTab === 'donations' && 'Donation History'}
              {selectedTab === 'wishlist' && 'My Wishlist'}
            </h2>
            <div className="w-6 lg:hidden" />
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 lg:p-8">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Message */}
              <div className="bg-white rounded-lg border border-blue-900/30 px-5 py-4 shadow-sm">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                  {/* LEFT SIDE */}
                  <div>
                    <h1 className="text-2xl font-bold text-blue-900">
                      Welcome back, {donorName}! 👋
                    </h1>

                    <p className="text-blue-900/60 text-sm mt-1">
                      Research Krega India, Tabhi Toh aage Badhega India
                    </p>
                  </div>

                  {/* RIGHT SIDE — SLIM DONOR TIER BADGE */}
                  <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-blue-900 px-4 py-2 rounded-lg font-semibold shadow-sm">
                    ⭐ {donorTier} Donor
                  </div>


                </div>

              </div>



              {/* Stats Grid */}
              {/* ===== ELITE STATS GRID ===== */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <EliteStat
                  icon="💝"
                  title="Total Donated"
                  value={`₹${totalDonated}`}
                />

                <EliteStat
                  icon="📊"
                  title="Avg Donation"
                  value={`₹${avgDonation}`}
                />

                <EliteStat
                  icon="🏆"
                  title="Biggest Gift"
                  value={`₹${maxDonation}`}
                />

                <EliteStat
                  icon="🎯"
                  title="Projects"
                  value={projectsSupported}
                />

              </div>

              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl border-2 border-orange-400 p-6 shadow-lg text-white">

                <h3 className="text-2xl font-bold mb-4">
                  Your Impact 🚀
                </h3>

                <div className="grid md:grid-cols-3 gap-4">

                  <div>
                    <p className="text-orange-200 text-sm">
                      Lives Impacted
                    </p>
                    <p className="text-3xl font-bold">
                      {projectsSupported}+
                    </p>
                  </div>

                  <div>
                    <p className="text-orange-200 text-sm">
                      Research Enabled
                    </p>
                    <p className="text-3xl font-bold">
                      {projectsSupported} Projects
                    </p>
                  </div>

                  <div>
                    <p className="text-orange-200 text-sm">
                      Community Rank
                    </p>
                    <p className="text-3xl font-bold">
                      🌟 Top Supporter
                    </p>
                  </div>

                </div>

              </div>

              {/* ===== DONOR INSIGHTS ===== */}
              <div className="grid md:grid-cols-1 gap-4">

                <DonorAnalyticsChart
                  monthlyTotal={monthlyTotal}
                  impactScore={impactScore}
                />
                <DonationHeatmap donations={myDonations} />

              </div>


              {/* ===== IMPACT CARD ===== */}

              {/* Donation Summary Card */}
              {/* {donationSummary && (
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl border-4 border-orange-400 p-6 shadow-lg text-white">
                  <h3 className="text-2xl font-bold mb-4">Your Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-orange-200 text-sm mb-1">Total Donated</p>
                      <p className="text-3xl font-bold">₹{donationSummary.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-orange-200 text-sm mb-1">Campaigns Supported</p>
                      <p className="text-3xl font-bold">{donationSummary.projectsSupported}</p>
                    </div>
                    <div>
                      <p className="text-orange-200 text-sm mb-1">Lives Impacted</p>
                      <p className="text-3xl font-bold">{donationSummary.projectsSupported * 12}+</p>
                    </div>
                  </div>
                </div>
              )} */}

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={onCreateProject}
                  className="bg-white rounded-xl border-4 border-blue-900 p-6 shadow-lg hover:scale-105 transition-transform text-left group"
                >
                  <div className="w-16 h-16 bg-green-400 rounded-lg flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                    <PlusIcon className="w-8 h-8 text-blue-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">Create New Project</h3>
                  <p className="text-blue-900 opacity-70">
                    Post a new project opportunity for students
                  </p>
                </button>

                <button
                  onClick={onViewProjects}
                  className="bg-white rounded-xl border-4 border-blue-900 p-6 shadow-lg hover:scale-105 transition-transform text-left group"
                >
                  <div className="w-16 h-16 bg-orange-400 rounded-lg flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                    <FolderIcon className="w-8 h-8 text-blue-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">View My Projects</h3>
                  <p className="text-blue-900 opacity-70">
                    Manage your existing projects and applications
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {selectedTab === 'applications' && (
            <div className="space-y-4">
              {loadingApplications ? (
                <div className="bg-white rounded-xl border-4 border-blue-900 p-12 text-center shadow-lg">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
                  <p className="mt-4 text-blue-900">Loading applications...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="bg-white rounded-xl border-4 border-blue-900 p-12 text-center shadow-lg">
                  <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileTextIcon className="w-8 h-8 text-blue-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">No Applications Yet</h3>
                  <p className="text-blue-900 opacity-70">
                    Students haven't applied to your projects yet
                  </p>
                </div>
              ) : (
                applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-xl border-4 border-blue-900 p-6 shadow-lg"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center text-blue-900 font-bold text-xl">
                            {app.user?.name ? app.user.name.charAt(0) : 'S'}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-blue-900">{app.user?.name || 'Student'}</h3>
                            <p className="text-blue-900 opacity-70 text-sm">{app.user?.email || 'student@email.com'}</p>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${app.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                          : app.status === 'ACCEPTED'
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'bg-red-100 text-red-800 border-red-300'
                          }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-blue-900 opacity-70 mb-1">Applied for:</p>
                      <p className="text-lg font-bold text-blue-900">{app.donorProject?.title || 'Project'}</p>
                      <p className="text-blue-900 opacity-70">{app.donorProject?.organization || 'Organization'}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-bold text-blue-900 mb-2">Cover Letter:</p>
                      <p className="text-blue-900 bg-orange-50 p-4 rounded-lg border-2 border-blue-900">
                        {app.coverLetter}
                      </p>
                    </div>

                    {app.skills && app.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-bold text-blue-900 mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {app.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-yellow-100 text-blue-900 rounded-full border-2 border-yellow-400 text-sm font-bold"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-blue-900 opacity-60 mb-4">
                      Applied on: {new Date(app.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>

                    {app.status === 'REJECTED' && app.rejectionReason && (
                      <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg mb-4">
                        <h4 className="text-sm font-bold text-red-800 mb-2">Rejection Reason:</h4>
                        <p className="text-red-700 text-sm">{app.rejectionReason}</p>
                      </div>
                    )}

                    {app.status === 'PENDING' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApplicationAction(app.id, 'ACCEPTED', null)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-bold border-2 border-blue-900 hover:scale-105 transition-transform"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            setRejectionInfo({
                              id: app.id,
                              title: `${app.user?.name || 'Student'} - ${app.donorProject?.title || 'Project'}`
                            })
                          }
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-bold border-2 border-blue-900 hover:scale-105 transition-transform"
                        >
                          <XCircleIcon className="w-5 h-5" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Projects Tab */}
          {selectedTab === 'projects' && (
            <div className="bg-white rounded-xl border-4 border-blue-900 p-12 text-center shadow-lg">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">Projects View</h3>
              <p className="text-blue-900 opacity-70">Your projects will appear here</p>
            </div>
          )}

          {/* Donations Tab */}
          {selectedTab === "donations" && (
            <div className="space-y-6">

              {/* ===== ELITE STATS ===== */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <EliteCard title="Total Donated" value={`₹${totalDonated}`} />
                <EliteCard title="Avg Donation" value={`₹${avgDonation}`} />
                <EliteCard title="Biggest Gift" value={`₹${maxDonation}`} />
                <EliteCard title="Projects" value={projectsSupported} />

              </div>

              {/* ===== ACTION BAR ===== */}
              <div className="flex gap-3 items-center">

                <input
                  type="number"
                  placeholder="Min Amount Filter"
                  className="border-2 border-blue-900 p-2 rounded"
                  onChange={e => setFilterAmount(Number(e.target.value))}
                />

                <button
                  onClick={exportCSV}
                  className="bg-green-500 text-white px-4 py-2 rounded font-bold"
                >
                  Export CSV
                </button>

                <button
                  onClick={loadMyDonations}
                  className="bg-blue-500 text-white px-4 py-2 rounded font-bold"
                >
                  Refresh
                </button>

              </div>

              {/* ===== DONATION CARDS ===== */}
              {filteredDonations.map(d => (

                <div
                  key={d.id}
                  className="bg-white border-4 border-blue-900 rounded-xl p-6 shadow-lg hover:scale-[1.02] transition"
                >
                  <p className="text-xl font-bold text-blue-900">
                    {d.userProject.title}
                  </p>

                  <p className="text-green-600 font-bold text-lg">
                    ₹{d.amount}
                  </p>

                  <p className="text-sm opacity-60">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </p>

                  {d.message &&
                    <p className="italic mt-2">"{d.message}"</p>
                  }

                </div>

              ))}

            </div>
          )}


          {/* Wishlist Tab (NEW) */}
          {selectedTab === 'wishlist' && (
            <div className="space-y-6">
              {loadingWishlist ? (
                <div className="bg-white rounded-xl border-4 border-blue-900 p-12 text-center shadow-lg">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
                  <p className="mt-4 text-blue-900">Loading wishlist...</p>
                </div>
              ) : wishlist.length === 0 ? (
                <div className="bg-white rounded-xl border-4 border-blue-900 p-12 text-center shadow-lg">
                  <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HeartIcon className="w-8 h-8 text-blue-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">Your Wishlist is Empty</h3>
                  <p className="text-blue-900 opacity-70">
                    Browse campaigns and click the heart icon to save them here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((campaign) => (
                    <div key={campaign.id} className="bg-white rounded-xl border-4 border-blue-900 overflow-hidden shadow-lg hover:transform hover:scale-105 transition-all duration-300">
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={campaign.imageUrl || "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"}
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-dreamxec-orange text-white text-xs font-bold px-2 py-1 rounded border-2 border-blue-900">
                          {campaign.status}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-blue-900 mb-2 truncate">{campaign.title}</h3>
                        <p className="text-blue-900 opacity-70 text-sm line-clamp-2 mb-4">
                          {campaign.description}
                        </p>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm font-bold text-blue-900 mb-1">
                            <span>₹{campaign.amountRaised?.toLocaleString() || 0}</span>
                            <span>of ₹{campaign.goalAmount?.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${Math.min(((campaign.amountRaised || 0) / campaign.goalAmount) * 100, 100)}%` }}
                            />
                          </div>
                        </div>

                        <a
                          href={`/campaigns/${campaign.id}`}
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

      {/* Rejection Modal */}
      {rejectionInfo && (
        <RejectionModal
          applicationTitle={rejectionInfo.title}
          onClose={() => setRejectionInfo(null)}
          onSubmit={handleRejectSubmit}
        />
      )}
    </div>
  );
}
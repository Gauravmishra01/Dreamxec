import React, { useState } from 'react';

// Icons
const StarDecoration = ({ className, color }) => (
  <svg className={className} viewBox="0 0 24 24" fill={color || "currentColor"}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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

const PlusIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const TrendingUpIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
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

const SearchIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const BellIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const AwardIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

// Main Component
export default function StudentDashboard({
  studentName = "Rahul",
  campaigns = [],
  onCreateCampaign,
  onViewCampaign,
  isClubPresident = false,
  isClubMember = false,
  clubVerified = false,
}) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Calculate stats
  const totalRaised = campaigns
    .filter((c) => c.status === 'approved')
    .reduce((sum, c) => sum + c.currentAmount, 0);
  const approvedCount = campaigns.filter((c) => c.status === 'approved').length;
  const pendingCount = campaigns.filter((c) => c.status === 'pending').length;
  const rejectedCount = campaigns.filter((c) => c.status === 'rejected').length;

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = searchQuery === '' || 
      campaign.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.clubName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'ALL' || campaign.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = {
      approved: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
    };
    const styles = config[status] || config.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${styles.bg} ${styles.text} ${styles.border}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-orange-50 flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-blue-900 border-r-4 border-orange-400 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b-4 border-orange-400">
            <h1 className="text-2xl font-bold text-orange-400">DreamXec</h1>
            <p className="text-orange-200 text-sm mt-1">Student Portal</p>
          </div>

          {/* User Info */}
          <div className="p-6 border-b-2 border-orange-400">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center text-blue-900 font-bold text-xl">
                {studentName?.charAt(0) || 'S'}
              </div>
              <div>
                <p className="text-white font-bold">{studentName}</p>
                <p className="text-orange-200 text-sm">Student</p>
              </div>
            </div>
            {isClubPresident && (
              <div className="mt-3 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full inline-flex items-center gap-1">
                <AwardIcon className="w-3 h-3" />
                Club President
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => {
                setSelectedTab('overview');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${
                selectedTab === 'overview'
                  ? 'bg-orange-400 text-blue-900'
                  : 'text-white hover:bg-blue-800'
              }`}
            >
              <DashboardIcon className="w-5 h-5" />
              Dashboard
            </button>

            <button
              onClick={() => {
                setSelectedTab('campaigns');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${
                selectedTab === 'campaigns'
                  ? 'bg-orange-400 text-blue-900'
                  : 'text-white hover:bg-blue-800'
              }`}
            >
              <FolderIcon className="w-5 h-5" />
              My Campaigns
              {campaigns.length > 0 && (
                <span className="ml-auto bg-orange-400 text-blue-900 px-2 py-1 rounded-full text-xs">
                  {campaigns.length}
                </span>
              )}
            </button>

            {isClubPresident && (
              <button
                onClick={() => window.location.href = "/president"}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-white hover:bg-blue-800 transition-all"
              >
                <UsersIcon className="w-5 h-5" />
                President Panel
              </button>
            )}
          </nav>

          {/* Quick Actions */}
          <div className="p-4 space-y-2 border-t-2 border-orange-400">
            {!clubVerified && (
              <>
                <button
                  onClick={() => window.location.href = "/verify-president"}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-all"
                >
                  ✓ I'm President
                </button>
                <button
                  onClick={() => window.location.href = "/refer-club"}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 transition-all"
                >
                  ✓ Refer Club
                </button>
              </>
            )}
            <button
              onClick={onCreateCampaign}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-400 text-blue-900 rounded-lg font-bold hover:scale-105 transition-transform"
            >
              <PlusIcon className="w-5 h-5" />
              Create Campaign
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b-4 border-blue-900 sticky top-0 z-30">
          <div className="px-4 py-4 flex items-center justify-between gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-blue-900"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-blue-900 flex-1">
              {selectedTab === 'overview' && 'Dashboard Overview'}
              {selectedTab === 'campaigns' && 'My Campaigns'}
            </h2>
            
            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-orange-50 rounded-lg transition-colors">
                <BellIcon className="w-6 h-6 text-blue-900" />
                {rejectedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {rejectedCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 lg:p-8">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Message */}
              <div className="bg-white rounded-xl border-4 border-blue-900 p-6 shadow-lg">
                <h1 className="text-3xl font-bold text-blue-900 mb-2">
                  Welcome back, {studentName}! 👋
                </h1>
                <p className="text-blue-900 opacity-70">
                  Manage your fundraising campaigns and track your progress
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border-4 border-blue-900 p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                      <TrendingUpIcon className="w-6 h-6 text-blue-900" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-blue-900">₹{(totalRaised / 1000).toFixed(0)}k</p>
                  <p className="text-blue-900 opacity-70 font-bold">Total Raised</p>
                  <p className="text-sm text-green-600 font-bold mt-2">Across all campaigns</p>
                </div>

                <div className="bg-white rounded-xl border-4 border-blue-900 p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                      <CheckCircleIcon className="w-6 h-6 text-blue-900" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-blue-900">{approvedCount}</p>
                  <p className="text-blue-900 opacity-70 font-bold">Active Campaigns</p>
                  <p className="text-sm text-green-600 font-bold mt-2">Currently running</p>
                </div>

                <div className="bg-white rounded-xl border-4 border-blue-900 p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                      <ClockIcon className="w-6 h-6 text-blue-900" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-blue-900">{pendingCount}</p>
                  <p className="text-blue-900 opacity-70 font-bold">Pending Review</p>
                  <p className="text-sm text-yellow-600 font-bold mt-2">Awaiting approval</p>
                </div>

                <div className="bg-white rounded-xl border-4 border-blue-900 p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center">
                      <FolderIcon className="w-6 h-6 text-blue-900" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-blue-900">{campaigns.length}</p>
                  <p className="text-blue-900 opacity-70 font-bold">Total Campaigns</p>
                  <p className="text-sm text-blue-600 font-bold mt-2">All time</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={onCreateCampaign}
                  className="bg-white rounded-xl border-4 border-blue-900 p-6 shadow-lg hover:scale-105 transition-transform text-left group"
                >
                  <div className="w-16 h-16 bg-green-400 rounded-lg flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                    <PlusIcon className="w-8 h-8 text-blue-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">Create New Campaign</h3>
                  <p className="text-blue-900 opacity-70">
                    Start a new fundraising campaign for your club
                  </p>
                </button>

                <button
                  onClick={() => setSelectedTab('campaigns')}
                  className="bg-white rounded-xl border-4 border-blue-900 p-6 shadow-lg hover:scale-105 transition-transform text-left group"
                >
                  <div className="w-16 h-16 bg-orange-400 rounded-lg flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                    <FolderIcon className="w-8 h-8 text-blue-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">View My Campaigns</h3>
                  <p className="text-blue-900 opacity-70">
                    Manage and track all your campaigns
                  </p>
                </button>
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl border-4 border-orange-400 p-6 shadow-lg text-white">
                <h3 className="text-2xl font-bold mb-3">💡 Pro Tip</h3>
                <p className="text-orange-200 text-lg">
                  Keep your campaign description clear and compelling. Include specific goals, timelines, and how the funds will be used. Add images to make your campaign more engaging and trustworthy!
                </p>
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {selectedTab === 'campaigns' && (
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="bg-white rounded-xl border-4 border-blue-900 p-4 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-900 opacity-50" />
                    <input
                      type="text"
                      placeholder="Search campaigns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border-2 border-blue-900 rounded-lg text-blue-900 focus:outline-none focus:border-orange-400"
                    />
                  </div>
                  <div className="flex gap-2">
                    {['ALL', 'approved', 'pending', 'rejected'].map(status => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg font-bold border-2 border-blue-900 transition-all ${
                          filterStatus === status
                            ? 'bg-blue-900 text-white'
                            : 'bg-white text-blue-900 hover:bg-orange-50'
                        }`}
                      >
                        {status === 'ALL' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Campaigns List */}
              {campaigns.length === 0 ? (
                <div className="bg-white rounded-xl border-4 border-blue-900 p-12 text-center shadow-lg">
                  <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PlusIcon className="w-8 h-8 text-blue-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">No campaigns yet</h3>
                  <p className="text-blue-900 opacity-70 mb-4">
                    Create your first campaign to start raising funds
                  </p>
                  <button
                    onClick={onCreateCampaign}
                    className="px-6 py-3 bg-orange-400 text-blue-900 rounded-lg font-bold border-2 border-blue-900 hover:scale-105 transition-transform"
                  >
                    Create Campaign
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-blue-900 font-bold mb-2">
                    Showing {filteredCampaigns.length} of {campaigns.length} campaigns
                  </div>
                  
                  <div className="space-y-4">
                    {filteredCampaigns.map((campaign) => {
                      const progress = (campaign.currentAmount / campaign.goalAmount) * 100;
                      return (
                        <div
                          key={campaign.id}
                          className="bg-white rounded-xl border-4 border-blue-900 p-6 shadow-lg"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-blue-900">{campaign.title}</h3>
                                {getStatusBadge(campaign.status)}
                              </div>
                              <p className="text-blue-900 opacity-70">{campaign.clubName}</p>
                            </div>
                          </div>

                          {campaign.status === 'approved' && (
                            <div className="mb-4">
                              <div className="flex justify-between text-sm font-bold text-blue-900 mb-2">
                                <span>₹{campaign.currentAmount.toLocaleString()} raised</span>
                                <span>₹{campaign.goalAmount.toLocaleString()} goal</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-blue-900">
                                <div
                                  className="bg-green-400 h-full rounded-full transition-all"
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                ></div>
                              </div>
                              <p className="text-sm text-blue-900 opacity-70 mt-1">
                                {progress.toFixed(0)}% funded
                              </p>
                            </div>
                          )}

                          {campaign.status === 'rejected' && campaign.rejectionReason && (
                            <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                              <p className="text-sm font-bold text-red-800 mb-1">Rejection Reason:</p>
                              <p className="text-red-700 text-sm">{campaign.rejectionReason}</p>
                            </div>
                          )}

                          <button
                            onClick={() => onViewCampaign(campaign.id)}
                            className="px-6 py-2 bg-orange-400 text-blue-900 rounded-lg font-bold border-2 border-blue-900 hover:scale-105 transition-transform"
                          >
                            View Details →
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminProjectDetails from '../components/AdminProjectDetails';
import {
  getDashboardStats,
  getAllProjects,
  verifyUserProject,
  verifyDonorProject
} from '../services/adminService';
import { mapUserProjectToCampaign, mapDonorProjectToProject } from '../services/mappers';
import type { Campaign, Project, DashboardStats } from '../types';
import { StarDecoration } from './icons/StarDecoration';

// --- Icons ---
const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
);
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></svg>
);
const XCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
);
const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);
const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
);
const AlertIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);
const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
);

// --- Modals ---
const RejectionModal = ({ campaignTitle, onClose, onSubmit }: { campaignTitle: string; onClose: () => void; onSubmit: (reason: string) => void; }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-[10000] flex justify-center items-center p-4" style={{ backgroundColor: 'rgba(0, 0, 128, 0.8)' }} onClick={onClose}>
      <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card max-w-md w-full p-6 sm:p-8 relative" onClick={(e) => e.stopPropagation()}>
        <div className="card-tricolor-tag"></div>
        <div className="flex justify-between items-center mb-6 mt-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-dreamxec-navy font-display">Reject Campaign</h2>
          <button onClick={onClose} className="text-dreamxec-navy hover:scale-110 transition-transform flex-shrink-0"><XCircleIcon className="w-6 h-6" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (reason.trim()) onSubmit(reason); }}>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for rejection..." className="w-full h-32 p-4 border-4 border-dreamxec-navy rounded-lg text-lg font-sans bg-white focus:outline-none focus:border-dreamxec-orange" required autoFocus />
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-pastel-secondary px-6 py-3 rounded-lg font-display text-lg">Cancel</button>
            <button type="submit" disabled={!reason.trim()} className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-bold border-4 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display text-lg"><SendIcon className="w-5 h-5" /> Submit Rejection</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- KPI Stat Card ---
const KPIStatCard = ({ label, value, icon, color }: any) => (
  <div className="card-pastel bg-white rounded-xl p-5 flex items-center gap-4 hover:scale-105 transition-transform border-3 border-dreamxec-navy shadow-sm">
    <div className={`p-3 rounded-full border-2 border-dreamxec-navy ${color === 'blue' ? 'bg-blue-50 text-blue-700' : color === 'purple' ? 'bg-purple-50 text-purple-700' : color === 'orange' ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-dreamxec-navy font-display">{value}</p>
    </div>
  </div>
);

// --- Main Component ---
export default function AdminDashboard() {
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userProjects, setUserProjects] = useState<Campaign[]>([]);
  const [donorProjects, setDonorProjects] = useState<Project[]>([]);

  // Modals
  const [selectedProject, setSelectedProject] = useState<{ id: string, type: 'user' | 'donor' } | null>(null);
  const [rejectionInfo, setRejectionInfo] = useState<{ id: string; title: string; type: 'user' | 'donor' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [statsRes, projectsRes] = await Promise.all([
        getDashboardStats(),
        getAllProjects({ limit: 100 })
      ]);
      setStats(statsRes.data);
      setUserProjects(projectsRes.data.userProjects.data.map((p: any) => mapUserProjectToCampaign(p)));
      setDonorProjects(projectsRes.data.donorProjects.data.map((p: any) => mapDonorProjectToProject(p)));
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (id: string, type: 'user' | 'donor') => {
    if (!window.confirm("Approve this project?")) return;
    try {
      if (type === 'user') await verifyUserProject(id, { status: 'APPROVED' });
      else await verifyDonorProject(id, { status: 'APPROVED' });
      fetchData();
    } catch (e) { alert("Action failed"); }
  };

  const handleRejectSubmit = async (reason: string) => {
    if (!rejectionInfo) return;
    try {
      if (rejectionInfo.type === 'user') await verifyUserProject(rejectionInfo.id, { status: 'REJECTED', reason });
      else await verifyDonorProject(rejectionInfo.id, { status: 'REJECTED', reason });
      setRejectionInfo(null);
      fetchData();
    } catch (e) { alert("Action failed"); }
  };

  if (loading || !stats) return <div className="flex h-screen items-center justify-center bg-transparent"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-dreamxec-navy"></div></div>;

  // Derived Data
  const pendingCampaigns = userProjects.filter(p => p.status === 'pending');
  const pendingDonorProjects = donorProjects.filter(p => p.status === 'pending');
  const approvedCount = stats.kpi.campaigns.APPROVED;
  const totalSubmissions = stats.kpi.campaigns.total;

  return (
    <div className="flex min-h-screen bg-transparent relative">

      {/* 1. Collapsible Sidebar */}
      <AdminSidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 relative min-h-screen">

        {/* Modals */}
        {selectedProject && (
          <AdminProjectDetails
            projectId={selectedProject.id}
            projectType={selectedProject.type}
            onClose={() => {
              setSelectedProject(null);
              fetchData();
            }}
          />
        )}
        {rejectionInfo && <RejectionModal campaignTitle={rejectionInfo.title} onClose={() => setRejectionInfo(null)} onSubmit={handleRejectSubmit} />}

        {/* Decorative Stars */}
        <div className="absolute top-20 left-10 z-0 opacity-20 pointer-events-none"><StarDecoration className="w-16 h-16" color="#FF7F00" /></div>
        <div className="absolute top-40 right-20 z-0 opacity-20 pointer-events-none"><StarDecoration className="w-12 h-12" color="#0B9C2C" /></div>
        <div className="absolute bottom-32 left-1/4 z-0 opacity-15 pointer-events-none"><StarDecoration className="w-20 h-20" color="#000080" /></div>

        {/* Header Section - CHANGED: Removed max-w-7xl mx-auto, Replaced with w-full px-6 lg:px-10 */}
        <div className="relative bg-dreamxec-navy border-b-8 border-dreamxec-orange shadow-pastel-saffron z-10">
          <div className="card-tricolor-tag"></div>
          <div className="w-full px-6 lg:px-10 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-dreamxec-orange font-display flex items-center gap-3">
                  Admin Dashboard <StarDecoration className="w-8 h-8 hidden sm:block" color="#FF7F00" />
                </h1>
                <p className="text-dreamxec-cream text-xl font-sans mt-2">
                  Overview & Command Center
                </p>
              </div>
              <button onClick={fetchData} className="bg-white/10 text-white px-4 py-2 rounded-lg border-2 border-white/20 hover:bg-white/20 transition-all font-bold">
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content - CHANGED: Removed max-w-7xl mx-auto, Replaced with w-full px-6 lg:px-10 */}
        <div className="w-full px-6 lg:px-10 py-8 relative z-10 pb-24">

          {/* 1. Global KPIs Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPIStatCard label="Total Users" value={stats.kpi.totalUsers} icon={<UsersIcon className="w-6 h-6" />} color="blue" />
            <KPIStatCard label="Total Donors" value={stats.kpi.totalDonors} icon={<UsersIcon className="w-6 h-6" />} color="purple" />
            <KPIStatCard label="Active Clubs" value={stats.kpi.totalClubs} icon={<StarDecoration className="w-6 h-6" />} color="orange" />
            <KPIStatCard label="Total Raised" value={`₹${stats.kpi.totalDonations.toLocaleString()}`} icon={<TrendingUpIcon className="w-6 h-6" />} color="green" />
          </div>

          {/* 2. System Alerts (Attention Panel) */}
          {(stats.attention.slaBreaches > 0 || stats.attention.frozenCampaigns > 0) && (
            <div className="mb-8 bg-white border-4 border-red-500 rounded-xl p-6 shadow-pastel-card relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
              <h3 className="text-2xl font-bold text-dreamxec-navy font-display mb-4 flex items-center gap-2">
                <AlertIcon className="w-8 h-8 text-red-600" /> System Alerts
              </h3>
              <div className="flex flex-col sm:flex-row gap-6">
                {stats.attention.slaBreaches > 0 && (
                  <div className="bg-red-50 px-6 py-4 rounded-lg border-2 border-red-200 flex-1">
                    <p className="text-red-800 font-bold text-lg">{stats.attention.slaBreaches} SLA Breaches</p>
                    <p className="text-sm text-red-600">Pending &gt; 7 days</p>
                  </div>
                )}
                {stats.attention.frozenCampaigns > 0 && (
                  <div className="bg-orange-50 px-6 py-4 rounded-lg border-2 border-orange-200 flex-1">
                    <p className="text-dreamxec-navy font-bold text-lg">{stats.attention.frozenCampaigns} Frozen Campaigns</p>
                    <p className="text-sm text-gray-600">Inactive &gt; 30 days</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Original Workflow Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            <div className="card-pastel rounded-xl p-6 card-pastel-tilt-left hover:scale-105 transition-transform bg-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-lg font-bold font-display">Pending Campaigns</p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-saffron">
                  <ClockIcon className="w-8 h-8 text-dreamxec-orange" />
                </div>
              </div>
              <p className="text-5xl font-bold text-dreamxec-navy font-display">{stats.kpi.campaigns.PENDING}</p>
              <div className="mt-2 h-1 bg-dreamxec-orange rounded"></div>
            </div>

            <div className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform bg-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-lg font-bold font-display">Pending Projects</p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-saffron">
                  <ClockIcon className="w-8 h-8 text-dreamxec-orange" />
                </div>
              </div>
              <p className="text-5xl font-bold text-dreamxec-navy font-display">{pendingDonorProjects.length}</p>
              <div className="mt-2 h-1 bg-dreamxec-orange rounded"></div>
            </div>

            <div className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform bg-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-lg font-bold font-display">Total Approved</p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-green">
                  <CheckCircleIcon className="w-8 h-8 text-dreamxec-green" />
                </div>
              </div>
              <p className="text-5xl font-bold text-dreamxec-navy font-display">{approvedCount}</p>
              <div className="mt-2 h-1 bg-dreamxec-green rounded"></div>
            </div>

            <div className="card-pastel rounded-xl p-6 card-pastel-tilt-right hover:scale-105 transition-transform bg-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-lg font-bold font-display">Total Submissions</p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-navy">
                  <EyeIcon className="w-8 h-8 text-dreamxec-navy" />
                </div>
              </div>
              <p className="text-5xl font-bold text-dreamxec-navy font-display">{totalSubmissions}</p>
              <div className="mt-2 h-1 bg-gradient-to-r from-dreamxec-orange via-white to-dreamxec-green rounded"></div>
            </div>

            {/* Pending Milestones */}
            <div onClick={() => navigate('/admin/milestones')} className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform bg-white cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-lg font-bold font-display group-hover:text-dreamxec-orange transition-colors">Milestones</p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-saffron">
                  <svg className="w-8 h-8 text-dreamxec-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
                </div>
              </div>
              <p className="text-5xl font-bold text-dreamxec-navy font-display">{stats.kpi.milestones?.total || 0}</p>
              <p className="text-xs text-gray-500 mt-1 font-bold">{stats.kpi.milestones?.SUBMITTED || 0} awaiting review</p>
              <div className="mt-2 h-1 bg-dreamxec-orange rounded"></div>
            </div>
          </div>

          {/* 4. Quick Links Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div onClick={() => navigate("/admin/verifications")} className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer group bg-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-lg font-bold font-display group-hover:text-dreamxec-orange transition-colors">Club Verifications</p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-12 h-12 flex items-center justify-center shadow-pastel-saffron group-hover:shadow-pastel-orange">
                  <CheckCircleIcon className="w-6 h-6 text-dreamxec-navy group-hover:text-dreamxec-orange" />
                </div>
              </div>
              <p className="text-xl font-bold text-dreamxec-navy opacity-70 font-sans mt-2">Manage Requests →</p>
            </div>

            <div onClick={() => navigate("/admin/referrals")} className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer group bg-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-lg font-bold font-display group-hover:text-dreamxec-green transition-colors">Club Referrals</p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-12 h-12 flex items-center justify-center shadow-pastel-green group-hover:shadow-pastel-green">
                  <SendIcon className="w-6 h-6 text-dreamxec-navy group-hover:text-dreamxec-green" />
                </div>
              </div>
              <p className="text-xl font-bold text-dreamxec-navy opacity-70 font-sans mt-2">View Referrals →</p>
            </div>
          </div>

          {/* 5. Pending Campaigns Table */}
          <div className="card-pastel-offwhite rounded-xl p-6 sm:p-8 border-5 border-dreamxec-navy shadow-pastel-card mb-8 bg-[#FAFAF8]">
            <div className="card-tricolor-tag"></div>
            <div className="flex items-center gap-3 mb-8 mt-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy font-display">Pending Campaigns</h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-dreamxec-orange text-white rounded-lg border-3 border-dreamxec-navy">
                <ClockIcon className="w-5 h-5" />
                <span className="font-bold font-display text-lg">{pendingCampaigns.length} Awaiting</span>
              </div>
            </div>

            {pendingCampaigns.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-dreamxec-cream border-5 border-dreamxec-navy w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-pastel-green"><CheckCircleIcon className="w-12 h-12 text-dreamxec-green" /></div>
                <h3 className="text-3xl font-bold text-dreamxec-navy mb-3 font-display">All caught up!</h3>
                <p className="text-dreamxec-navy text-xl font-sans">No pending campaigns to review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-4 border-dreamxec-navy">
                      <th className="text-left py-4 px-4 text-lg font-bold text-dreamxec-navy font-display">Details</th>
                      <th className="text-left py-4 px-4 text-lg font-bold text-dreamxec-navy font-display hidden md:table-cell">Goal</th>
                      <th className="text-left py-4 px-4 text-lg font-bold text-dreamxec-navy font-display hidden lg:table-cell">Date</th>
                      <th className="text-right py-4 px-4 text-lg font-bold text-dreamxec-navy font-display">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingCampaigns.map((c) => (
                      <tr key={c.id} className="border-b-3 border-dreamxec-gray-200 hover:bg-dreamxec-cream transition-colors">
                        <td className="py-4 px-4">
                          <p className="font-bold text-dreamxec-navy text-xl font-display">{c.title}</p>
                          <p className="text-dreamxec-navy opacity-80 font-sans">{c.club?.name || 'Individual'}</p>
                        </td>
                        <td className="py-4 px-4 text-dreamxec-navy font-bold text-xl font-display hidden md:table-cell">₹{c.goalAmount.toLocaleString()}</td>
                        <td className="py-4 px-4 text-dreamxec-navy hidden lg:table-cell">{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-4 flex justify-end gap-2">
                          <button onClick={() => setSelectedProject({ id: c.id, type: 'user' })} className="p-2 bg-dreamxec-gray-100 rounded-lg border-3 border-dreamxec-navy hover:scale-110 transition-transform" title="View Details"><EyeIcon className="w-5 h-5" /></button>
                          <button onClick={() => handleApprove(c.id, 'user')} className="px-3 py-2 bg-dreamxec-green text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-green hover:scale-105 transition-transform font-display"><CheckCircleIcon className="w-5 h-5" /></button>
                          <button onClick={() => setRejectionInfo({ id: c.id, title: c.title, type: 'user' })} className="px-3 py-2 bg-red-600 text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display"><XCircleIcon className="w-5 h-5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 6. Pending Donor Projects Section */}
          {pendingDonorProjects.length > 0 && (
            <div className="card-pastel-offwhite rounded-xl p-6 sm:p-8 border-5 border-dreamxec-navy shadow-pastel-card mb-8 bg-[#FAFAF8]">
              <div className="card-tricolor-tag"></div>
              <div className="flex items-center gap-4 mb-8 mt-4">
                <h2 className="text-4xl font-bold text-dreamxec-navy font-display">Pending Donor Projects</h2>
                <div className="flex items-center gap-2 bg-dreamxec-orange px-4 py-2 rounded-full border-3 border-dreamxec-navy text-white font-bold text-lg">{pendingDonorProjects.length}</div>
              </div>
              <div className="space-y-6">
                {pendingDonorProjects.map((p) => (
                  <div key={p.id} className="bg-white p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-green flex flex-col lg:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-3xl font-bold text-dreamxec-navy font-display">{p.title}</h3>
                      <p className="text-lg text-dreamxec-navy opacity-80 font-sans">By {p.donor?.organizationName || 'Donor'}</p>
                      <p className="mt-2 text-dreamxec-navy font-sans line-clamp-2">{p.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[150px]">
                      <button onClick={() => setSelectedProject({ id: p.id, type: 'donor' })} className="px-4 py-2 bg-dreamxec-gray-100 text-dreamxec-navy rounded-lg font-bold border-3 border-dreamxec-navy hover:scale-105 transition-transform font-display flex items-center justify-center gap-2"><EyeIcon className="w-5 h-5" /> View Details</button>
                      <button onClick={() => handleApprove(p.id, 'donor')} className="px-4 py-2 bg-dreamxec-green text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-green hover:scale-105 transition-transform font-display flex items-center justify-center gap-2"><CheckCircleIcon className="w-5 h-5" /> Approve</button>
                      <button onClick={() => setRejectionInfo({ id: p.id, title: p.title, type: 'donor' })} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display flex items-center justify-center gap-2"><XCircleIcon className="w-5 h-5" /> Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminProjectDetails from './AdminProjectDetails';
import Pagination from './Pagination';
import { getAllProjects, verifyUserProject } from '../../services/adminService';
import { StarDecoration } from '../icons/StarDecoration';

export default function AdminCampaigns() {
    const [searchParams] = useSearchParams();
    const initialStatus = searchParams.get('status') || 'ALL';

    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(initialStatus);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
    const [selectedProject, setSelectedProject] = useState<{ id: string, type: 'user' } | null>(null);

    // Sorting State
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });

    useEffect(() => { fetchCampaigns(); }, [activeTab, page]);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const res = await getAllProjects({
                page,
                limit: 20,
                // Cast the activeTab to bypass the strict type check
                status: activeTab === 'ALL' ? undefined : (activeTab as any)
            });
            setCampaigns(res.data.userProjects.data);
            setPagination(res.data.userProjects.pagination);
        } catch (error) {
            console.error("Fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    // Local Sorting for the fetched page
    const sortedCampaigns = useMemo(() => {
        let sortable = [...campaigns];
        sortable.sort((a, b) => {
            if (sortConfig.key === 'amountRaised') {
                return sortConfig.direction === 'asc' ? a.amountRaised - b.amountRaised : b.amountRaised - a.amountRaised;
            }
            if (sortConfig.key === 'studentName') {
                const nameA = a.user?.name || '';
                const nameB = b.user?.name || '';
                return sortConfig.direction === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            }
            if (sortConfig.key === 'status') {
                return sortConfig.direction === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
            }
            // Default: createdAt
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        });
        return sortable;
    }, [campaigns, sortConfig]);

    const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        const reason = status === 'REJECTED' ? prompt("Reason for rejection:") : undefined;
        if (status === 'REJECTED' && !reason) return;
        if (!window.confirm(`Are you sure you want to ${status} this campaign?`)) return;

        try {
            await verifyUserProject(id, { status, reason });
            fetchCampaigns();
        } catch (e) { alert("Failed to update status"); }
    };

    return (
        <div className="flex min-h-screen bg-transparent relative">
            <AdminSidebar />

            {selectedProject && (
                <AdminProjectDetails projectId={selectedProject.id} projectType={selectedProject.type} onClose={() => { setSelectedProject(null); fetchCampaigns(); }} />
            )}

            <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">
                <div className="relative z-10 w-full">

                    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
                                Campaign Management <StarDecoration className="w-8 h-8" color="#FF7F00" />
                            </h1>
                        </div>

                        {/* TABS */}
                        <div className="flex gap-2 bg-white p-1.5 rounded-xl border-2 border-dreamxec-navy/20 shadow-sm">
                            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(tab => (
                                <button
                                    key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
                                    className={`px-5 py-2.5 rounded-lg font-bold text-xs transition-all shadow-sm ${activeTab === tab ? 'bg-dreamxec-navy text-white scale-105' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden flex flex-col">
                        {loading ? (
                            <div className="p-12 text-center text-gray-500 font-bold font-display text-xl animate-pulse">Loading campaigns...</div>
                        ) : (
                            <>
                                <div className="overflow-y-auto max-h-[650px] relative">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20 sticky top-0 z-20 shadow-sm">
                                            <tr>
                                                <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-dreamxec-navy/5" onClick={() => handleSort('createdAt')}>
                                                    Date {sortConfig.key === 'createdAt' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                                                </th>
                                                <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Campaign</th>
                                                <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-dreamxec-navy/5" onClick={() => handleSort('studentName')}>
                                                    Student {sortConfig.key === 'studentName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                                                </th>
                                                <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-dreamxec-navy/5" onClick={() => handleSort('amountRaised')}>
                                                    Amount {sortConfig.key === 'amountRaised' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                                                </th>
                                                <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy cursor-pointer hover:bg-dreamxec-navy/5" onClick={() => handleSort('status')}>
                                                    Status {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                                                </th>
                                                <th className="p-5 text-right font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {sortedCampaigns.map((c: any) => (
                                                <tr key={c.id} className="hover:bg-dreamxec-cream/50 transition-colors">
                                                    <td className="p-5 text-sm text-gray-500 font-mono">{new Date(c.createdAt).toLocaleDateString()}</td>
                                                    <td className="p-5 font-bold text-dreamxec-navy">{c.title}</td>
                                                    <td className="p-5 text-sm text-gray-700">{c.user?.name}</td>
                                                    <td className="p-5 font-mono font-bold text-green-700">₹{c.amountRaised.toLocaleString()}</td>
                                                    <td className="p-5">
                                                        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-lg border-2 ${c.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' : c.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                                            {c.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-5 text-right flex justify-end gap-2">
                                                        <button onClick={() => setSelectedProject({ id: c.id, type: 'user' })} className="px-3 py-1.5 bg-gray-100 rounded border hover:bg-gray-200 text-xs font-bold">View</button>
                                                        {c.status === 'PENDING' && (
                                                            <>
                                                                <button onClick={() => handleAction(c.id, 'APPROVED')} className="px-3 py-1.5 bg-green-100 text-green-700 rounded border border-green-300 hover:bg-green-200 text-xs font-bold">Approve</button>
                                                                <button onClick={() => handleAction(c.id, 'REJECTED')} className="px-3 py-1.5 bg-red-100 text-red-700 rounded border border-red-300 hover:bg-red-200 text-xs font-bold">Reject</button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination page={page} totalPages={pagination.totalPages} setPage={setPage} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
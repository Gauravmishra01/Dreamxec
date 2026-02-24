import React, { useEffect, useState } from 'react';
import { getProjectFullDetails } from '../../services/adminService';
import AdminNotesPanel from './AdminNotesPanel';
import { StarDecoration } from '../icons';

interface Props {
  projectId: string;
  projectType: 'user' | 'donor';
  onClose: () => void;
}

export default function AdminProjectDetails({ projectId, projectType, onClose }: Props) {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [projectId]);

  const fetchDetails = async () => {
    try {
      const res = await getProjectFullDetails(projectType, projectId);
      setProject(res.data.project);
    } catch (error) {
      console.error("Failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (!projectId) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center p-4 bg-dreamxec-navy/90 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-dreamxec-cream w-full max-w-6xl rounded-2xl border-4 border-dreamxec-orange overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-dreamxec-navy p-6 flex justify-between items-start text-white">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold font-display">{project?.title || 'Loading...'}</h2>
              {project && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border-2 ${
                  project.status === 'APPROVED' ? 'bg-green-500/20 text-green-300 border-green-500' :
                  project.status === 'PENDING' ? 'bg-orange-500/20 text-orange-300 border-orange-500' :
                  project.status === 'PAUSED' ? 'bg-gray-500/20 text-gray-300 border-gray-500' :
                  'bg-red-500/20 text-red-300 border-red-500'
                }`}>
                  {project.status}
                </span>
              )}
            </div>
            <p className="text-dreamxec-cream/70 text-sm font-mono mt-1">ID: {projectId} | Type: {projectType.toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-dreamxec-orange font-bold text-2xl transition-colors">✕</button>
        </div>

        {loading || !project ? (
          <div className="p-12 text-center text-dreamxec-navy font-bold font-display text-xl animate-pulse">Loading Deep Analysis...</div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 bg-transparent">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* --- LEFT / MAIN COL: Details & Financials --- */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Overview Card */}
                <div className="bg-white p-5 rounded-xl border-2 border-dreamxec-navy/20 shadow-sm flex gap-6">
                  {project.imageUrl && (
                    <img src={project.imageUrl} alt="Cover" className="w-32 h-32 object-cover rounded-lg border-2 border-dreamxec-navy" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-dreamxec-navy mb-2 flex items-center gap-2">
                      <StarDecoration className="w-4 h-4" color="#0B9C2C" /> Description
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">{project.description}</p>
                    <div className="mt-4 flex gap-4 text-sm">
                      <div><span className="font-bold text-gray-500">Owner:</span> {project.user?.name || project.donor?.name}</div>
                      <div><span className="font-bold text-gray-500">Email:</span> {project.user?.email || project.donor?.email}</div>
                    </div>
                  </div>
                </div>

                {/* Financials / Goal Progress (User Projects Only) */}
                {projectType === 'user' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border-2 border-dreamxec-navy/10 text-center">
                      <p className="text-xs text-gray-500 font-bold uppercase mb-1">Goal Amount</p>
                      <p className="text-xl font-bold text-dreamxec-navy font-mono">₹{project.goalAmount?.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200 text-center">
                      <p className="text-xs text-green-700 font-bold uppercase mb-1">Raised</p>
                      <p className="text-xl font-bold text-green-700 font-mono">₹{project.amountRaised?.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border-2 border-dreamxec-navy/10 text-center">
                      <p className="text-xs text-gray-500 font-bold uppercase mb-1">Donors</p>
                      <p className="text-xl font-bold text-dreamxec-navy font-mono">{project.donations?.length || 0}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200 text-center">
                      <p className="text-xs text-purple-700 font-bold uppercase mb-1">Withdrawals</p>
                      <p className="text-xl font-bold text-purple-700 font-mono">{project.withdrawals?.length || 0}</p>
                    </div>
                  </div>
                )}

                {/* Milestones (User Projects Only) */}
                {projectType === 'user' && project.milestones?.length > 0 && (
                  <div className="bg-white p-5 rounded-xl border-2 border-dreamxec-navy/20 shadow-sm">
                    <h3 className="font-bold text-dreamxec-navy mb-4 font-display">Milestone Roadmap</h3>
                    <div className="space-y-3">
                      {project.milestones.map((m: any, i: number) => (
                        <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div>
                            <span className="font-bold text-sm text-dreamxec-navy mr-2">{i + 1}. {m.title}</span>
                            <span className="text-xs text-gray-500 font-mono">Budget: ₹{m.budget.toLocaleString()}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded font-bold ${
                            m.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                            m.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Applications (Donor Projects Only) */}
                {projectType === 'donor' && (
                  <div className="bg-white p-5 rounded-xl border-2 border-dreamxec-navy/20 shadow-sm">
                    <h3 className="font-bold text-dreamxec-navy mb-4 font-display">Student Applications ({project.applications?.length})</h3>
                    <div className="space-y-3">
                      {project.applications?.map((app: any) => (
                        <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div>
                            <span className="font-bold text-sm text-dreamxec-navy block">{app.user?.name}</span>
                            <span className="text-xs text-gray-500">{app.user?.email}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded font-bold ${
                            app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                            app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* --- RIGHT COL: Admin Controls & Notes --- */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                
                {/* Bank Verification Box */}
                {projectType === 'user' && (
                  <div className="bg-white p-4 rounded-xl border-2 border-dreamxec-navy/20 shadow-sm">
                     <h3 className="font-bold text-dreamxec-navy text-sm mb-3">Bank Account Status</h3>
                     {project.bankAccount ? (
                       <div className="text-sm">
                         <p><span className="text-gray-500">Bank:</span> {project.bankAccount.bankName}</p>
                         <p><span className="text-gray-500">Holder:</span> {project.bankAccount.accountHolderName}</p>
                         <p className="mt-2">
                           <span className={`px-2 py-1 text-xs font-bold rounded ${project.bankAccount.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                             {project.bankAccount.status}
                           </span>
                         </p>
                       </div>
                     ) : (
                       <p className="text-sm text-red-500 font-bold">No bank account linked</p>
                     )}
                  </div>
                )}

                {/* Admin Notes Panel */}
                <div className="flex-1 min-h-[300px]">
                  <AdminNotesPanel 
                    entityType={projectType === 'user' ? 'project' : 'donor_project'} 
                    entityId={project.id} 
                  />
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
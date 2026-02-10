// import React, { useState } from 'react';
// import type { Campaign, Project } from '../types';
// import { StarDecoration } from './icons/StarDecoration';

// // Simple SVG Icons
// const ClockIcon = ({ className }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="12" cy="12" r="10" />
//     <path d="M12 6v6l4 2" />
//   </svg>
// );

// const CheckCircleIcon = ({ className }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="12" cy="12" r="10" />
//     <path d="M9 12l2 2 4-4" />
//   </svg>
// );

// const XCircleIcon = ({ className }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="12" cy="12" r="10" />
//     <path d="M15 9l-6 6M9 9l6 6" />
//   </svg>
// );

// const EyeIcon = ({ className }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//     <circle cx="12" cy="12" r="3" />
//   </svg>
// );

// const SendIcon = ({ className }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
//   </svg>
// );

// interface AdminDashboardProps {
//   pendingCampaigns: Campaign[];
//   allCampaigns?: Campaign[];
//   pendingProjects?: Project[];
//   allProjects?: Project[];
//   onApprove: (id: string) => void;
//   onReject: (id: string, reason: string) => void;
//   onApproveProject?: (id: string) => void;
//   onRejectProject?: (id: string, reason: string) => void;
// }

// // Modal for viewing campaign details
// const CampaignDetailModal = ({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) => {
//   const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex justify-center items-center p-4"
//       style={{ backgroundColor: 'rgba(0, 0, 128, 0.8)' }}
//       onClick={handleBackdropClick}
//     >
//       <div
//         className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="card-tricolor-tag"></div>
//         <div className="p-6 sm:p-8 mt-4">
//           <div className="flex justify-between items-start mb-6">
//             <div className="flex-1">
//               <h2 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy mb-2 font-display">
//                 {campaign.title}
//               </h2>
//               <p className="text-lg sm:text-xl text-dreamxec-navy opacity-80 font-sans">
//                 By {campaign.clubName}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="btn-pastel-secondary p-3 rounded-lg hover:scale-110 transition-transform flex-shrink-0 ml-4"
//             >
//               <XCircleIcon className="w-6 h-6" />
//             </button>
//           </div>

//           <img
//             src={campaign.imageUrl}
//             alt={campaign.title}
//             className="w-full h-72 object-cover rounded-lg border-4 border-dreamxec-navy shadow-pastel-saffron mb-6"
//           />

//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-dreamxec-cream rounded-lg border-3 border-dreamxec-orange">
//             <span className="text-2xl sm:text-3xl font-bold text-dreamxec-navy font-display">
//               Goal: ₹{campaign.goalAmount.toLocaleString()}
//             </span>
//             <span className="text-base sm:text-lg text-dreamxec-navy opacity-80 font-sans">
//               Submitted: {campaign.createdAt instanceof Date ? campaign.createdAt.toLocaleDateString() : new Date(campaign.createdAt).toLocaleDateString()}
//             </span>
//           </div>

//           <div className="space-y-3">
//             <h3 className="text-2xl font-bold text-dreamxec-navy font-display flex items-center gap-2">
//               Description
//               <StarDecoration className="w-6 h-6" color="#FF7F00" />
//             </h3>
//             <div className="p-4 bg-white rounded-lg border-3 border-dreamxec-green">
//               <p className="text-dreamxec-navy text-lg whitespace-pre-wrap font-sans leading-relaxed">
//                 {campaign.description}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Modal for entering rejection reason
// const RejectionModal = ({
//   campaignTitle,
//   onClose,
//   onSubmit,
// }: {
//   campaignTitle: string;
//   onClose: () => void;
//   onSubmit: (reason: string) => void;
// }) => {
//   const [reason, setReason] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (reason.trim()) {
//       console.log('Submitting rejection with reason:', reason);
//       onSubmit(reason); // onSubmit will now handle closing the modal
//     }
//   };

//   const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     // Prevent closing modal by clicking backdrop during submission
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[10000] flex justify-center items-center p-4"
//       style={{ backgroundColor: 'rgba(0, 0, 128, 0.8)' }}
//       onClick={handleBackdropClick}
//     >
//       <div
//         className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card max-w-md w-full p-6 sm:p-8 relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="card-tricolor-tag"></div>

//         <div className="flex justify-between items-center mb-6 mt-4">
//           <h2 className="text-2xl sm:text-3xl font-bold text-dreamxec-navy font-display">
//             Reject Campaign
//           </h2>
//           <button
//             type="button"
//             onClick={onClose}
//             className="text-dreamxec-navy hover:scale-110 transition-transform flex-shrink-0"
//           >
//             <XCircleIcon className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="mb-6 p-4 bg-dreamxec-cream rounded-lg border-3 border-dreamxec-orange">
//           <p className="text-dreamxec-navy text-lg font-sans">
//             Please provide a reason for rejecting:{' '}
//             <span className="font-bold font-display">{campaignTitle}</span>
//           </p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <textarea
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//             placeholder="e.g., Incomplete description, inappropriate content..."
//             className="w-full h-32 p-4 border-4 border-dreamxec-navy rounded-lg text-lg font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-orange focus:ring-2 focus:ring-dreamxec-orange transition-all resize-none"
//             required
//             autoFocus
//           />

//           <div className="mt-6 flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="btn-pastel-secondary px-6 py-3 rounded-lg font-display text-lg"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={!reason.trim()}
//               className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-bold border-4 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//             >
//               <SendIcon className="w-5 h-5" />
//               Submit Rejection
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default function AdminDashboard({
//   pendingCampaigns,
//   allCampaigns,
//   pendingProjects = [],
//   allProjects = [],
//   onApprove,
//   onReject,
//   onApproveProject,
//   onRejectProject,
// }: AdminDashboardProps) {
//   const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
//   const [rejectionInfo, setRejectionInfo] = useState<{ id: string; title: string } | null>(null);
//   const [rejectionProjectInfo, setRejectionProjectInfo] = useState<{ id: string; title: string } | null>(null);

//   const handleRejectClick = (id: string, title: string) => {
//     setRejectionInfo({ id, title });
//   };

//   const handleRejectSubmit = (reason: string) => {
//     if (rejectionInfo) {
//       const { id } = rejectionInfo;
//       // Close modal immediately
//       setRejectionInfo(null);
//       // Call onReject directly - alert has been removed from parent
//       onReject(id, reason);
//     }
//   };

//   const handleRejectProjectSubmit = (reason: string) => {
//     if (rejectionProjectInfo && onRejectProject) {
//       const { id } = rejectionProjectInfo;
//       // Close modal immediately
//       setRejectionProjectInfo(null);
//       // Call onRejectProject
//       onRejectProject(id, reason);
//     }
//   };

//   // Stats calculations
//   const approvedCount = allCampaigns?.filter((c) => c.status === 'approved').length || 0;
//   const totalCampaigns = allCampaigns?.length || 0;
//   const approvedProjectsCount = allProjects?.filter((p) => p.status === 'approved').length || 0;
//   const totalProjects = allProjects?.length || 0;

//   return (
//     <>
//       {selectedCampaign && (
//         <CampaignDetailModal campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} />
//       )}
//       {rejectionInfo && (
//         <RejectionModal
//           campaignTitle={rejectionInfo.title}
//           onClose={() => setRejectionInfo(null)}
//           onSubmit={handleRejectSubmit}
//         />
//       )}
//       {rejectionProjectInfo && (
//         <RejectionModal
//           campaignTitle={rejectionProjectInfo.title}
//           onClose={() => setRejectionProjectInfo(null)}
//           onSubmit={handleRejectProjectSubmit}
//         />
//       )}

//       <div className="min-h-screen relative overflow-hidden">
//         {/* Use existing Header component */}

//         {/* Decorative floating stars - original theme */}
//         <div className="absolute top-20 left-10 z-0 opacity-20">
//           <StarDecoration className="w-16 h-16" color="#FF7F00" />
//         </div>
//         <div className="absolute top-40 right-20 z-0 opacity-20">
//           <StarDecoration className="w-12 h-12" color="#0B9C2C" />
//         </div>
//         <div className="absolute bottom-32 left-1/4 z-0 opacity-15">
//           <StarDecoration className="w-20 h-20" color="#000080" />
//         </div>

//         {/* Enhanced decorative images - LEFT SIDE */}
//         {/* <div className="absolute top-32 left-5 z-0 opacity-5 animate-pulse">
//           <img src={imageIcon} alt="" className="w-40 h-40 md:w-52 md:h-52 object-contain drop-shadow-lg" />
//         </div>
//         <div className="absolute top-1/3 left-8 z-0 opacity-10 animate-bounce" style={{ animationDuration: '3s' }}>
//           <img src={image1Icon} alt="" className="w-44 h-44 md:w-56 md:h-56 object-contain drop-shadow-xl" />
//         </div>
//         <div className="absolute bottom-40 left-12 z-0 opacity-25 animate-pulse" style={{ animationDuration: '2s' }}>
//           <img src={imageCopyIcon} alt="" className="w-48 h-48 md:w-60 md:h-60 object-contain drop-shadow-2xl" />
//         </div> */}

//         {/* Enhanced decorative images - RIGHT SIDE */}
//         {/* <div className="absolute top-24 right-8 z-0 opacity-25 animate-bounce" style={{ animationDuration: '2.5s' }}>
//           <img src={image1Icon} alt="" className="w-44 h-44 md:w-56 md:h-56 object-contain drop-shadow-lg" />
//         </div>
//         <div className="absolute top-1/2 right-5 z-0 opacity-20 animate-pulse" style={{ animationDuration: '3s' }}>
//           <img src={imageCopyIcon} alt="" className="w-40 h-40 md:w-52 md:h-52 object-contain drop-shadow-xl" />
//         </div>
//         <div className="absolute bottom-48 right-10 z-0 opacity-25 animate-bounce" style={{ animationDuration: '3.5s' }}>
//           <img src={imageIcon} alt="" className="w-48 h-48 md:w-60 md:h-60 object-contain drop-shadow-2xl" />
//         </div> */}

//         {/* Header Section with Tricolor Accent */}
//         <div className="relative bg-dreamxec-navy border-b-8 border-dreamxec-orange shadow-pastel-saffron z-10">
//           <div className="card-tricolor-tag"></div>
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//             <div className="flex items-center gap-4 mb-2">
//               <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-dreamxec-orange font-display">
//                 Admin Dashboard
//               </h1>
//               <StarDecoration className="w-10 h-10 hidden sm:block" color="#FF7F00" />
//             </div>
//             <p className="text-dreamxec-cream text-xl sm:text-2xl font-sans">
//               Review and manage campaign and project submissions across the platform
//             </p>

//           </div>
//           <div className="ml-4 flex items-center gap-2">
//             <button
//               onClick={() => window.location.href = "/admin/referrals"}
//               className="px-4 py-2 bg-white border-2 border-dreamxec-navy rounded text-dreamxec-navy hover:bg-gray-50"
//             >
//               View Referrals
//             </button>

//             <button
//               onClick={() => window.location.href = "/admin/verifications"}
//               className="px-4 py-2 bg-white border-2 border-dreamxec-orange rounded text-dreamxec-orange hover:bg-orange-50"
//             >
//               View Verifications
//             </button>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
//           {/* Stats Cards - Oil Pastel Style */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {/* Pending Campaigns Card */}
//             <div className="card-pastel rounded-xl p-6 card-pastel-tilt-left hover:scale-105 transition-transform">
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-dreamxec-navy text-base sm:text-lg font-bold font-display">
//                   Pending Campaigns
//                 </p>
//                 <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-saffron">
//                   <ClockIcon className="w-8 h-8 text-dreamxec-orange" />
//                 </div>
//               </div>
//               <p className="text-5xl sm:text-6xl font-bold text-dreamxec-navy font-display">
//                 {pendingCampaigns.length}
//               </p>
//               <div className="mt-2 h-1 bg-dreamxec-orange rounded"></div>
//             </div>

//             {/* Pending Projects Card */}
//             <div className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform">
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-dreamxec-navy text-base sm:text-lg font-bold font-display">
//                   Pending Projects
//                 </p>
//                 <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-saffron">
//                   <ClockIcon className="w-8 h-8 text-dreamxec-orange" />
//                 </div>
//               </div>
//               <p className="text-5xl sm:text-6xl font-bold text-dreamxec-navy font-display">
//                 {pendingProjects.length}
//               </p>
//               <div className="mt-2 h-1 bg-dreamxec-orange rounded"></div>
//             </div>

//             {/* Approved Card */}
//             <div className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform">
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-dreamxec-navy text-base sm:text-lg font-bold font-display">
//                   Total Approved
//                 </p>
//                 <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-green">
//                   <CheckCircleIcon className="w-8 h-8 text-dreamxec-green" />
//                 </div>
//               </div>
//               <p className="text-5xl sm:text-6xl font-bold text-dreamxec-navy font-display">
//                 {approvedCount + approvedProjectsCount}
//               </p>
//               <div className="mt-2 h-1 bg-dreamxec-green rounded"></div>
//             </div>

//             {/* Total Items Card */}
//             <div className="card-pastel rounded-xl p-6 card-pastel-tilt-right hover:scale-105 transition-transform">
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-dreamxec-navy text-base sm:text-lg font-bold font-display">
//                   Total Submissions
//                 </p>
//                 <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-navy">
//                   <EyeIcon className="w-8 h-8 text-dreamxec-navy" />
//                 </div>
//               </div>
//               <p className="text-5xl sm:text-6xl font-bold text-dreamxec-navy font-display">
//                 {totalCampaigns + totalProjects}
//               </p>
//               <div className="mt-2 h-1 bg-tricolor-horizontal rounded"></div>
//             </div>
//           </div>

//           {/* Pending Campaigns Section */}
//           <div className="card-pastel-offwhite rounded-xl p-6 sm:p-8 border-5 border-dreamxec-navy shadow-pastel-card mb-8">
//             <div className="card-tricolor-tag"></div>

//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 mt-4">
//               <div className="flex items-center gap-3">
//                 <h2 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy font-display">
//                   Pending Campaigns
//                 </h2>
//                 <div className="flex items-center gap-2 px-4 py-2 bg-dreamxec-orange text-white rounded-lg border-3 border-dreamxec-navy">
//                   <ClockIcon className="w-5 h-5" />
//                   <span className="font-bold font-display text-lg">
//                     {pendingCampaigns.length} Awaiting
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {pendingCampaigns.length === 0 ? (
//               <div className="text-center py-16">
//                 <div className="bg-dreamxec-cream border-5 border-dreamxec-navy w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-pastel-green">
//                   <CheckCircleIcon className="w-12 h-12 text-dreamxec-green" />
//                 </div>
//                 <h3 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy mb-3 font-display">
//                   All caught up!
//                 </h3>
//                 <p className="text-dreamxec-navy text-xl sm:text-2xl font-sans max-w-md mx-auto">
//                   There are no pending campaigns to review at this time.
//                 </p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b-4 border-dreamxec-navy">
//                       <th className="text-left py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display">
//                         Campaign Details
//                       </th>
//                       <th className="text-left py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display hidden md:table-cell">
//                         Goal Amount
//                       </th>
//                       <th className="text-left py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display hidden lg:table-cell">
//                         Submitted
//                       </th>
//                       <th className="text-right py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {pendingCampaigns.map((campaign) => (
//                       <tr
//                         key={campaign.id}
//                         className="border-b-3 border-dreamxec-gray-200 hover:bg-dreamxec-cream transition-colors"
//                       >
//                         <td className="py-4 px-4">
//                           <div className="flex items-start gap-4">
//                             <img
//                               src={campaign.imageUrl}
//                               alt={campaign.title}
//                               className="w-24 h-24 rounded-lg object-cover border-3 border-dreamxec-navy shadow-pastel-saffron flex-shrink-0"
//                             />
//                             <div className="min-w-0">
//                               <p className="font-bold text-dreamxec-navy mb-1 text-lg sm:text-xl font-display">
//                                 {campaign.title}
//                               </p>
//                               <p className="text-base sm:text-lg text-dreamxec-navy opacity-80 mb-1 font-sans">
//                                 {campaign.clubName}
//                               </p>
//                               <p className="text-sm sm:text-base text-dreamxec-navy opacity-70 line-clamp-2 font-sans">
//                                 {campaign.description}
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="py-4 px-4 text-dreamxec-navy font-bold text-lg sm:text-xl font-display hidden md:table-cell">
//                           ₹{campaign.goalAmount.toLocaleString()}
//                         </td>
//                         <td className="py-4 px-4 text-dreamxec-navy text-base font-sans hidden lg:table-cell">
//                           {campaign.createdAt instanceof Date ? campaign.createdAt.toLocaleDateString('en-US', {
//                             month: 'short',
//                             day: 'numeric',
//                             year: 'numeric',
//                           }) : new Date(campaign.createdAt).toLocaleDateString('en-US', {
//                             month: 'short',
//                             day: 'numeric',
//                             year: 'numeric',
//                           })}
//                         </td>
//                         <td className="py-4 px-4">
//                           <div className="flex items-center justify-end gap-2">
//                             <button
//                               onClick={() => setSelectedCampaign(campaign)}
//                               className="inline-flex items-center gap-2 p-2 sm:p-3 bg-dreamxec-gray-100 text-dreamxec-navy rounded-lg font-bold border-3 border-dreamxec-navy hover:scale-110 transition-transform"
//                               title="View Details"
//                             >
//                               <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
//                             </button>
//                             <button
//                               onClick={() => onApprove(campaign.id)}
//                               className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-dreamxec-green text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-green hover:scale-105 transition-transform font-display"
//                             >
//                               <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
//                               <span className="hidden sm:inline">Approve</span>
//                             </button>
//                             <button
//                               onClick={() => handleRejectClick(campaign.id, campaign.title)}
//                               className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-red-600 text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display"
//                             >
//                               <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
//                               <span className="hidden sm:inline">Reject</span>
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* All Projects Section */}
//           <div className="card-pastel-offwhite rounded-xl p-6 sm:p-8 border-5 border-dreamxec-navy shadow-pastel-card">
//             <div className="card-tricolor-tag"></div>

//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 mt-4">
//               <div className="flex items-center gap-3">
//                 <h2 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy font-display">
//                   All Projects
//                 </h2>
//                 <StarDecoration className="w-8 h-8" color="#0B9C2C" />
//               </div>
//               <div className="text-base sm:text-lg text-dreamxec-navy font-sans">
//                 Showing all {totalCampaigns} projects
//               </div>
//             </div>

//             {(!allCampaigns || allCampaigns.length === 0) ? (
//               <div className="text-center py-16">
//                 <div className="bg-dreamxec-cream border-5 border-dreamxec-navy w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <span className="text-dreamxec-navy text-5xl font-bold">?</span>
//                 </div>
//                 <p className="text-dreamxec-navy text-xl sm:text-2xl font-sans">No projects found.</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b-4 border-dreamxec-navy">
//                       <th className="text-left py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display">
//                         Title
//                       </th>
//                       <th className="text-left py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display hidden md:table-cell">
//                         Owner
//                       </th>
//                       <th className="text-left py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display hidden lg:table-cell">
//                         Created
//                       </th>
//                       <th className="text-right py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {allCampaigns!.map((campaign: Campaign) => (
//                       <tr
//                         key={campaign.id}
//                         className="border-b-3 border-dreamxec-gray-200 hover:bg-dreamxec-cream transition-colors cursor-pointer"
//                         onClick={() => setSelectedCampaign(campaign)}
//                       >
//                         <td className="py-4 px-4">
//                           <div className="flex items-center gap-4">
//                             <img
//                               src={campaign.imageUrl}
//                               alt={campaign.title}
//                               className="w-20 h-12 object-cover rounded-lg border-3 border-dreamxec-navy flex-shrink-0"
//                             />
//                             <div className="min-w-0">
//                               <p className="font-bold text-dreamxec-navy mb-1 text-base sm:text-lg font-display">
//                                 {campaign.title}
//                               </p>
//                               <p className="text-sm sm:text-base text-dreamxec-navy opacity-70 line-clamp-2 font-sans">
//                                 {campaign.description}
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="py-4 px-4 text-dreamxec-navy font-bold text-base sm:text-lg font-display hidden md:table-cell">
//                           {campaign.clubName}
//                         </td>
//                         <td className="py-4 px-4 text-dreamxec-navy text-base font-sans hidden lg:table-cell">
//                           {campaign.createdAt instanceof Date ? campaign.createdAt.toLocaleDateString() : new Date(campaign.createdAt).toLocaleDateString()}
//                         </td>
//                         <td className="py-4 px-4 text-right">
//                           <span
//                             className={`inline-flex items-center px-4 py-2 rounded-lg text-base font-bold border-3 border-dreamxec-navy font-display ${campaign.status === 'approved'
//                                 ? 'bg-dreamxec-green text-white'
//                                 : campaign.status === 'pending'
//                                   ? 'bg-dreamxec-orange text-white'
//                                   : 'bg-red-600 text-white'
//                               }`}
//                           >
//                             {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Donor Projects Section */}
//         {pendingProjects.length > 0 && (
//           <div className="mt-12 card-pastel-offwhite rounded-xl p-6 sm:p-8 border-5 border-dreamxec-navy shadow-pastel-card">
//             <div className="card-tricolor-tag"></div>

//             <div className="flex items-center gap-4 mb-8 mt-4">
//               <h2 className="text-4xl sm:text-5xl font-bold text-dreamxec-navy font-display">
//                 Pending Donor Projects
//               </h2>
//               <div className="flex items-center gap-2 bg-dreamxec-orange px-4 py-2 rounded-full border-3 border-dreamxec-navy">
//                 <ClockIcon className="w-6 h-6 text-white" />
//                 <span className="text-white font-bold text-lg font-display">{pendingProjects.length}</span>
//               </div>
//             </div>

//             <div className="space-y-6">
//               {pendingProjects.map((project) => (
//                 <div key={project.id} className="bg-white p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-green">
//                   <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
//                     <div className="flex-1">
//                       <h3 className="text-2xl sm:text-3xl font-bold text-dreamxec-navy mb-2 font-display">
//                         {project.title}
//                       </h3>
//                       <p className="text-lg text-dreamxec-navy opacity-80 font-sans mb-3">
//                         By {project.companyName}
//                       </p>
//                       <p className="text-base text-dreamxec-navy font-sans mb-4 line-clamp-3">
//                         {project.description}
//                       </p>
//                       <div className="flex flex-wrap gap-2 mb-3">
//                         <span className="text-sm bg-dreamxec-cream px-3 py-1 rounded-full border-2 border-dreamxec-navy font-sans">
//                           ⏱ Timeline: {project.timeline.startDate.toLocaleDateString()} - {project.timeline.endDate.toLocaleDateString()}
//                         </span>
//                       </div>
//                       <div className="flex flex-wrap gap-2">
//                         {project.skillsRequired.map((skill, idx) => (
//                           <span key={idx} className="text-sm bg-dreamxec-saffron/20 px-3 py-1 rounded-full border-2 border-dreamxec-saffron font-bold font-display">
//                             {skill}
//                           </span>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="flex flex-col gap-3 min-w-[160px]">
//                       <button
//                         onClick={() => onApproveProject && onApproveProject(project.id)}
//                         className="btn-pastel-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-display text-lg"
//                       >
//                         <CheckCircleIcon className="w-5 h-5" />
//                         Approve
//                       </button>
//                       <button
//                         onClick={() => setRejectionProjectInfo({ id: project.id, title: project.title })}
//                         className="bg-red-600 text-white inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold border-4 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display text-lg"
//                       >
//                         <XCircleIcon className="w-5 h-5" />
//                         Reject
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

import React, { useState } from 'react';
import type { Campaign, Project } from '../types';
import { StarDecoration } from './icons/StarDecoration';

// Simple SVG Icons
const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const XCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M15 9l-6 6M9 9l6 6" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

interface AdminDashboardProps {
  pendingCampaigns: Campaign[];
  allCampaigns?: Campaign[];
  pendingProjects?: Project[];
  allProjects?: Project[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onApproveProject?: (id: string) => void;
  onRejectProject?: (id: string, reason: string) => void;
}

// Modal for viewing campaign details
const CampaignDetailModal = ({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex justify-center items-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 128, 0.8)' }}
      onClick={handleBackdropClick}
    >
      <div
        className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-tricolor-tag"></div>
        <div className="p-6 sm:p-8 mt-4">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy mb-2 font-display">
                {campaign.title}
              </h2>
              <p className="text-lg sm:text-xl text-dreamxec-navy opacity-80 font-sans">
                By {campaign.club?.name} - {campaign.club?.college}
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn-pastel-secondary p-3 rounded-lg hover:scale-110 transition-transform flex-shrink-0 ml-4"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>

          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="w-full h-72 object-cover rounded-lg border-4 border-dreamxec-navy shadow-pastel-saffron mb-6"
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-dreamxec-cream rounded-lg border-3 border-dreamxec-orange">
            <span className="text-2xl sm:text-3xl font-bold text-dreamxec-navy font-display">
              Goal: ₹{campaign.goalAmount.toLocaleString()}
            </span>
            <span className="text-base sm:text-lg text-dreamxec-navy opacity-80 font-sans">
              Submitted: {campaign.createdAt instanceof Date ? campaign.createdAt.toLocaleDateString() : new Date(campaign.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-dreamxec-navy font-display flex items-center gap-2">
              Description
              <StarDecoration className="w-6 h-6" color="#FF7F00" />
            </h3>
            <div className="p-4 bg-white rounded-lg border-3 border-dreamxec-green">
              <p className="text-dreamxec-navy text-lg whitespace-pre-wrap font-sans leading-relaxed">
                {campaign.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal for entering rejection reason
const RejectionModal = ({
  campaignTitle,
  onClose,
  onSubmit,
}: {
  campaignTitle: string;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      console.log('Submitting rejection with reason:', reason);
      onSubmit(reason); // onSubmit will now handle closing the modal
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent closing modal by clicking backdrop during submission
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex justify-center items-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 128, 0.8)' }}
      onClick={handleBackdropClick}
    >
      <div
        className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card max-w-md w-full p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-tricolor-tag"></div>

        <div className="flex justify-between items-center mb-6 mt-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-dreamxec-navy font-display">
            Reject Campaign
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-dreamxec-navy hover:scale-110 transition-transform flex-shrink-0"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-dreamxec-cream rounded-lg border-3 border-dreamxec-orange">
          <p className="text-dreamxec-navy text-lg font-sans">
            Please provide a reason for rejecting:{' '}
            <span className="font-bold font-display">{campaignTitle}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Incomplete description, inappropriate content..."
            className="w-full h-32 p-4 border-4 border-dreamxec-navy rounded-lg text-lg font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-orange focus:ring-2 focus:ring-dreamxec-orange transition-all resize-none"
            required
            autoFocus
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-pastel-secondary px-6 py-3 rounded-lg font-display text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-bold border-4 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <SendIcon className="w-5 h-5" />
              Submit Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AdminDashboard({
  pendingCampaigns,
  allCampaigns,
  pendingProjects = [],
  allProjects = [],
  onApprove,
  onReject,
  onApproveProject,
  onRejectProject,
}: AdminDashboardProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [rejectionInfo, setRejectionInfo] = useState<{ id: string; title: string } | null>(null);
  const [rejectionProjectInfo, setRejectionProjectInfo] = useState<{ id: string; title: string } | null>(null);

  const handleRejectClick = (id: string, title: string) => {
    setRejectionInfo({ id, title });
  };

  const handleRejectSubmit = (reason: string) => {
    if (rejectionInfo) {
      const { id } = rejectionInfo;
      // Close modal immediately
      setRejectionInfo(null);
      // Call onReject directly - alert has been removed from parent
      onReject(id, reason);
    }
  };

  const handleRejectProjectSubmit = (reason: string) => {
    if (rejectionProjectInfo && onRejectProject) {
      const { id } = rejectionProjectInfo;
      // Close modal immediately
      setRejectionProjectInfo(null);
      // Call onRejectProject
      onRejectProject(id, reason);
    }
  };

  // Stats calculations
  const approvedCount = allCampaigns?.filter((c) => c.status === 'approved').length || 0;
  const totalCampaigns = allCampaigns?.length || 0;
  const approvedProjectsCount = allProjects?.filter((p) => p.status === 'approved').length || 0;
  const totalProjects = allProjects?.length || 0;

  return (
    <>
      {selectedCampaign && (
        <CampaignDetailModal campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} />
      )}
      {rejectionInfo && (
        <RejectionModal
          campaignTitle={rejectionInfo.title}
          onClose={() => setRejectionInfo(null)}
          onSubmit={handleRejectSubmit}
        />
      )}
      {rejectionProjectInfo && (
        <RejectionModal
          campaignTitle={rejectionProjectInfo.title}
          onClose={() => setRejectionProjectInfo(null)}
          onSubmit={handleRejectProjectSubmit}
        />
      )}

      <div className="min-h-screen relative overflow-hidden">
        {/* Use existing Header component */}

        {/* Decorative floating stars - original theme */}
        <div className="absolute top-20 left-10 z-0 opacity-20">
          <StarDecoration className="w-16 h-16" color="#FF7F00" />
        </div>
        <div className="absolute top-40 right-20 z-0 opacity-20">
          <StarDecoration className="w-12 h-12" color="#0B9C2C" />
        </div>
        <div className="absolute bottom-32 left-1/4 z-0 opacity-15">
          <StarDecoration className="w-20 h-20" color="#000080" />
        </div>

        {/* Header Section with Tricolor Accent */}
        <div className="relative bg-dreamxec-navy border-b-8 border-dreamxec-orange shadow-pastel-saffron z-10">
          <div className="card-tricolor-tag"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-dreamxec-orange font-display">
                Admin Dashboard
              </h1>
              <StarDecoration className="w-10 h-10 hidden sm:block" color="#FF7F00" />
            </div>
            <p className="text-dreamxec-cream text-xl sm:text-2xl font-sans">
              Review and manage campaign and project submissions across the platform
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Stats Cards & Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Pending Campaigns Card */}
            <div className="card-pastel rounded-xl p-6 card-pastel-tilt-left hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-base sm:text-lg font-bold font-display">
                  Pending Campaigns
                </p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-saffron">
                  <ClockIcon className="w-8 h-8 text-dreamxec-orange" />
                </div>
              </div>
              <p className="text-5xl sm:text-6xl font-bold text-dreamxec-navy font-display">
                {pendingCampaigns.length}
              </p>
              <div className="mt-2 h-1 bg-dreamxec-orange rounded"></div>
            </div>

            {/* Pending Projects Card */}
            <div className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-base sm:text-lg font-bold font-display">
                  Pending Projects
                </p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-saffron">
                  <ClockIcon className="w-8 h-8 text-dreamxec-orange" />
                </div>
              </div>
              <p className="text-5xl sm:text-6xl font-bold text-dreamxec-navy font-display">
                {pendingProjects.length}
              </p>
              <div className="mt-2 h-1 bg-dreamxec-orange rounded"></div>
            </div>

            {/* Approved Card */}
            <div className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-base sm:text-lg font-bold font-display">
                  Total Approved
                </p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-green">
                  <CheckCircleIcon className="w-8 h-8 text-dreamxec-green" />
                </div>
              </div>
              <p className="text-5xl sm:text-6xl font-bold text-dreamxec-navy font-display">
                {approvedCount + approvedProjectsCount}
              </p>
              <div className="mt-2 h-1 bg-dreamxec-green rounded"></div>
            </div>

            {/* Total Items Card */}
            <div className="card-pastel rounded-xl p-6 card-pastel-tilt-right hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-base sm:text-lg font-bold font-display">
                  Total Submissions
                </p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-navy">
                  <EyeIcon className="w-8 h-8 text-dreamxec-navy" />
                </div>
              </div>
              <p className="text-5xl sm:text-6xl font-bold text-dreamxec-navy font-display">
                {totalCampaigns + totalProjects}
              </p>
              <div className="mt-2 h-1 bg-tricolor-horizontal rounded"></div>
            </div>

            {/* Club Verifications Navigation Box */}
            <div 
              onClick={() => window.location.href = "/admin/verifications"}
              className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-base sm:text-lg font-bold font-display group-hover:text-dreamxec-orange transition-colors">
                  Club Verifications
                </p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-saffron group-hover:shadow-pastel-orange transition-shadow">
                  <CheckCircleIcon className="w-8 h-8 text-dreamxec-navy group-hover:text-dreamxec-orange" />
                </div>
              </div>
              <p className="text-xl font-bold text-dreamxec-navy opacity-70 font-sans mt-2">
                Manage Requests →
              </p>
              <div className="mt-4 h-1 bg-dreamxec-navy rounded group-hover:bg-dreamxec-orange transition-colors"></div>
            </div>

            {/* Club Referrals Navigation Box */}
            <div 
              onClick={() => window.location.href = "/admin/referrals"}
              className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-base sm:text-lg font-bold font-display group-hover:text-dreamxec-green transition-colors">
                  Club Referrals
                </p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-green group-hover:shadow-pastel-green transition-shadow">
                  <SendIcon className="w-8 h-8 text-dreamxec-navy group-hover:text-dreamxec-green" />
                </div>
              </div>
              <p className="text-xl font-bold text-dreamxec-navy opacity-70 font-sans mt-2">
                View Referrals →
              </p>
              <div className="mt-4 h-1 bg-dreamxec-navy rounded group-hover:bg-dreamxec-green transition-colors"></div>
            </div>

          </div>

          {/* Pending Campaigns Section */}
          <div className="card-pastel-offwhite rounded-xl p-6 sm:p-8 border-5 border-dreamxec-navy shadow-pastel-card mb-8">
            <div className="card-tricolor-tag"></div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 mt-4">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy font-display">
                  Pending Campaigns
                </h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-dreamxec-orange text-white rounded-lg border-3 border-dreamxec-navy">
                  <ClockIcon className="w-5 h-5" />
                  <span className="font-bold font-display text-lg">
                    {pendingCampaigns.length} Awaiting
                  </span>
                </div>
              </div>
            </div>

            {pendingCampaigns.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-dreamxec-cream border-5 border-dreamxec-navy w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-pastel-green">
                  <CheckCircleIcon className="w-12 h-12 text-dreamxec-green" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy mb-3 font-display">
                  All caught up!
                </h3>
                <p className="text-dreamxec-navy text-xl sm:text-2xl font-sans max-w-md mx-auto">
                  There are no pending campaigns to review at this time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-4 border-dreamxec-navy">
                      <th className="text-left py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display">
                        Campaign Details
                      </th>
                      <th className="text-left py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display hidden md:table-cell">
                        Goal Amount
                      </th>
                      <th className="text-left py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display hidden lg:table-cell">
                        Submitted
                      </th>
                      <th className="text-right py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingCampaigns.map((campaign) => (
                      <tr
                        key={campaign.id}
                        className="border-b-3 border-dreamxec-gray-200 hover:bg-dreamxec-cream transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={campaign.imageUrl}
                              alt={campaign.title}
                              className="w-24 h-24 rounded-lg object-cover border-3 border-dreamxec-navy shadow-pastel-saffron flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-dreamxec-navy mb-1 text-lg sm:text-xl font-display">
                                {campaign.title}
                              </p>
                              <p className="text-base sm:text-lg text-dreamxec-navy opacity-80 mb-1 font-sans">
                                {campaign.club?.name} - {campaign.club?.college}
                              </p>
                              <p className="text-sm sm:text-base text-dreamxec-navy opacity-70 line-clamp-2 font-sans">
                                {campaign.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-dreamxec-navy font-bold text-lg sm:text-xl font-display hidden md:table-cell">
                          ₹{campaign.goalAmount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-dreamxec-navy text-base font-sans hidden lg:table-cell">
                          {campaign.createdAt instanceof Date ? campaign.createdAt.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }) : new Date(campaign.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedCampaign(campaign)}
                              className="inline-flex items-center gap-2 p-2 sm:p-3 bg-dreamxec-gray-100 text-dreamxec-navy rounded-lg font-bold border-3 border-dreamxec-navy hover:scale-110 transition-transform"
                              title="View Details"
                            >
                              <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                              onClick={() => onApprove(campaign.id)}
                              className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-dreamxec-green text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-green hover:scale-105 transition-transform font-display"
                            >
                              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="hidden sm:inline">Approve</span>
                            </button>
                            <button
                              onClick={() => handleRejectClick(campaign.id, campaign.title)}
                              className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-red-600 text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display"
                            >
                              <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="hidden sm:inline">Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* All Projects Section */}
          <div className="card-pastel-offwhite rounded-xl p-6 sm:p-8 border-5 border-dreamxec-navy shadow-pastel-card">
            <div className="card-tricolor-tag"></div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 mt-4">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy font-display">
                  All Projects
                </h2>
                <StarDecoration className="w-8 h-8" color="#0B9C2C" />
              </div>
              <div className="text-base sm:text-lg text-dreamxec-navy font-sans">
                Showing all {totalCampaigns} projects
              </div>
            </div>

            {(!allCampaigns || allCampaigns.length === 0) ? (
              <div className="text-center py-16">
                <div className="bg-dreamxec-cream border-5 border-dreamxec-navy w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-dreamxec-navy text-5xl font-bold">?</span>
                </div>
                <p className="text-dreamxec-navy text-xl sm:text-2xl font-sans">No projects found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-4 border-dreamxec-navy">
                      <th className="text-left py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display">
                        Title
                      </th>
                      <th className="text-left py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display hidden md:table-cell">
                        Owner
                      </th>
                      <th className="text-left py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display hidden lg:table-cell">
                        Created
                      </th>
                      <th className="text-right py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCampaigns!.map((campaign: Campaign) => (
                      <tr
                        key={campaign.id}
                        className="border-b-3 border-dreamxec-gray-200 hover:bg-dreamxec-cream transition-colors cursor-pointer"
                        onClick={() => setSelectedCampaign(campaign)}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={campaign.imageUrl}
                              alt={campaign.title}
                              className="w-20 h-12 object-cover rounded-lg border-3 border-dreamxec-navy flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-dreamxec-navy mb-1 text-base sm:text-lg font-display">
                                {campaign.title}
                              </p>
                              <p className="text-sm sm:text-base text-dreamxec-navy opacity-70 line-clamp-2 font-sans">
                                {campaign.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-dreamxec-navy font-bold text-base sm:text-lg font-display hidden md:table-cell">
                          {campaign.club?.name || 'N/A'} - {campaign.club?.college || 'Unknown University'}
                        </td>
                        <td className="py-4 px-4 text-dreamxec-navy text-base font-sans hidden lg:table-cell">
                          {campaign.createdAt instanceof Date ? campaign.createdAt.toLocaleDateString() : new Date(campaign.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`inline-flex items-center px-4 py-2 rounded-lg text-base font-bold border-3 border-dreamxec-navy font-display ${campaign.status === 'approved'
                                ? 'bg-dreamxec-green text-white'
                                : campaign.status === 'pending'
                                  ? 'bg-dreamxec-orange text-white'
                                  : 'bg-red-600 text-white'
                              }`}
                          >
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Donor Projects Section */}
        {pendingProjects.length > 0 && (
          <div className="mt-12 card-pastel-offwhite rounded-xl p-6 sm:p-8 border-5 border-dreamxec-navy shadow-pastel-card">
            <div className="card-tricolor-tag"></div>

            <div className="flex items-center gap-4 mb-8 mt-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-dreamxec-navy font-display">
                Pending Donor Projects
              </h2>
              <div className="flex items-center gap-2 bg-dreamxec-orange px-4 py-2 rounded-full border-3 border-dreamxec-navy">
                <ClockIcon className="w-6 h-6 text-white" />
                <span className="text-white font-bold text-lg font-display">{pendingProjects.length}</span>
              </div>
            </div>

            <div className="space-y-6">
              {pendingProjects.map((project) => (
                <div key={project.id} className="bg-white p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-green">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl sm:text-3xl font-bold text-dreamxec-navy mb-2 font-display">
                        {project.title}
                      </h3>
                      <p className="text-lg text-dreamxec-navy opacity-80 font-sans mb-3">
                        By {project.companyName}
                      </p>
                      <p className="text-base text-dreamxec-navy font-sans mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-sm bg-dreamxec-cream px-3 py-1 rounded-full border-2 border-dreamxec-navy font-sans">
                          ⏱ Timeline: {project.timeline.startDate.toLocaleDateString()} - {project.timeline.endDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.skillsRequired.map((skill, idx) => (
                          <span key={idx} className="text-sm bg-dreamxec-saffron/20 px-3 py-1 rounded-full border-2 border-dreamxec-saffron font-bold font-display">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[160px]">
                      <button
                        onClick={() => onApproveProject && onApproveProject(project.id)}
                        className="btn-pastel-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-display text-lg"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectionProjectInfo({ id: project.id, title: project.title })}
                        className="bg-red-600 text-white inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold border-4 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display text-lg"
                      >
                        <XCircleIcon className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
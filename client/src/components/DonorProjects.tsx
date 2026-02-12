import { useState, useEffect } from 'react';
import { StarDecoration } from './icons/StarDecoration';
import type { Project } from '../types';
import { getProjectApplications, type Application } from '../services/applicationService';
import { useNavigate } from 'react-router-dom';

interface DonorProjectsProps {
  projects: Project[];
  onBack: () => void;
  onCreateProject?: () => void;
  onUpdateApplicationStatus: (
    projectId: string,
    applicationId: string,
    status: 'accepted' | 'rejected'
  ) => void;
}

// Tooltip component
const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-dreamxec-navy text-white text-xs sm:text-sm rounded-lg shadow-lg whitespace-nowrap max-w-xs sm:max-w-sm border-2 border-dreamxec-orange">
          <div className="relative">
            {text}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-dreamxec-orange"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Info icon component
const InfoIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function DonorProjects({
  projects,
  onBack,
  onCreateProject,
  onUpdateApplicationStatus,
}: DonorProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [projectApplications, setProjectApplications] = useState<{ [projectId: string]: Application[] }>({});
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [processingApplications, setProcessingApplications] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Load applications for each project
  useEffect(() => {
    const loadApplicationsForProjects = async () => {
      if (isLoadingApplications) return;
      
      console.log('Loading applications for projects:', projects.length);
      setIsLoadingApplications(true);
      setApplicationError(null);
      
      for (const project of projects) {
        console.log(`Checking project ${project.id}, status: ${project.status}`);
        
        if (project.status === 'approved' && !projectApplications[project.id]) {
          try {
            const response = await getProjectApplications(project.id);
            
            if (response.status === 'success' && response.data) {
              console.log(`Found ${response.data.applications.length} applications for project ${project.id}`);
              setProjectApplications(prev => ({
                ...prev,
                [project.id]: response.data!.applications
              }));
            } else {
              console.log(`No applications found for project ${project.id}`);
              setProjectApplications(prev => ({
                ...prev,
                [project.id]: []
              }));
            }
          } catch (error) {
            console.error(`Failed to load applications for project ${project.id}:`, error);
            setApplicationError('Some applications failed to load. Please refresh the page.');
            setProjectApplications(prev => ({
              ...prev,
              [project.id]: []
            }));
          }
        }
      }
      setIsLoadingApplications(false);
    };

    if (projects.length > 0 && !isLoadingApplications) {
      loadApplicationsForProjects();
    }
  }, [projects, isLoadingApplications]);

  const handleViewApplications = (project: Project) => {
    setSelectedProject(project);
    setShowApplicationsModal(true);
  };

  const handleCloseModal = () => {
    setShowApplicationsModal(false);
    setSelectedProject(null);
  };

  const handleApplicationStatusUpdate = async (
    projectId: string,
    applicationId: string,
    status: 'accepted' | 'rejected'
  ) => {
    setProcessingApplications(prev => new Set(prev).add(applicationId));
    try {
      await onUpdateApplicationStatus(projectId, applicationId, status);
      
      // Update local state
      setProjectApplications(prev => ({
        ...prev,
        [projectId]: prev[projectId].map(app =>
          app.id === applicationId
            ? { ...app, status: status.toUpperCase() as 'ACCEPTED' | 'REJECTED' }
            : app
        )
      }));
    } catch (error) {
      console.error('Failed to update application status:', error);
      setApplicationError('Failed to update application. Please try again.');
    } finally {
      setProcessingApplications(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTimelineDisplay = (timeline: string | { startDate: Date | string; endDate: Date | string } | null) => {
    if (!timeline) return 'Not specified';
    if (typeof timeline === 'string') return timeline;
    return `${formatDate(timeline.startDate)} - ${formatDate(timeline.endDate)}`;
  };

  return (
    <div className="min-h-screen bg-dreamxec-cream relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <StarDecoration className="absolute top-20 left-4 sm:left-10 w-8 h-8 sm:w-12 sm:h-12 text-dreamxec-saffron opacity-20 animate-spin-slow" />
        <StarDecoration className="absolute top-40 right-4 sm:right-20 w-12 h-12 sm:w-16 sm:h-16 text-dreamxec-green opacity-15 animate-bounce-slow" />
        <StarDecoration className="absolute bottom-32 left-1/4 w-8 h-8 sm:w-10 sm:h-10 text-dreamxec-orange opacity-25" />
        
        <img
          src="https://c.animaapp.com/mhd6hm18SGcCN3/assets/image-28.svg"
          alt="Decorative"
          className="absolute top-10 right-4 sm:right-10 w-16 h-16 sm:w-24 sm:h-24 opacity-10 animate-float"
        />
        <img
          src="https://c.animaapp.com/mhd6hm18SGcCN3/assets/image-30.svg"
          alt="Decorative"
          className="absolute bottom-10 left-4 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 opacity-10 animate-float-delayed"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-4 sm:mb-6 lg:mb-8 flex items-center gap-2 text-dreamxec-navy font-bold font-sans text-sm sm:text-base lg:text-lg hover:text-dreamxec-orange transition-colors focus:outline-none focus:ring-2 focus:ring-dreamxec-orange rounded-lg px-2 py-1"
          aria-label="Back to Dashboard"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Error notification */}
        {applicationError && (
          <div className="mb-6 p-4 bg-red-100 border-3 border-red-500 rounded-xl flex items-start gap-3 animate-fade-in">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-sans text-sm sm:text-base flex-1">{applicationError}</p>
            <button
              onClick={() => setApplicationError(null)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
              aria-label="Dismiss error"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dreamxec-navy font-display mb-2 sm:mb-4 px-2">
            My Projects 📋
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-dreamxec-navy font-sans opacity-80 px-4 max-w-4xl mx-auto">
            Manage your projects and review student applications
          </p>
        </div>

        {/* Projects grid */}
        {projects.length === 0 ? (
          <div className="card-pastel-offwhite rounded-2xl border-4 sm:border-5 border-dreamxec-navy p-6 sm:p-8 md:p-12 shadow-pastel-card text-center max-w-2xl mx-auto">
            <div className="card-tricolor-tag"></div>
            <div className="text-4xl sm:text-5xl md:text-6xl mb-4">📝</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-dreamxec-navy font-display mb-4">
              No Projects Yet
            </h2>
            <p className="text-dreamxec-navy font-sans text-base sm:text-lg mb-6">
              You haven't created any projects yet. Start by creating your first project!
            </p>
            <button
              onClick={onCreateProject}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-dreamxec-green border-3 sm:border-4 border-dreamxec-navy rounded-xl font-bold text-white text-base sm:text-lg font-display hover:bg-dreamxec-orange hover:scale-105 transition-all shadow-pastel-saffron focus:outline-none focus:ring-2 focus:ring-dreamxec-orange focus:ring-offset-2"
              aria-label="Create your first project"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project) => {
              const applications = projectApplications[project.id] || project.interestedUsers || [];
              const pendingCount = applications.filter(
                (app: any) => (app.status === 'PENDING' || app.status === 'pending')
              ).length;
              const acceptedCount = applications.filter(
                (app: any) => (app.status === 'ACCEPTED' || app.status === 'accepted')
              ).length;
              const rejectedCount = applications.filter(
                (app: any) => (app.status === 'REJECTED' || app.status === 'rejected')
              ).length;

              return (
                <div
                  key={project.id}
                  className="card-pastel-offwhite rounded-xl sm:rounded-2xl border-3 sm:border-4 lg:border-5 border-dreamxec-navy p-4 sm:p-5 lg:p-6 shadow-pastel-card hover:shadow-pastel-saffron transition-all duration-300"
                >
                  <div className="card-tricolor-tag"></div>

                  {/* Status Badge */}
                  <div className="mb-3 flex items-center gap-2">
                    {project.status === 'pending' && (
                      <>
                        <span className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-dreamxec-saffron border-2 sm:border-3 border-dreamxec-navy rounded-full text-dreamxec-navy font-sans text-xs sm:text-sm font-bold">
                          ⏳ Pending Approval
                        </span>
                        <Tooltip text="Your project is awaiting admin review. You'll be notified once it's approved.">
                          <InfoIcon className="w-4 h-4 text-dreamxec-navy cursor-help" />
                        </Tooltip>
                      </>
                    )}
                    {project.status === 'rejected' && (
                      <>
                        <span className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-red-400 border-2 sm:border-3 border-dreamxec-navy rounded-full text-white font-sans text-xs sm:text-sm font-bold">
                          ❌ Rejected
                        </span>
                        <Tooltip text="This project was not approved. Please review the rejection reason below.">
                          <InfoIcon className="w-4 h-4 text-red-500 cursor-help" />
                        </Tooltip>
                      </>
                    )}
                    {project.status === 'approved' && (
                      <>
                        <span className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-dreamxec-green border-2 sm:border-3 border-dreamxec-navy rounded-full text-white font-sans text-xs sm:text-sm font-bold">
                          ✅ Approved
                        </span>
                        <Tooltip text="Your project is live and visible to students!">
                          <InfoIcon className="w-4 h-4 text-dreamxec-green cursor-help" />
                        </Tooltip>
                      </>
                    )}
                  </div>

                  {/* Project info */}
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-dreamxec-navy font-display mb-2 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-dreamxec-orange font-bold font-sans mb-3 text-sm sm:text-base break-words">
                    {project.companyName}
                  </p>
                  <p className="text-dreamxec-navy font-sans mb-4 line-clamp-3 text-sm sm:text-base leading-relaxed">
                    {project.description}
                  </p>

                  {/* Rejection Reason (if rejected) */}
                  {project.status === 'rejected' && project.rejectionReason && (
                    <div className="mb-4 p-3 bg-red-100 border-3 border-red-500 rounded-xl">
                      <p className="text-red-700 font-sans text-sm">
                        <strong>Rejection Reason:</strong> {project.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-dreamxec-navy font-sans text-xs sm:text-sm font-bold">Required Skills:</span>
                      <Tooltip text="Skills students need to have to apply for this project">
                        <InfoIcon className="w-3 h-3 text-dreamxec-navy cursor-help" />
                      </Tooltip>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {project.skillsRequired.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 sm:px-3 py-1 bg-dreamxec-cream border-1 sm:border-2 border-dreamxec-navy rounded-full text-dreamxec-navy font-sans text-xs sm:text-sm font-bold"
                        >
                          {skill}
                        </span>
                      ))}
                      {project.skillsRequired.length > 3 && (
                        <Tooltip text={`Additional skills: ${project.skillsRequired.slice(3).join(', ')}`}>
                          <span className="px-2 sm:px-3 py-1 bg-dreamxec-beige border-1 sm:border-2 border-dreamxec-navy rounded-full text-dreamxec-navy font-sans text-xs sm:text-sm font-bold cursor-help">
                            +{project.skillsRequired.length - 3} more
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mb-4 text-dreamxec-navy font-sans text-xs sm:text-sm flex items-center gap-2">
                    <p className="break-words">
                      <strong>Timeline:</strong> {getTimelineDisplay(project.timeline)}
                    </p>
                    <Tooltip text="Project duration from start to end date">
                      <InfoIcon className="w-3 h-3 text-dreamxec-navy cursor-help flex-shrink-0" />
                    </Tooltip>
                  </div>

                  {/* Applications stats - Only show for approved projects */}
                  {project.status === 'approved' && (
                    <div className="flex gap-2 mb-4">
                      <Tooltip text={`${pendingCount} student${pendingCount !== 1 ? 's' : ''} waiting for your review`}>
                        <div className="flex-1 bg-dreamxec-saffron/30 border-2 border-dreamxec-navy rounded-lg p-2 sm:p-3 text-center min-w-0 cursor-help">
                          <div className="text-base sm:text-lg md:text-2xl font-bold text-dreamxec-navy font-display">
                            {pendingCount}
                          </div>
                          <div className="text-xs sm:text-sm text-dreamxec-navy font-sans font-bold">
                            Pending
                          </div>
                        </div>
                      </Tooltip>
                      <Tooltip text={`${acceptedCount} student${acceptedCount !== 1 ? 's' : ''} accepted for this project`}>
                        <div className="flex-1 bg-dreamxec-green/30 border-2 border-dreamxec-navy rounded-lg p-2 sm:p-3 text-center min-w-0 cursor-help">
                          <div className="text-base sm:text-lg md:text-2xl font-bold text-dreamxec-navy font-display">
                            {acceptedCount}
                          </div>
                          <div className="text-xs sm:text-sm text-dreamxec-navy font-sans font-bold">
                            Accepted
                          </div>
                        </div>
                      </Tooltip>
                      {rejectedCount > 0 && (
                        <Tooltip text={`${rejectedCount} application${rejectedCount !== 1 ? 's' : ''} rejected`}>
                          <div className="flex-1 bg-red-100 border-2 border-red-400 rounded-lg p-2 sm:p-3 text-center min-w-0 cursor-help">
                            <div className="text-base sm:text-lg md:text-2xl font-bold text-dreamxec-navy font-display">
                              {rejectedCount}
                            </div>
                            <div className="text-xs sm:text-sm text-dreamxec-navy font-sans font-bold">
                              Rejected
                            </div>
                          </div>
                        </Tooltip>
                      )}
                    </div>
                  )}

                  {/* Action button based on status */}
                  {project.status === 'approved' ? (
                    <button
                      onClick={() => handleViewApplications(project)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dreamxec-orange border-2 sm:border-3 border-dreamxec-navy rounded-xl font-bold text-white font-display hover:bg-dreamxec-green hover:scale-105 transition-all shadow-pastel-card text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-dreamxec-orange focus:ring-offset-2"
                      aria-label={`View ${applications.length} interested students for ${project.title}`}
                    >
                      View Interested Students ({applications.length})
                    </button>
                  ) : project.status === 'pending' ? (
                    <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dreamxec-saffron/30 border-2 sm:border-3 border-dreamxec-navy rounded-xl text-center">
                      <p className="text-dreamxec-navy font-sans font-bold text-sm sm:text-base">
                        ⏳ Waiting for admin approval
                      </p>
                    </div>
                  ) : (
                    <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-red-100 border-2 sm:border-3 border-dreamxec-navy rounded-xl text-center">
                      <p className="text-red-700 font-sans font-bold text-sm sm:text-base">
                        ❌ Project rejected
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Applications Modal */}
      {showApplicationsModal && selectedProject && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="w-full h-full sm:w-auto sm:h-auto sm:max-w-3xl md:max-w-4xl lg:max-w-5xl sm:max-h-[90vh] sm:m-4 card-pastel-offwhite rounded-none sm:rounded-2xl border-0 sm:border-3 md:border-5 border-dreamxec-navy shadow-pastel-saffron flex flex-col">
            <div className="card-tricolor-tag"></div>
            
            {/* Modal header */}
            <div className="flex-shrink-0 p-4 border-b-2 sm:border-b-4 border-dreamxec-navy bg-dreamxec-beige">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h2 
                    id="modal-title"
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-dreamxec-navy font-display mb-1 break-words leading-tight"
                  >
                    {selectedProject.title}
                  </h2>
                  <p className="text-dreamxec-orange font-bold font-sans text-sm sm:text-base break-words">
                    {selectedProject.companyName}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-dreamxec-navy hover:text-dreamxec-orange transition-colors flex-shrink-0 p-2 -m-2 focus:outline-none focus:ring-2 focus:ring-dreamxec-orange rounded"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Applications list - scrollable content */}
            <div className="flex-1 overflow-y-auto p-4">
              {(() => {
                const applications = projectApplications[selectedProject.id] || [];
                console.log(`Modal for project ${selectedProject.id}: Found ${applications.length} applications`, applications);
                return applications.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-4">👥</div>
                    <p className="text-dreamxec-navy font-sans text-base sm:text-lg px-4 mb-2">
                      No applications yet. Students will appear here once they apply.
                    </p>
                    <p className="text-dreamxec-navy font-sans text-sm px-4 opacity-70">
                      Share your project with students to get applications!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => {
                      const isProcessing = processingApplications.has(application.id);
                      
                      return (
                        <div
                          key={application.id}
                          className={`border-2 sm:border-3 rounded-xl p-4 transition-all ${
                            application.status === 'ACCEPTED'
                              ? 'bg-dreamxec-green/10 border-dreamxec-green'
                              : application.status === 'REJECTED'
                              ? 'bg-red-50 border-red-400'
                              : 'bg-white border-dreamxec-navy'
                          } ${isProcessing ? 'opacity-60' : ''}`}
                        >
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg sm:text-xl font-bold text-dreamxec-navy font-display break-words">
                                  {application.user?.name || 'Unknown User'}
                                </h4>
                                <p className="text-dreamxec-navy font-sans text-sm opacity-70 break-all">
                                  {application.user?.email || 'No email'}
                                </p>
                                <p className="text-dreamxec-navy font-sans text-xs opacity-60 mt-1">
                                  Applied on {formatDate(new Date(application.createdAt))}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                {application.status === 'PENDING' ? (
                                  <Tooltip text="This application is waiting for your decision">
                                    <span className="inline-block px-3 py-1 bg-dreamxec-saffron border-2 border-dreamxec-navy rounded-full text-dreamxec-navy font-sans text-xs sm:text-sm font-bold cursor-help">
                                      Pending
                                    </span>
                                  </Tooltip>
                                ) : application.status === 'ACCEPTED' ? (
                                  <Tooltip text="You've accepted this student for the project">
                                    <span className="inline-block px-3 py-1 bg-dreamxec-green border-2 border-dreamxec-navy rounded-full text-white font-sans text-xs sm:text-sm font-bold cursor-help">
                                      Accepted
                                    </span>
                                  </Tooltip>
                                ) : (
                                  <Tooltip text="This application has been rejected">
                                    <span className="inline-block px-3 py-1 bg-red-500 border-2 border-dreamxec-navy rounded-full text-white font-sans text-xs sm:text-sm font-bold cursor-help">
                                      Rejected
                                    </span>
                                  </Tooltip>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="bg-dreamxec-cream/50 border-2 border-dreamxec-navy rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-dreamxec-navy font-sans text-sm sm:text-base font-bold">
                                    Cover Letter:
                                  </p>
                                  <Tooltip text="The student's motivation for applying">
                                    <InfoIcon className="w-3 h-3 text-dreamxec-navy cursor-help" />
                                  </Tooltip>
                                </div>
                                <p className="text-dreamxec-navy font-sans text-sm sm:text-base break-words leading-relaxed">
                                  {application.coverLetter}
                                </p>
                              </div>
                              {application.skills && application.skills.length > 0 && (
                                <div className="bg-dreamxec-beige/50 border-2 border-dreamxec-navy rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <p className="text-dreamxec-navy font-sans text-sm sm:text-base font-bold">
                                      Skills:
                                    </p>
                                    <Tooltip text="Skills the student has for this project">
                                      <InfoIcon className="w-3 h-3 text-dreamxec-navy cursor-help" />
                                    </Tooltip>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {application.skills.map((skill, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 sm:px-3 py-1 bg-white border-2 border-dreamxec-navy rounded-full text-dreamxec-navy font-sans text-xs sm:text-sm font-bold"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {application.status === 'PENDING' && (
                              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Tooltip text="Accept this student for your project">
                                  <button
                                    onClick={() =>
                                      handleApplicationStatusUpdate(
                                        selectedProject.id,
                                        application.id,
                                        'accepted'
                                      )
                                    }
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-3 bg-dreamxec-green border-2 border-dreamxec-navy rounded-lg font-bold text-white font-display hover:scale-105 transition-all text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-dreamxec-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    aria-label={`Accept application from ${application.user?.name}`}
                                  >
                                    {isProcessing ? '⏳ Processing...' : '✓ Accept'}
                                  </button>
                                </Tooltip>
                                <Tooltip text="Decline this application">
                                  <button
                                    onClick={() =>
                                      handleApplicationStatusUpdate(
                                        selectedProject.id,
                                        application.id,
                                        'rejected'
                                      )
                                    }
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-3 bg-red-500 border-2 border-dreamxec-navy rounded-lg font-bold text-white font-display hover:scale-105 transition-all text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    aria-label={`Reject application from ${application.user?.name}`}
                                  >
                                    {isProcessing ? '⏳ Processing...' : '✗ Reject'}
                                  </button>
                                </Tooltip>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Modal footer */}
            <div className="flex-shrink-0 p-4 border-t-2 sm:border-t-4 border-dreamxec-navy bg-dreamxec-beige">
              <button
                onClick={handleCloseModal}
                className="w-full px-4 py-3 bg-dreamxec-cream border-2 sm:border-3 border-dreamxec-navy rounded-xl font-bold text-dreamxec-navy font-display hover:bg-dreamxec-orange hover:text-white transition-all text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-dreamxec-orange focus:ring-offset-2"
                aria-label="Close applications modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { StarDecoration } from './icons/StarDecoration';
import type { Project } from '../types';

interface DonorProjectsProps {
  projects: Project[];
  onBack: () => void;
  onUpdateApplicationStatus: (
    projectId: string,
    applicationId: string,
    status: 'accepted' | 'rejected'
  ) => void;
}

export default function DonorProjects({
  projects,
  onBack,
  onUpdateApplicationStatus,
}: DonorProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);

  const handleViewApplications = (project: Project) => {
    setSelectedProject(project);
    setShowApplicationsModal(true);
  };

  const handleCloseModal = () => {
    setShowApplicationsModal(false);
    setSelectedProject(null);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-dreamxec-cream relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <StarDecoration className="absolute top-20 left-10 w-12 h-12 text-dreamxec-saffron opacity-20 animate-spin-slow" />
        <StarDecoration className="absolute top-40 right-20 w-16 h-16 text-dreamxec-green opacity-15 animate-bounce-slow" />
        <StarDecoration className="absolute bottom-32 left-1/4 w-10 h-10 text-dreamxec-orange opacity-25" />
        
        <img
          src="https://c.animaapp.com/mhd6hm18SGcCN3/assets/image-28.svg"
          alt="Decorative"
          className="absolute top-10 right-10 w-24 h-24 opacity-10 animate-float"
        />
        <img
          src="https://c.animaapp.com/mhd6hm18SGcCN3/assets/image-30.svg"
          alt="Decorative"
          className="absolute bottom-10 left-10 w-32 h-32 opacity-10 animate-float-delayed"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-dreamxec-navy font-bold font-sans text-lg hover:text-dreamxec-orange transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-dreamxec-navy font-display mb-4">
            My Projects 📋
          </h1>
          <p className="text-xl text-dreamxec-navy font-sans opacity-80">
            Manage your projects and review student applications
          </p>
        </div>

        {/* Projects grid */}
        {projects.length === 0 ? (
          <div className="card-pastel-offwhite rounded-2xl border-5 border-dreamxec-navy p-12 shadow-pastel-card text-center max-w-2xl mx-auto">
            <div className="card-tricolor-tag"></div>
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-3xl font-bold text-dreamxec-navy font-display mb-4">
              No Projects Yet
            </h2>
            <p className="text-dreamxec-navy font-sans text-lg mb-6">
              You haven't created any projects yet. Start by creating your first project!
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-dreamxec-green border-4 border-dreamxec-navy rounded-xl font-bold text-white text-lg font-display hover:bg-dreamxec-orange hover:scale-105 transition-all shadow-pastel-saffron"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const pendingCount = project.interestedUsers.filter(
                (app) => app.status === 'pending'
              ).length;
              const acceptedCount = project.interestedUsers.filter(
                (app) => app.status === 'accepted'
              ).length;

              return (
                <div
                  key={project.id}
                  className="card-pastel-offwhite rounded-2xl border-5 border-dreamxec-navy p-6 shadow-pastel-card hover:shadow-pastel-saffron transition-all duration-300"
                >
                  <div className="card-tricolor-tag"></div>

                  {/* Status Badge */}
                  <div className="mb-3">
                    {project.status === 'pending' && (
                      <span className="inline-block px-4 py-2 bg-dreamxec-saffron border-3 border-dreamxec-navy rounded-full text-dreamxec-navy font-sans text-sm font-bold">
                        ⏳ Pending Approval
                      </span>
                    )}
                    {project.status === 'rejected' && (
                      <span className="inline-block px-4 py-2 bg-red-400 border-3 border-dreamxec-navy rounded-full text-white font-sans text-sm font-bold">
                        ❌ Rejected
                      </span>
                    )}
                    {project.status === 'approved' && (
                      <span className="inline-block px-4 py-2 bg-dreamxec-green border-3 border-dreamxec-navy rounded-full text-white font-sans text-sm font-bold">
                        ✅ Approved
                      </span>
                    )}
                  </div>

                  {/* Project info */}
                  <h3 className="text-2xl font-bold text-dreamxec-navy font-display mb-2">
                    {project.title}
                  </h3>
                  <p className="text-dreamxec-orange font-bold font-sans mb-3">
                    {project.companyName}
                  </p>
                  <p className="text-dreamxec-navy font-sans mb-4 line-clamp-3">
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
                    <div className="flex flex-wrap gap-2">
                      {project.skillsRequired.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-dreamxec-cream border-2 border-dreamxec-navy rounded-full text-dreamxec-navy font-sans text-sm font-bold"
                        >
                          {skill}
                        </span>
                      ))}
                      {project.skillsRequired.length > 3 && (
                        <span className="px-3 py-1 bg-dreamxec-beige border-2 border-dreamxec-navy rounded-full text-dreamxec-navy font-sans text-sm font-bold">
                          +{project.skillsRequired.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mb-4 text-dreamxec-navy font-sans text-sm">
                    <p>
                      <strong>Timeline:</strong> {formatDate(project.timeline.startDate)} -{' '}
                      {formatDate(project.timeline.endDate)}
                    </p>
                  </div>

                  {/* Applications stats - Only show for approved projects */}
                  {project.status === 'approved' && (
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1 bg-dreamxec-saffron/30 border-2 border-dreamxec-navy rounded-lg p-2 text-center">
                        <div className="text-2xl font-bold text-dreamxec-navy font-display">
                          {pendingCount}
                        </div>
                        <div className="text-xs text-dreamxec-navy font-sans font-bold">
                          Pending
                        </div>
                      </div>
                      <div className="flex-1 bg-dreamxec-green/30 border-2 border-dreamxec-navy rounded-lg p-2 text-center">
                        <div className="text-2xl font-bold text-dreamxec-navy font-display">
                          {acceptedCount}
                        </div>
                        <div className="text-xs text-dreamxec-navy font-sans font-bold">
                          Accepted
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action button based on status */}
                  {project.status === 'approved' ? (
                    <button
                      onClick={() => handleViewApplications(project)}
                      className="w-full px-4 py-3 bg-dreamxec-orange border-3 border-dreamxec-navy rounded-xl font-bold text-white font-display hover:bg-dreamxec-green hover:scale-105 transition-all shadow-pastel-card"
                    >
                      View Interested Students ({project.interestedUsers.length})
                    </button>
                  ) : project.status === 'pending' ? (
                    <div className="w-full px-4 py-3 bg-dreamxec-saffron/30 border-3 border-dreamxec-navy rounded-xl text-center">
                      <p className="text-dreamxec-navy font-sans font-bold">
                        ⏳ Waiting for admin approval
                      </p>
                    </div>
                  ) : (
                    <div className="w-full px-4 py-3 bg-red-100 border-3 border-dreamxec-navy rounded-xl text-center">
                      <p className="text-red-700 font-sans font-bold">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-pastel-offwhite rounded-2xl border-5 border-dreamxec-navy max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-pastel-saffron">
            <div className="card-tricolor-tag"></div>
            
            {/* Modal header */}
            <div className="p-6 border-b-4 border-dreamxec-navy bg-dreamxec-beige">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-dreamxec-navy font-display mb-2">
                    {selectedProject.title}
                  </h2>
                  <p className="text-dreamxec-orange font-bold font-sans">
                    {selectedProject.companyName}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-dreamxec-navy hover:text-dreamxec-orange transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Applications list */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {selectedProject.interestedUsers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👥</div>
                  <p className="text-dreamxec-navy font-sans text-lg">
                    No applications yet. Students will appear here once they apply.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedProject.interestedUsers.map((application) => (
                    <div
                      key={application.id}
                      className={`border-4 rounded-xl p-4 ${
                        application.status === 'accepted'
                          ? 'bg-dreamxec-green/10 border-dreamxec-green'
                          : application.status === 'rejected'
                          ? 'bg-red-50 border-red-400'
                          : 'bg-white border-dreamxec-navy'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-xl font-bold text-dreamxec-navy font-display">
                            {application.userName}
                          </h4>
                          <p className="text-dreamxec-navy font-sans text-sm opacity-70">
                            {application.userEmail}
                          </p>
                          <p className="text-dreamxec-navy font-sans text-xs opacity-60 mt-1">
                            Applied on {formatDate(application.appliedAt)}
                          </p>
                        </div>
                        <div>
                          {application.status === 'pending' ? (
                            <span className="px-3 py-1 bg-dreamxec-saffron border-2 border-dreamxec-navy rounded-full text-dreamxec-navy font-sans text-sm font-bold">
                              Pending
                            </span>
                          ) : application.status === 'accepted' ? (
                            <span className="px-3 py-1 bg-dreamxec-green border-2 border-dreamxec-navy rounded-full text-white font-sans text-sm font-bold">
                              Accepted
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-500 border-2 border-dreamxec-navy rounded-full text-white font-sans text-sm font-bold">
                              Rejected
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-dreamxec-navy font-sans">
                          <strong>Cover Letter:</strong> {application.coverLetter}
                        </p>
                        {application.skills && application.skills.length > 0 && (
                          <p className="text-dreamxec-navy font-sans mt-2">
                            <strong>Skills:</strong> {application.skills.join(', ')}
                          </p>
                        )}
                      </div>

                      {application.status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              onUpdateApplicationStatus(
                                selectedProject.id,
                                application.id,
                                'accepted'
                              )
                            }
                            className="flex-1 px-4 py-2 bg-dreamxec-green border-3 border-dreamxec-navy rounded-lg font-bold text-white font-display hover:scale-105 transition-all"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              onUpdateApplicationStatus(
                                selectedProject.id,
                                application.id,
                                'rejected'
                              )
                            }
                            className="flex-1 px-4 py-2 bg-red-500 border-3 border-dreamxec-navy rounded-lg font-bold text-white font-display hover:scale-105 transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="p-6 border-t-4 border-dreamxec-navy bg-dreamxec-beige">
              <button
                onClick={handleCloseModal}
                className="w-full px-6 py-3 bg-dreamxec-cream border-4 border-dreamxec-navy rounded-xl font-bold text-dreamxec-navy font-display hover:bg-dreamxec-orange hover:text-white transition-all"
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

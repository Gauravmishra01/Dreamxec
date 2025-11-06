import { useState } from 'react';
import { StarDecoration } from './icons/StarDecoration';
import type { Project } from '../types';

interface BrowseProjectsProps {
  projects: Project[];
  currentUserId?: string;
  onApply: (projectId: string, coverLetter: string, skills: string[]) => Promise<void>;
  userApplications?: string[]; // Array of project IDs user has applied to
}

export default function BrowseProjects({
  projects,
  currentUserId: _currentUserId,
  onApply,
  userApplications = [],
}: BrowseProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleApplyClick = (project: Project) => {
    setSelectedProject(project);
    setShowApplicationModal(true);
    setCoverLetter('');
    setSkillsInput('');
    setError('');
  };

  const handleCloseModal = () => {
    setShowApplicationModal(false);
    setSelectedProject(null);
    setCoverLetter('');
    setSkillsInput('');
    setError('');
  };

  const handleSubmitApplication = async () => {
    if (!selectedProject) return;

    // Validation
    if (!coverLetter.trim()) {
      setError('Cover letter is required');
      return;
    }

    if (coverLetter.trim().length < 50) {
      setError('Cover letter must be at least 50 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const skills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      
      await onApply(selectedProject.id, coverLetter, skills);
      handleCloseModal();
    } catch (error) {
      console.error('Failed to submit application:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const hasApplied = (projectId: string) => {
    return userApplications.includes(projectId);
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
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-dreamxec-navy font-display mb-4">
            Browse Projects 🚀
          </h1>
          <p className="text-xl text-dreamxec-navy font-sans opacity-80">
            Find exciting project opportunities from companies and donors
          </p>
        </div>

        {/* Projects grid */}
        {projects.length === 0 ? (
          <div className="card-pastel-offwhite rounded-2xl border-5 border-dreamxec-navy p-12 shadow-pastel-card text-center max-w-2xl mx-auto">
            <div className="card-tricolor-tag"></div>
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-3xl font-bold text-dreamxec-navy font-display mb-4">
              No Projects Available
            </h2>
            <p className="text-dreamxec-navy font-sans text-lg">
              There are no projects available at the moment. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const applied = hasApplied(project.id);
              
              return (
                <div
                  key={project.id}
                  className="card-pastel-offwhite rounded-2xl border-5 border-dreamxec-navy p-6 shadow-pastel-card hover:shadow-pastel-saffron transition-all duration-300"
                >
                  <div className="card-tricolor-tag"></div>

                  {/* Project info */}
                  <h3 className="text-2xl font-bold text-dreamxec-navy font-display mb-2">
                    {project.title}
                  </h3>
                  <p className="text-dreamxec-orange font-bold font-sans mb-3 text-lg">
                    🏢 {project.companyName}
                  </p>
                  <p className="text-dreamxec-navy font-sans mb-4 line-clamp-4">
                    {project.description}
                  </p>

                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-dreamxec-navy font-bold font-sans text-sm mb-2">
                      Skills Required:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.skillsRequired.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-dreamxec-green/20 border-2 border-dreamxec-navy rounded-full text-dreamxec-navy font-sans text-sm font-bold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mb-4 p-3 bg-dreamxec-beige/50 border-2 border-dreamxec-navy rounded-lg">
                    <p className="text-dreamxec-navy font-sans text-sm">
                      <strong>📅 Timeline:</strong>
                    </p>
                    <p className="text-dreamxec-navy font-sans text-sm">
                      {formatDate(project.timeline.startDate)} - {formatDate(project.timeline.endDate)}
                    </p>
                  </div>

                  {/* Applications count */}
                  <div className="mb-4 text-dreamxec-navy font-sans text-sm opacity-70">
                    <p>👥 {project.interestedUsers.length} student(s) applied</p>
                  </div>

                  {/* Apply button */}
                  {applied ? (
                    <button
                      disabled
                      className="w-full px-4 py-3 bg-dreamxec-beige border-3 border-dreamxec-navy rounded-xl font-bold text-dreamxec-navy font-display cursor-not-allowed opacity-60"
                    >
                      ✓ Already Applied
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApplyClick(project)}
                      className="w-full px-4 py-3 bg-dreamxec-green border-3 border-dreamxec-navy rounded-xl font-bold text-white font-display hover:bg-dreamxec-orange hover:scale-105 transition-all shadow-pastel-card"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-pastel-offwhite rounded-2xl border-5 border-dreamxec-navy max-w-2xl w-full shadow-pastel-saffron">
            <div className="card-tricolor-tag"></div>
            
            {/* Modal header */}
            <div className="p-6 border-b-4 border-dreamxec-navy bg-dreamxec-beige">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-dreamxec-navy font-display mb-2">
                    Apply to Project
                  </h2>
                  <p className="text-dreamxec-orange font-bold font-sans text-lg">
                    {selectedProject.title}
                  </p>
                  <p className="text-dreamxec-navy font-sans text-sm">
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

            {/* Modal body */}
            <div className="p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-100 border-3 border-red-500 rounded-xl">
                  <p className="text-red-700 font-sans font-bold">{error}</p>
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="coverLetter" className="block text-dreamxec-navy font-bold font-sans text-lg mb-2">
                  Cover Letter * <span className="text-sm font-normal opacity-70">(min. 50 characters)</span>
                </label>
                <textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => {
                    setCoverLetter(e.target.value);
                    setError('');
                  }}
                  placeholder="Tell the company why you're a good fit for this project, your relevant skills, and what you hope to contribute..."
                  rows={8}
                  minLength={50}
                  className="w-full px-4 py-3 border-4 border-dreamxec-navy rounded-xl font-sans text-dreamxec-navy text-lg focus:outline-none focus:ring-4 focus:ring-dreamxec-orange/30 transition-all resize-none"
                />
                <p className="mt-1 text-sm text-dreamxec-navy opacity-60 font-sans">
                  {coverLetter.length}/50 characters minimum
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="skills" className="block text-dreamxec-navy font-bold font-sans text-lg mb-2">
                  Your Skills <span className="text-sm font-normal opacity-70">(optional)</span>
                </label>
                <input
                  type="text"
                  id="skills"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g., Teaching, Mentoring, Communication (comma-separated)"
                  className="w-full px-4 py-3 border-4 border-dreamxec-navy rounded-xl font-sans text-dreamxec-navy text-lg focus:outline-none focus:ring-4 focus:ring-dreamxec-orange/30 transition-all"
                />
              </div>

              {/* Project details recap */}
              <div className="bg-dreamxec-cream/50 border-3 border-dreamxec-navy rounded-xl p-4 mb-6">
                <h4 className="font-bold text-dreamxec-navy font-sans mb-2">Project Summary:</h4>
                <p className="text-dreamxec-navy font-sans text-sm mb-2">
                  <strong>Skills Required:</strong> {selectedProject.skillsRequired.join(', ')}
                </p>
                <p className="text-dreamxec-navy font-sans text-sm">
                  <strong>Timeline:</strong> {formatDate(selectedProject.timeline.startDate)} - {formatDate(selectedProject.timeline.endDate)}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-dreamxec-cream border-4 border-dreamxec-navy rounded-xl font-bold text-dreamxec-navy font-display hover:bg-dreamxec-beige transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitApplication}
                  disabled={isSubmitting || coverLetter.trim().length < 50}
                  className="flex-1 px-6 py-3 bg-dreamxec-green border-4 border-dreamxec-navy rounded-xl font-bold text-white font-display hover:bg-dreamxec-orange hover:scale-105 transition-all shadow-pastel-saffron disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

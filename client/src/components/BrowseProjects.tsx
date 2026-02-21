import { useState } from 'react';
import type { Project } from '../types';
import { FooterContent } from '@/sections/Footer/components/FooterContent';

interface BrowseProjectsProps {
  projects: Project[];
  role: string;
  currentUserId?: string;
  onApply: (projectId: string, coverLetter: string, skills: string[]) => Promise<void>;
  userApplications?: string[];
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const getTimelineDisplay = (
  timeline: string | { startDate: Date | string; endDate: Date | string } | null
) => {
  if (!timeline) return 'Not specified';
  if (typeof timeline === 'string') return timeline;
  return `${formatDate(timeline.startDate)} — ${formatDate(timeline.endDate)}`;
};

/* ─────────────────────────────────────────────
   PROJECT CARD
───────────────────────────────────────────── */
const cardShadows = ['#FF7F00', '#0B9C2C', '#000080'];

function ProjectCard({
  project,
  index,
  applied,
  onApply,
}: {
  project: Project;
  index: number;
  applied: boolean;
  onApply: (project: Project) => void;
}) {
  const shadow = cardShadows[index % 3];

  return (
    <div
      className="bg-white flex flex-col transition-all duration-200 hover:translate-x-[-3px] hover:translate-y-[-3px]"
      style={{ border: '3px solid #000080', boxShadow: `6px 6px 0 ${shadow}` }}
    >
      {/* Top stripe */}
      <div className="h-2" style={{ background: shadow }} />

      <div className="flex flex-col flex-1 p-4 sm:p-5 md:p-6">

        {/* Company */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white"
            style={{ background: '#000080', border: '2px solid #000080' }}
          >
            🏢 {project.companyName}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-black text-dreamxec-navy uppercase tracking-tight leading-snug mb-3">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-dreamxec-navy/70 font-medium leading-relaxed mb-4 line-clamp-4">
          {project.description}
        </p>

        {/* Skills */}
        <div className="mb-4">
          <p className="text-[10px] font-black text-dreamxec-navy/50 uppercase tracking-widest mb-2">Skills Required</p>
          <div className="flex flex-wrap gap-1.5">
            {project.skillsRequired.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-1 text-[10px] sm:text-xs font-black text-dreamxec-navy uppercase tracking-wide"
                style={{ border: '2px solid #0B9C2C', background: '#f0fdf4', color: '#166534' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Timeline + applicants */}
        <div className="flex flex-col gap-2 mb-5 mt-auto">
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{ border: '2px dashed #000080', background: '#f9fafb' }}
          >
            <span className="text-sm">📅</span>
            <span className="text-xs font-black text-dreamxec-navy uppercase tracking-wide">
              {getTimelineDisplay(project.timeline)}
            </span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{ border: '2px solid #FF7F00', background: '#fff7ed' }}
          >
            <span className="text-sm">👥</span>
            <span className="text-xs font-black text-dreamxec-orange uppercase tracking-wide">
              {project.interestedUsers?.length ?? 0} student{(project.interestedUsers?.length ?? 0) !== 1 ? 's' : ''} applied
            </span>
          </div>
        </div>

        {/* Apply button */}
        {applied ? (
          <div
            className="w-full py-3 text-center font-black text-xs sm:text-sm uppercase tracking-widest text-green-700"
            style={{ border: '3px solid #0B9C2C', background: '#f0fdf4' }}
          >
            ✓ Already Applied
          </div>
        ) : (
          <button
            onClick={() => onApply(project)}
            className="w-full py-3 font-black text-white text-xs sm:text-sm uppercase tracking-widest transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px]"
            style={{
              background: 'linear-gradient(135deg, #0B9C2C 0%, #16a34a 100%)',
              border: '3px solid #000080',
              boxShadow: '4px 4px 0 #000080',
            }}
          >
            Apply Now →
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function BrowseProjects({
  projects,
  currentUserId: _currentUserId,
  role,
  onApply,
  userApplications = [],
}: BrowseProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const hasApplied = (id: string) => userApplications.includes(id);

  const handleApplyClick = (project: Project) => {
    if (hasApplied(project.id)) return;
    setSelectedProject(project);
    setShowModal(true);
    setCoverLetter('');
    setSkillsInput('');
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    setCoverLetter('');
    setSkillsInput('');
    setError('');
  };

  const handleSubmit = async () => {
    if (!selectedProject) return;
    if (hasApplied(selectedProject.id)) { setError('You have already applied to this project'); return; }
    if (!coverLetter.trim()) { setError('Cover letter is required'); return; }
    if (coverLetter.trim().length < 50) { setError('Cover letter must be at least 50 characters'); return; }

    setIsSubmitting(true);
    setError('');
    try {
      const skills = skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
      await onApply(selectedProject.id, coverLetter, skills);
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = coverLetter.trim().length;
  const charOk = charCount >= 50;

  return (
    <div className="min-h-screen bg-dreamxec-cream relative overflow-hidden">

      {/* Decorative raw shapes */}
      <div className="fixed top-28 left-6 pointer-events-none opacity-10">
        <div className="w-12 h-12 border-4 border-dreamxec-orange rotate-12" />
      </div>
      <div className="fixed bottom-32 right-8 pointer-events-none opacity-10">
        <div className="w-10 h-10 bg-dreamxec-green rotate-45" />
      </div>
      <div className="fixed top-1/2 left-10 pointer-events-none opacity-8">
        <div className="w-5 h-5 bg-dreamxec-navy" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 md:py-12">

        {/* ── HEADER ── */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-white"
            style={{ background: '#000080', border: '2px solid #000080' }}
          >
            🚀 DreamXec Opportunities
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-5">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black text-dreamxec-navy uppercase tracking-tight leading-none"
            >
              Explore{' '}
              <span
                className="inline-block px-2"
                style={{ background: '#FF7F00', color: '#000080' }}
              >
                Opportunities
              </span>
            </h1>

            {userApplications.length > 0 && (
              <div
                className="inline-flex items-center gap-2 px-3 py-2 self-start sm:self-auto"
                style={{ border: '3px solid #FF7F00', background: '#fff7ed', boxShadow: '3px 3px 0 #FF7F00' }}
              >
                <span className="text-sm">📝</span>
                <span className="text-xs font-black text-dreamxec-orange uppercase tracking-wide">
                  {userApplications.length} Applied
                </span>
              </div>
            )}
          </div>

          <p className="mt-3 text-sm sm:text-base text-dreamxec-navy/60 font-bold max-w-xl">
            Find exciting project opportunities from companies and donors.
          </p>

          {/* Count strip */}
          {projects.length > 0 && (
            <div className="mt-5 flex items-center gap-3">
              <span className="text-xs font-black text-dreamxec-navy/50 uppercase tracking-widest">Showing</span>
              <span
                className="px-3 py-1.5 text-xs font-black text-white uppercase tracking-wide"
                style={{ background: '#FF7F00', border: '2px solid #000080' }}
              >
                {projects.length} Project{projects.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* ── EMPTY STATE ── */}
        {projects.length === 0 ? (
          <div
            className="py-16 sm:py-20 text-center bg-white max-w-lg mx-auto"
            style={{ border: '4px solid #000080', boxShadow: '8px 8px 0 #FF7F00' }}
          >
            <div className="flex h-2 mb-8">
              <div className="flex-1 bg-[#FF7F00]" />
              <div className="flex-1 bg-[#fff] border-y-2 border-[#000080]" />
              <div className="flex-1 bg-[#0B9C2C]" />
            </div>
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-2xl sm:text-3xl font-black text-dreamxec-navy uppercase tracking-tight mb-3">
              No Projects Yet
            </h2>
            <p className="text-dreamxec-navy/60 font-bold text-sm px-6">
              There are no projects available at the moment. Check back soon!
            </p>
          </div>
        ) : (
          /* ── GRID ── */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                applied={hasApplied(project.id)}
                onApply={handleApplyClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* ════════════════════════════════
          APPLICATION MODAL
      ════════════════════════════════ */}
      {showModal && selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={e => { if (e.target === e.currentTarget) handleCloseModal(); }}
        >
          <div
            className="bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto"
            style={{ border: '4px solid #000080', boxShadow: '10px 10px 0 #FF7F00' }}
          >
            {/* Modal header */}
            <div className="flex items-stretch" style={{ borderBottom: '3px solid #000080' }}>
              {/* Accent stripe */}
              <div className="w-2.5 bg-[#FF7F00] flex-shrink-0" />

              <div className="flex-1 px-4 sm:px-5 py-3 sm:py-4">
                <p className="text-[10px] font-black text-dreamxec-navy/50 uppercase tracking-[0.2em] mb-0.5">
                  Apply to Project
                </p>
                <h2 className="text-base sm:text-lg md:text-xl font-black text-dreamxec-navy uppercase tracking-tight leading-snug break-words pr-2">
                  {selectedProject.title}
                </h2>
                <p className="text-xs font-bold text-dreamxec-orange mt-0.5 uppercase tracking-wide">
                  {selectedProject.companyName}
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                className="flex-shrink-0 w-12 sm:w-14 flex items-center justify-center font-black text-white text-lg transition-colors hover:opacity-80"
                style={{ background: '#000080', borderLeft: '3px solid #000080' }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5">

              {/* Error */}
              {error && (
                <div
                  className="p-3 flex items-center gap-2 text-red-700 font-bold text-xs sm:text-sm"
                  style={{ border: '3px solid #dc2626', background: '#fef2f2', boxShadow: '3px 3px 0 #dc2626' }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Cover Letter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-dreamxec-navy uppercase tracking-widest">
                    Cover Letter <span className="text-red-600">*</span>
                  </label>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 ${charOk
                      ? 'text-green-700 bg-green-50'
                      : 'text-dreamxec-orange bg-orange-50'
                      }`}
                    style={{ border: `2px solid ${charOk ? '#0B9C2C' : '#FF7F00'}` }}
                  >
                    {charCount}/50 min
                  </span>
                </div>
                <textarea
                  value={coverLetter}
                  onChange={e => { setCoverLetter(e.target.value); setError(''); }}
                  placeholder="Tell the company why you're a good fit for this project, your relevant experience, and what you hope to contribute..."
                  rows={6}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-dreamxec-navy bg-white resize-none focus:outline-none transition-all"
                  style={{
                    border: `3px solid ${charOk ? '#0B9C2C' : '#000080'}`,
                    boxShadow: `3px 3px 0 ${charOk ? '#0B9C2C' : '#FF7F00'}`,
                  }}
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-black text-dreamxec-navy uppercase tracking-widest mb-2">
                  Your Skills <span className="text-dreamxec-navy/40 normal-case font-bold text-[10px]">(optional, comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={e => setSkillsInput(e.target.value)}
                  placeholder="e.g., Teaching, Mentoring, Communication"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-dreamxec-navy bg-white focus:outline-none transition-all"
                  style={{ border: '3px solid #000080', boxShadow: '3px 3px 0 #0B9C2C' }}
                />
              </div>

              {/* Project recap */}
              <div
                className="p-3 sm:p-4"
                style={{ border: '2px dashed #000080', background: '#f9fafb' }}
              >
                <p className="text-[10px] font-black text-dreamxec-navy/50 uppercase tracking-widest mb-2">Project Summary</p>
                <p className="text-xs sm:text-sm font-bold text-dreamxec-navy mb-1">
                  <span className="text-dreamxec-navy/50">Skills:</span>{' '}
                  {selectedProject.skillsRequired.join(', ')}
                </p>
                <p className="text-xs sm:text-sm font-bold text-dreamxec-navy">
                  <span className="text-dreamxec-navy/50">Timeline:</span>{' '}
                  {getTimelineDisplay(selectedProject.timeline)}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-2.5 sm:py-3 font-black text-dreamxec-navy text-xs sm:text-sm uppercase tracking-widest transition-all hover:bg-dreamxec-navy hover:text-white"
                  style={{ border: '3px solid #000080', background: '#fff', boxShadow: '3px 3px 0 #000080' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !charOk}
                  className="flex-1 py-2.5 sm:py-3 font-black text-white text-xs sm:text-sm uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: !charOk || isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #0B9C2C, #16a34a)',
                    border: '3px solid #000080',
                    boxShadow: charOk && !isSubmitting ? '4px 4px 0 #000080' : 'none',
                  }}
                >
                  {isSubmitting ? '⏳ Submitting...' : 'Submit Application →'}
                </button>
              </div>
            </div>

            {/* Bottom tricolor bar */}
            <div className="flex h-1.5">
              <div className="flex-1 bg-[#FF7F00]" />
              <div className="flex-1 bg-[#000080]" />
              <div className="flex-1 bg-[#0B9C2C]" />
            </div>
          </div>
        </div>
      )}
      <FooterContent />
    </div>
  );
}
import { StarDecoration } from './icons/StarDecoration';

interface DonorDashboardProps {
  donorName: string;
  projectsCount: number;
  onCreateProject: () => void;
  onViewProjects: () => void;
}

export default function DonorDashboard({
  donorName,
  projectsCount,
  onCreateProject,
  onViewProjects,
}: DonorDashboardProps) {
  return (
    <div className="min-h-screen bg-dreamxec-cream relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <StarDecoration className="absolute top-20 left-10 w-12 h-12 text-dreamxec-saffron opacity-20 animate-spin-slow" />
        <StarDecoration className="absolute top-40 right-20 w-16 h-16 text-dreamxec-green opacity-15 animate-bounce-slow" />
        <StarDecoration className="absolute bottom-32 left-1/4 w-10 h-10 text-dreamxec-orange opacity-25" />
        <StarDecoration className="absolute bottom-20 right-1/3 w-14 h-14 text-dreamxec-saffron opacity-20 animate-pulse-slow" />
        
        {/* Animated background images */}
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
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Welcome header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-dreamxec-navy font-display mb-4">
            Welcome back, {donorName}! 👋
          </h1>
          <p className="text-xl text-dreamxec-navy font-sans opacity-80">
            Manage your projects and connect with talented students
          </p>
        </div>

        {/* Stats card */}
        <div className="mb-12 max-w-md mx-auto">
          <div className="card-pastel-offwhite rounded-2xl border-5 border-dreamxec-navy p-8 shadow-pastel-card">
            <div className="card-tricolor-tag"></div>
            <div className="text-center">
              <div className="text-6xl font-bold text-dreamxec-orange font-display mb-2">
                {projectsCount}
              </div>
              <div className="text-xl text-dreamxec-navy font-sans font-bold">
                {projectsCount === 1 ? 'Project Created' : 'Projects Created'}
              </div>
            </div>
          </div>
        </div>

        {/* Action cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create Project Card */}
          <button
            onClick={onCreateProject}
            className="card-pastel-offwhite rounded-2xl border-5 border-dreamxec-navy p-8 shadow-pastel-card hover:shadow-pastel-saffron hover:scale-105 transition-all duration-300 text-left group"
          >
            <div className="card-tricolor-tag"></div>
            
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-dreamxec-green border-4 border-dreamxec-navy rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <h2 className="text-3xl font-bold text-dreamxec-navy font-display mb-3 text-center">
              Create New Project
            </h2>
            <p className="text-dreamxec-navy font-sans text-lg text-center opacity-80">
              Post a new project opportunity and find talented students to collaborate with
            </p>

            {/* Arrow indicator */}
            <div className="mt-6 flex justify-center">
              <div className="text-dreamxec-orange group-hover:translate-x-2 transition-transform duration-300">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* View Projects Card */}
          <button
            onClick={onViewProjects}
            className="card-pastel-offwhite rounded-2xl border-5 border-dreamxec-navy p-8 shadow-pastel-card hover:shadow-pastel-saffron hover:scale-105 transition-all duration-300 text-left group"
          >
            <div className="card-tricolor-tag"></div>
            
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-dreamxec-orange border-4 border-dreamxec-navy rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <h2 className="text-3xl font-bold text-dreamxec-navy font-display mb-3 text-center">
              View My Projects
            </h2>
            <p className="text-dreamxec-navy font-sans text-lg text-center opacity-80">
              Manage your existing projects and review applications from interested students
            </p>

            {/* Badge with count */}
            {projectsCount > 0 && (
              <div className="mt-4 flex justify-center">
                <div className="bg-dreamxec-saffron border-3 border-dreamxec-navy rounded-full px-4 py-2">
                  <span className="text-dreamxec-navy font-bold font-sans">
                    {projectsCount} {projectsCount === 1 ? 'Project' : 'Projects'}
                  </span>
                </div>
              </div>
            )}

            {/* Arrow indicator */}
            <div className="mt-6 flex justify-center">
              <div className="text-dreamxec-orange group-hover:translate-x-2 transition-transform duration-300">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Info section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border-3 border-dreamxec-navy p-8 shadow-pastel-card">
            <h3 className="text-2xl font-bold text-dreamxec-navy font-display mb-4 text-center">
              💡 How It Works
            </h3>
            <div className="space-y-4 text-dreamxec-navy font-sans text-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <p><strong>Create a Project:</strong> Define your project requirements, skills needed, and timeline</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <p><strong>Students Apply:</strong> Talented students will review and apply to your projects</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <p><strong>Review Applications:</strong> View student profiles and select the best fit</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <p><strong>Collaborate:</strong> Work together with students to bring your project to life</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { UserRole } from "../../../types";

interface DesktopMenuProps {
  currentUser?: { name: string; role: UserRole } | null;
  onLogin?: () => void;
}

export const DesktopMenu = ({ currentUser, onLogin }: DesktopMenuProps) => {
  return (
    <nav className="flex items-center text-dreamxec-berkeley-blue gap-6">
      {/* Always show these links */}
      <a
        href="/"
        className="text-dreamxec-berkeley-blue font-bold text-lg hover:text-dreamxec-orange transition-colors font-display"
      >
        HOME
      </a>

      <a
        href="/campaigns"
        className="text-dreamxec-berkeley-blue font-bold text-lg hover:text-dreamxec-orange transition-colors font-display"
      >
        CAMPAIGNS
      </a>

      <a
        href="/about"
        className="text-dreamxec-berkeley-blue font-bold text-lg hover:text-dreamxec-orange transition-colors font-display"
      >
        ABOUT US
      </a>

      {/* Role-specific links */}
      {currentUser?.role === 'student' && (
        <>
          <a
            href="/dashboard"
            className="text-dreamxec-navy font-bold text-lg hover:text-dreamxec-orange transition-colors font-display"
          >
            DASHBOARD
          </a>
          <a
            href="/projects"
            className="text-dreamxec-navy font-bold text-lg hover:text-dreamxec-orange transition-colors font-display"
          >
            OPPORTUNITIES
          </a>
        </>
      )}

      {currentUser?.role === 'admin' && (
        <a
          href="/admin"
          className="text-dreamxec-navy font-bold text-lg hover:text-dreamxec-orange transition-colors font-display"
        >
          ADMIN
        </a>
      )}

      {currentUser?.role === 'donor' && (
        <a
          href="/donor/dashboard"
          className="text-dreamxec-navy font-bold text-lg hover:text-dreamxec-orange transition-colors font-display"
        >
          DASHBOARD
        </a>
      )}

      {/* Sign In Button for guests */}
      {!currentUser && (
        <button
          onClick={onLogin}
          className="bg-dreamxec-orange border-2 border-dreamxec-navy px-8 py-3 rounded-xl font-bold text-white hover:bg-dreamxec-saffron transition-colors font-display shadow-md text-lg"
        >
          Sign In
        </button>
      )}
    </nav>
  );
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../../components/Logo";
import { MobileMenuButton } from "../../../components/MobileMenuButton";
import { DesktopMenu } from "./DesktopMenu";
import type { UserRole } from "../../../types";

interface NavbarProps {
  currentUser?: { name: string; role: UserRole } | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Navbar = ({ currentUser, onLogin, onLogout }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="relative box-border caret-transparent grid grow grid-cols-[39.9983%_20.0008%_40.0055%] grid-rows-[minmax(max-content,100%)] pointer-events-none pt-[0%] px-[0%] md:grid-cols-[10%_70%_20%] md:grid-rows-[minmax(73.1996px,auto)]">
        {/* Sign In / User Profile & Logout Button */}
        {currentUser ? (
          <div className="relative self-start caret-transparent hidden col-end-2 col-start-1 row-end-2 row-start-1 h-[89.5px] justify-self-end max-h-[99999px] max-w-[99999px] pointer-events-auto w-[232.403px] ml-[0%] mr-[1.67531%] my-[0%] md:self-center md:flex md:items-center md:gap-3 md:col-end-4 md:col-start-3 md:mr-[-0.0056016%] md:w-[99.9939%]">
            {/* Show Profile button only for students */}
            {currentUser.role === 'student' && (
              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-3 bg-dreamxec-beige border-3 border-dreamxec-navy rounded-2xl px-4 py-3 shadow-pastel-saffron hover:bg-dreamxec-cream hover:shadow-pastel-card transition-all cursor-pointer"
              >
                <div className="w-8 h-8 bg-dreamxec-orange border-2 border-dreamxec-navy rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-dreamxec-navy font-bold text-sm font-sans">
                    {currentUser.name}
                  </span>
                  <span className="text-dreamxec-navy text-xs opacity-70 font-sans">
                    Student
                  </span>
                </div>
              </button>
            )}
            {/* Show just name for donors/admins */}
            {currentUser.role !== 'student' && (
              <div className="flex items-center gap-3 bg-dreamxec-beige border-3 border-dreamxec-navy rounded-2xl px-4 py-3 shadow-pastel-saffron">
                <div className="w-8 h-8 bg-dreamxec-orange border-2 border-dreamxec-navy rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-dreamxec-navy font-bold text-sm font-sans">
                    {currentUser.name}
                  </span>
                  <span className="text-dreamxec-navy text-xs opacity-70 font-sans">
                    {currentUser.role === 'donor' ? 'Donor' : 'Admin'}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={onLogout}
              className="bg-dreamxec-cream border-3 border-dreamxec-navy px-4 py-3 rounded-2xl font-bold text-dreamxec-navy hover:bg-dreamxec-orange hover:text-white transition-colors font-display shadow-pastel-card"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="relative self-start caret-transparent hidden col-end-2 col-start-1 row-end-2 row-start-1 h-[89.5px] justify-self-end max-h-[99999px] max-w-[99999px] pointer-events-auto w-[232.403px] ml-[0%] mr-[1.67531%] my-[0%] md:self-center md:block md:col-end-4 md:col-start-3 md:mr-[-0.0056016%] md:w-[99.9939%]">
            <button
              onClick={onLogin}
              className="btn-pastel-primary box-border caret-transparent block h-full min-h-2.5 min-w-2.5 w-full rounded-2xl"
            >
              <span className="items-center caret-transparent flex grow h-full justify-center w-full overflow-hidden px-4">
                <span className="text-white text-base font-bold caret-transparent block leading-tight max-w-full text-center font-display md:text-xl">
                  Sign In
                </span>
              </span>
            </button>
          </div>
        )}
        
        <Logo />
        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <DesktopMenu currentUser={currentUser} />
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t-4 border-dreamxec-navy shadow-pastel-card z-50 rounded-b-2xl">
          <div className="flex flex-col gap-2 p-4">
            {currentUser ? (
              <>
                {/* User Profile Card - Only for Students */}
                {currentUser.role === 'student' && (
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 bg-dreamxec-beige border-3 border-dreamxec-navy rounded-lg mx-2 my-2 hover:bg-dreamxec-cream hover:shadow-pastel-card transition-all w-full text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-dreamxec-orange border-2 border-dreamxec-navy rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-dreamxec-navy font-bold text-sm font-sans">
                          {currentUser.name}
                        </span>
                        <span className="text-dreamxec-navy text-xs opacity-70 font-sans">
                          Student
                        </span>
                      </div>
                    </div>
                  </button>
                )}

                {/* User Info Display - For Donors/Admins (non-clickable) */}
                {currentUser.role !== 'student' && (
                  <div className="px-4 py-3 bg-dreamxec-beige border-3 border-dreamxec-navy rounded-lg mx-2 my-2 w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-dreamxec-orange border-2 border-dreamxec-navy rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-dreamxec-navy font-bold text-sm font-sans">
                          {currentUser.name}
                        </span>
                        <span className="text-dreamxec-navy text-xs opacity-70 font-sans">
                          {currentUser.role === 'donor' ? 'Donor' : 'Admin'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Student Links */}
                {currentUser.role === 'student' && (
                  <>
                    <a
                      href="/dashboard"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      DASHBOARD
                    </a>
                    <a
                      href="/campaigns"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      CAMPAIGNS
                    </a>
                    <a
                      href="/projects"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      OPPORTUNITIES
                    </a>
                  </>
                )}

                {/* Admin Links */}
                {currentUser.role === 'admin' && (
                  <>
                    <a
                      href="/admin"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      ADMIN DASHBOARD
                    </a>
                    <a
                      href="/campaigns"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      CAMPAIGNS
                    </a>
                  </>
                )}

                {/* Donor Links */}
                {currentUser.role === 'donor' && (
                  <>
                    <a
                      href="/donor/dashboard"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      MY PROJECTS
                    </a>
                    <a
                      href="/campaigns"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      CAMPAIGNS
                    </a>
                  </>
                )}

                {/* Logout Button */}
                <button
                  onClick={() => {
                    onLogout?.();
                    setMobileMenuOpen(false);
                  }}
                  className="mx-2 my-2 bg-dreamxec-orange text-white px-6 py-3 rounded-lg font-bold border-3 border-dreamxec-navy hover:bg-dreamxec-green transition-colors font-display shadow-pastel-saffron"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Guest Links */}
                <a
                  href="/"
                  className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                >
                  HOME
                </a>
                <a
                  href="/browse"
                  className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                >
                  BROWSE
                </a>
                
                {/* Sign In Button */}
                <button
                  onClick={() => {
                    onLogin?.();
                    setMobileMenuOpen(false);
                  }}
                  className="mx-2 my-2 btn-pastel-primary px-6 py-3 rounded-lg font-bold font-display"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
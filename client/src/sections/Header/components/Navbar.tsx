// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Logo } from "../../../components/Logo";
// import { MobileMenuButton } from "../../../components/MobileMenuButton";
// import { DesktopMenu } from "./DesktopMenu";
// import { NewsletterModal } from "../../../components/NewsletterModal";
// import type { UserRole } from "../../../types";

// interface NavbarProps {
//   currentUser?: { name: string; role: UserRole } | null;
//   onLogin?: () => void;
//   onLogout?: () => void;
// }

// export const Navbar = ({ currentUser, onLogin, onLogout }: NavbarProps) => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [newsletterOpen, setNewsletterOpen] = useState(false);
//   const navigate = useNavigate();

//   console.log(currentUser)

//   return (
//     <>
//       <NewsletterModal
//         isOpen={newsletterOpen}
//         onClose={() => setNewsletterOpen(false)}
//         source="navbar"
//       />
//       <nav className="flex items-center justify-between px-4 py-2">
//         {/* Logo */}
//         <Logo />

//         {/* Right side - Navigation and User Actions */}
//         <div className="flex items-center gap-6">
//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center gap-4">
//             <DesktopMenu currentUser={currentUser} onLogin={onLogin} />

//             {/* Newsletter CTA - Desktop */}
//             <button
//               onClick={() => setNewsletterOpen(true)}
//               className="text-dreamxec-navy hover:text-dreamxec-orange font-semibold text-sm transition-colors flex items-center gap-1"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//               </svg>
//               Updates
//             </button>
//           </div>

//           {/* User Actions */}
//           <div className="flex items-center gap-3">
//             {currentUser && (
//               <>
//                 {/* User Profile - Only for Students */}
//                 {currentUser.role === 'student' && (
//                   <button
//                     onClick={() => navigate('/profile')}
//                     className="hidden md:flex items-center gap-2 bg-dreamxec-beige border-2 border-dreamxec-navy rounded-xl px-3 py-2 shadow-md hover:bg-dreamxec-cream transition-all"
//                   >
//                     <div className="w-8 h-8 bg-dreamxec-orange border-2 border-dreamxec-navy rounded-full flex items-center justify-center">
//                       <span className="text-white font-bold text-sm">
//                         {currentUser.name.charAt(0).toUpperCase()}
//                       </span>
//                     </div>
//                     <div className="flex flex-col text-left">
//                       <span className="text-dreamxec-navy font-bold text-sm font-sans">
//                         {currentUser.name}
//                       </span>
//                       <span className="text-dreamxec-navy text-xs opacity-70 font-sans">
//                         Student
//                       </span>
//                     </div>
//                   </button>
//                 )}

//                 {/* Simple name display for donors/admins */}
//                 {currentUser.role !== 'student' && (
//                   <div className="hidden md:flex items-center gap-2 bg-dreamxec-beige border-2 border-dreamxec-navy rounded-xl px-3 py-2 shadow-md">
//                     <div className="w-8 h-8 bg-dreamxec-orange border-2 border-dreamxec-navy rounded-full flex items-center justify-center">
//                       <span className="text-white font-bold text-sm">
//                         {currentUser.name.charAt(0).toUpperCase()}
//                       </span>
//                     </div>
//                     <div className="flex flex-col text-left">
//                       <span className="text-dreamxec-navy font-bold text-sm font-sans">
//                         {currentUser.name}
//                       </span>
//                       <span className="text-dreamxec-navy text-xs opacity-70 font-sans">
//                         {currentUser.role === 'donor' ? 'Donor' : 'Admin'}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 <button
//                   onClick={onLogout}
//                   className="bg-dreamxec-cream border-2 border-dreamxec-navy px-4 py-2 rounded-xl font-bold text-dreamxec-navy hover:bg-dreamxec-orange hover:text-white transition-colors font-display shadow-md"
//                 >
//                   Logout
//                 </button>
//               </>
//             )}

//             {/* Mobile Menu Button */}
//             <div className="md:hidden">
//               <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="md:hidden bg-white border-t-2 border-dreamxec-navy shadow-lg rounded-b-2xl">
//           <div className="flex flex-col gap-3 p-4">
//             {currentUser ? (
//               <>
//                 {/* User Profile Card - Only for Students */}
//                 {currentUser.role === 'student' && (
//                   <button
//                     onClick={() => {
//                       navigate('/profile');
//                       setMobileMenuOpen(false);
//                     }}
//                     className="px-4 py-3 bg-dreamxec-beige border-3 border-dreamxec-navy rounded-lg mx-2 my-2 hover:bg-dreamxec-cream hover:shadow-pastel-card transition-all w-full text-left cursor-pointer"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 bg-dreamxec-orange border-2 border-dreamxec-navy rounded-full flex items-center justify-center">
//                         <span className="text-white font-bold text-sm">
//                           {currentUser.name.charAt(0).toUpperCase()}
//                         </span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-dreamxec-navy font-bold text-sm font-sans">
//                           {currentUser.name}
//                         </span>
//                         <span className="text-dreamxec-navy text-xs opacity-70 font-sans">
//                           Student
//                         </span>
//                       </div>
//                     </div>
//                   </button>
//                 )}

//                 {/* User Info Display - For Donors/Admins (non-clickable) */}
//                 {currentUser.role !== 'student' && (
//                   <div className="px-4 py-3 bg-dreamxec-beige border-3 border-dreamxec-navy rounded-lg mx-2 my-2 w-full">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 bg-dreamxec-orange border-2 border-dreamxec-navy rounded-full flex items-center justify-center">
//                         <span className="text-white font-bold text-sm">
//                           {currentUser.name.charAt(0).toUpperCase()}
//                         </span>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="text-dreamxec-navy font-bold text-sm font-sans">
//                           {currentUser.name}
//                         </span>
//                         <span className="text-dreamxec-navy text-xs opacity-70 font-sans">
//                           {currentUser.role === 'donor' ? 'Donor' : 'Admin'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Student Links */}
//                 {currentUser.role === 'student' && (
//                   <>
//                     <a
//                       href="/dashboard"
//                       className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
//                     >
//                       DASHBOARD
//                     </a>
//                     <a
//                       href="/campaigns"
//                       className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
//                     >
//                       CAMPAIGNS
//                     </a>
//                     <a
//                       href="/projects"
//                       className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
//                     >
//                       OPPORTUNITIES
//                     </a>
//                   </>
//                 )}

//                 {/* Admin Links */}
//                 {currentUser.role === 'admin' && (
//                   <>
//                     <a
//                       href="/admin"
//                       className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
//                     >
//                       ADMIN DASHBOARD
//                     </a>
//                     <a
//                       href="/campaigns"
//                       className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
//                     >
//                       CAMPAIGNS
//                     </a>
//                   </>
//                 )}

//                 {/* Donor Links */}
//                 {currentUser.role === 'donor' && (
//                   <>
//                     <a
//                       href="/donor/dashboard"
//                       className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
//                     >
//                       MY PROJECTS
//                     </a>
//                     <a
//                       href="/campaigns"
//                       className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
//                     >
//                       CAMPAIGNS
//                     </a>
//                   </>
//                 )}

//                 {/* Logout Button */}
//                 <button
//                   onClick={() => {
//                     onLogout?.();
//                     setMobileMenuOpen(false);
//                   }}
//                   className="mx-2 my-2 bg-dreamxec-orange text-white px-6 py-3 rounded-lg font-bold border-3 border-dreamxec-navy hover:bg-dreamxec-green transition-colors font-display shadow-pastel-saffron"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 {/* Guest Links */}
//                 <a
//                   href="/"
//                   className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
//                 >
//                   HOME
//                 </a>
//                 <a
//                   href="/about"
//                   className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
//                 >
//                   ABOUT US
//                 </a>
//                 <a
//                   href="/campaigns"
//                   className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
//                 >
//                   CAMPAIGNS
//                 </a>

//                 {/* Sign In Button for Mobile */}
//                 <button
//                   onClick={() => {
//                     onLogin?.();
//                     setMobileMenuOpen(false);
//                   }}
//                   className="mx-2 my-2 bg-dreamxec-orange text-white px-6 py-3 rounded-lg font-bold border-3 border-dreamxec-navy hover:bg-dreamxec-saffron transition-colors font-display shadow-pastel-saffron"
//                 >
//                   Sign In
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../../components/Logo";
import { MobileMenuButton } from "../../../components/MobileMenuButton";
import { DesktopMenu } from "./DesktopMenu";
import { NewsletterModal } from "../../../components/NewsletterModal";
import type { UserRole } from "../../../types";

interface NavbarProps {
  currentUser?: { name: string; role: UserRole } | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Navbar = ({ currentUser, onLogin, onLogout }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const navigate = useNavigate();

  console.log(currentUser);

  // Helper to check if user is a student type (regular or president)
  // Presidents also get the clickable profile button
  const isStudentType = currentUser && (currentUser.role === 'student' || currentUser.role === 'STUDENT_PRESIDENT');

  return (
    <>
      <NewsletterModal
        isOpen={newsletterOpen}
        onClose={() => setNewsletterOpen(false)}
        source="navbar"
      />
      <nav className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Logo />

        {/* Right side - Navigation and User Actions */}
        <div className="flex items-center gap-6">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <DesktopMenu currentUser={currentUser} onLogin={onLogin} />

            {/* Newsletter CTA - Desktop */}
            <button
              onClick={() => setNewsletterOpen(true)}
              className="text-dreamxec-navy hover:text-dreamxec-orange font-semibold text-sm transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Updates
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <>
                {/* User Profile - For Students and Student Presidents */}
                {isStudentType && (
                  <button
                    onClick={() => navigate('/profile')}
                    className="hidden md:flex items-center gap-2 bg-dreamxec-beige border-2 border-dreamxec-navy rounded-xl px-3 py-2 shadow-md hover:bg-dreamxec-cream transition-all"
                  >
                    <div className="w-8 h-8 bg-dreamxec-orange border-2 border-dreamxec-navy rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-dreamxec-navy font-bold text-sm font-sans">
                        {currentUser.name}
                      </span>
                      <span className="text-dreamxec-navy text-xs opacity-70 font-sans">
                        {currentUser.role === 'STUDENT_PRESIDENT' ? 'President' : 'Student'}
                      </span>
                    </div>
                  </button>
                )}

                {/* Simple name display for Donors/Admins (non-student types) */}
                {!isStudentType && (
                  <div className="hidden md:flex items-center gap-2 bg-dreamxec-beige border-2 border-dreamxec-navy rounded-xl px-3 py-2 shadow-md">
                    <div className="w-8 h-8 bg-dreamxec-orange border-2 border-dreamxec-navy rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col text-left">
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
                  className="bg-dreamxec-cream border-2 border-dreamxec-navy px-4 py-2 rounded-xl font-bold text-dreamxec-navy hover:bg-dreamxec-orange hover:text-white transition-colors font-display shadow-md"
                >
                  Logout
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t-2 border-dreamxec-navy shadow-lg rounded-b-2xl">
          <div className="flex flex-col gap-3 p-4">
            {currentUser ? (
              <>
                {/* User Profile Card - For Students and Presidents */}
                {isStudentType && (
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
                          {currentUser.role === 'STUDENT_PRESIDENT' ? 'President' : 'Student'}
                        </span>
                      </div>
                    </div>
                  </button>
                )}

                {/* User Info Display - For Donors/Admins (non-clickable) */}
                {!isStudentType && (
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
                    <a
                      href="/blog"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      BLOG
                    </a>
                  </>
                )}

                {/* STUDENT PRESIDENT Links */}
                {currentUser.role === 'STUDENT_PRESIDENT' && (
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
                      href="/blog"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      BLOG
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
                    <a
                      href="/blog"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      BLOG
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
                    <a
                      href="/blog"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      BLOG
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
                  href="/about"
                  className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                >
                  ABOUT US
                </a>
                <a
                  href="/campaigns"
                  className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                >
                  CAMPAIGNS
                </a>
                <a
                  href="/blog"
                  className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                >
                  BLOG
                </a>

                {/* Sign In Button for Mobile */}
                <button
                  onClick={() => {
                    onLogin?.();
                    setMobileMenuOpen(false);
                  }}
                  className="mx-2 my-2 bg-dreamxec-orange text-white px-6 py-3 rounded-lg font-bold border-3 border-dreamxec-navy hover:bg-dreamxec-saffron transition-colors font-display shadow-pastel-saffron"
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
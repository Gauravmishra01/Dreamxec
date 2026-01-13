import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import FloatingDoodles from './components/FloatingDoodles';
import { Header } from './sections/Header';
import { Main } from './components/Main';
import BrowseCampaigns from './components/BrowseCampaigns';
import StudentDashboard from './components/StudentDashboard';
import CreateCampaign from './components/CreateCampaign';
import AdminDashboard from './components/AdminDashboard';
import AuthPage from './components/AuthPage';
import UserProfile from './components/UserProfile';
import DonorDashboard from './components/DonorDashboard';
import CreateProject from './components/CreateProject';
import DonorProjects from './components/DonorProjects';
import BrowseProjects from './components/BrowseProjects';
import EmailVerification from './components/EmailVerification';
import CheckEmail from './components/CheckEmail';
import CampaignDetails from './components/CampaignDetails';
import type { Campaign, User, Project } from './types';
import ReferClub from "./components/ReferClub";
import PresidentDashboard from "./components/president/PresidentDashboard";
import PresidentMembers from "./components/president/PresidentMembers";
import PresidentCampaigns from "./components/president/PresidentCampaigns";
import UploadMembers from "./components/president/UploadMembers";
import AddMemberManually from "./components/president/AddMemberManually";
import PresidentLayout from "./components/president/PresidentLayout";
import AdminClubReferrals from './components/admin/AdminClubReferrals';
import AdminClubVerifications from './components/admin/AdminClubVerifications';
import AuthCallback from './components/AuthCallback';

// Import API services
import { login, register, logout as apiLogout, getCurrentUser, initiateGoogleAuth, handleGoogleCallback, initiateLinkedInAuth, handleLinkedInCallback } from './services/authService';
import { getPublicUserProjects, createUserProject, updateUserProject } from './services/userProjectService';
import { getPublicDonorProjects, createDonorProject, getMyDonorProjects } from './services/donorProjectService';
import { getAllProjects, verifyUserProject, verifyDonorProject } from './services/adminService';
import { applyToProject, getMyApplications } from './services/applicationService';
import { mapBackendRole, mapFrontendRole, mapUserProjectToCampaign, mapDonorProjectToProject } from './services/mappers';
import StartAProject from './sections/Pages/innovators/StartAProject';
import HowItWorksStudents from './sections/Pages/innovators/HowItWorks';
import ProjectEligibility from './sections/Pages/innovators/ProjectEligibility';
import ResourceCenter from './sections/Pages/innovators/Resources';
import FundInnovation from './sections/Pages/supporters/FundInnovation';
import HowItWorksDonors from './sections/Pages/supporters/HowItWorksD';
import WhyDonate from './sections/Pages/supporters/WhyDonate';
import CorporateCSRPartnerships from './sections/Pages/supporters/Corporate';
import AlumniGivingPrograms from './sections/Pages/supporters/AlumniGiving';
import BecomeMentor from './sections/Pages/supporters/BecomeMentor';
import PerfectStorm from './sections/Pages/company/PerfectStorm';
import Careers from './sections/Pages/company/Careers';
import ContactUs from './sections/Pages/company/ContactUs';
import FAQ from './sections/Pages/company/FAQ';
import AboutUs from './components/AboutUs';
import VerifyPresident from './components/VerifyPresident';


// Main App Content Component
function AppContent() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [_isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userApplications, setUserApplications] = useState<string[]>([]); // Project IDs user has applied to
  const [_showCheckEmail, setShowCheckEmail] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const navigate = useNavigate();

  // Handle OAuth callbacks (Google and LinkedIn)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    const provider = urlParams.get('provider'); // Could be 'google' or 'linkedin'

    // Only process OAuth callbacks on root path or /auth/callback
    const isOAuthCallback = window.location.pathname === '/' ||
      window.location.pathname === '/auth/callback';

    if (!isOAuthCallback) {
      return; // Don't process token if not on OAuth callback route
    }

    // Handle error from OAuth
    if (error) {
      console.error(`${provider || 'OAuth'} error:`, error);
      alert(`${provider || 'OAuth'} authentication failed: ${error}`);
      window.history.replaceState({}, '', '/auth');
      navigate('/auth');
      setLoading(false);
      return;
    }

    if (token) {
      // OAuth callback detected
      const processOAuthCallback = async () => {
        try {
          console.log(`📥 Processing ${provider || 'OAuth'} callback...`);

          // Use the appropriate callback handler based on provider
          let response;
          if (provider === 'linkedin') {
            response = await handleLinkedInCallback();
          } else {
            // Default to Google OAuth handler for backward compatibility
            response = await handleGoogleCallback();
          }

          console.log(`✅ ${provider || 'OAuth'} callback response:`, response);

          if (response.data?.user) {
            const userData = {
              id: response.data.user.id,
              name: response.data.user.name,
              email: response.data.user.email,
              role: mapBackendRole(response.data.user.role),
            };

            setUser(userData);

            // Navigate based on role from backend
            if (userData.role === 'student') {
              navigate('/dashboard');
            } else if (userData.role === 'donor') {
              navigate('/donor/dashboard');
            } else if (userData.role === 'admin') {
              navigate('/admin');
            }
          } else {
            // Fallback: if backend indicates verification is required, show check-email
            const needsVerification =
              Boolean((response as any).verificationRequired) ||
              Boolean(response.data && (response.data as any).verificationRequired) ||
              (response.message && /verification/i.test(response.message));

            if (needsVerification) {
              const foundEmail = response.data?.user?.email || '';
              setSignupEmail(foundEmail);
              setShowCheckEmail(true);
              navigate('/check-email');
            } else {
              alert(`${provider || 'OAuth'} authentication failed. Please try again.`);
              navigate('/auth');
            }
          }
        } finally {
          setLoading(false);
        }
      };

      processOAuthCallback();
    }
  }, [navigate]);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getCurrentUser();
        if (response.data?.user) {
          setUser({
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: mapBackendRole(response.data.user.role),
          });
        }
      } catch (error) {
        if(error?.response?.status === 401){
          setUser(null)
        }else{
          console.error('Unexpected /auth/me error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Load public campaigns and projects
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load campaigns
        const campaignsResponse = await getPublicUserProjects();
        if (campaignsResponse.data?.userProjects) {
          const mappedCampaigns = campaignsResponse.data.userProjects.map(mapUserProjectToCampaign);
          setCampaigns(mappedCampaigns);
        }

        // Load donor projects
        const projectsResponse = await getPublicDonorProjects();
        if (projectsResponse.data?.donorProjects) {
          const mappedProjects = projectsResponse.data.donorProjects.map(mapDonorProjectToProject);
          setProjects(mappedProjects);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  // Load ALL projects for admin users
  useEffect(() => {
    const loadAdminData = async () => {
      if (user?.role === 'admin') {
        try {
          console.log('📊 Loading all projects for admin...');
          const response = await getAllProjects();
          console.log('📦 Admin projects response:', response);

          if (response.data?.userProjects?.projects) {
            const mappedCampaigns = response.data.userProjects.projects.map(mapUserProjectToCampaign);
            console.log('✅ Mapped campaigns:', mappedCampaigns);
            setCampaigns(mappedCampaigns);
          }

          if (response.data?.donorProjects?.projects) {
            const mappedProjects = response.data.donorProjects.projects.map(mapDonorProjectToProject);
            console.log('✅ Mapped projects:', mappedProjects);
            setProjects(mappedProjects);
          }
        } catch (error) {
          console.error('Failed to load admin data:', error);
        }
      }
    };

    loadAdminData();
  }, [user?.role]);

  // Load user-specific data for donors only
  // Students and admins use the public campaigns data
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.role === 'donor') {
        try {
          console.log('💼 Loading donor projects...');
          const response = await getMyDonorProjects();
          if (response.data?.donorProjects) {
            const mappedProjects = response.data.donorProjects.map(mapDonorProjectToProject);
            console.log('✅ Donor projects loaded:', mappedProjects.length);
            setProjects(mappedProjects);
          }
        } catch (error) {
          console.error('Failed to load donor projects:', error);
        }
      }
    };

    loadUserData();
  }, [user?.role, user?.id]);

  // Load user applications for students to check which projects they've already applied to
  useEffect(() => {
    const loadUserApplications = async () => {
      if (user?.role === 'student') {
        try {
          console.log('📝 Loading user applications for student:', user.name);
          const response = await getMyApplications();
          if (response.status === 'success' && response.data?.applications) {
            // Extract project IDs from applications
            const appliedProjectIds = response.data.applications.map(app => app.donorProjectId);
            console.log('✅ User has applied to projects:', appliedProjectIds);
            setUserApplications(appliedProjectIds);
          } else {
            console.log('No applications found for user');
            setUserApplications([]);
          }
        } catch (error) {
          console.error('Failed to load user applications:', error);
          setUserApplications([]);
        }
      } else {
        // Clear applications if not a student
        console.log('Clearing user applications (user is not a student)');
        setUserApplications([]);
      }
    };

    loadUserApplications();
  }, [user?.role, user?.id]);

  const approvedCampaigns = campaigns.filter((c) => c.status === 'approved');
  const pendingCampaigns = campaigns.filter((c) => c.status === 'pending');
  const userCampaigns = campaigns.filter((c) => c.createdBy === user?.id);
  const donorProjects = projects.filter((p) => p.createdBy === user?.id);
  const approvedProjects = projects.filter((p) => p.status === 'approved');
  const pendingProjects = projects.filter((p) => p.status === 'pending');

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dreamxec-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dreamxec-navy text-xl font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  const handleCreateCampaign = async (data: {
    title: string;
    description: string;
    clubName: string;
    goalAmount: number;
    bannerFile: File | null;
    mediaFiles: File[];
    deckFile: File | null;
  }) => {
    try {
      console.log('🚀 Creating Campaign with Single Request...');

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('companyName', data.clubName); // Mapped to companyName in DB
      // skillsRequired defaults to empty array
      // timeline defaults to '3 months' or passed value? App hardcoded '3 months' before.
      formData.append('timeline', '3 months');
      formData.append('goalAmount', data.goalAmount.toString());

      // Append Files
      if (data.bannerFile) {
        formData.append('bannerFile', data.bannerFile);
      }

      if (data.deckFile) {
        formData.append('deckFile', data.deckFile);
      }

      if (data.mediaFiles && data.mediaFiles.length > 0) {
        data.mediaFiles.forEach((file) => {
          formData.append('mediaFiles', file);
        });
      }

      const response = await createUserProject(formData);

      console.log('📦 Create Response:', response);

      if (response.data?.userProject) {
        // Map back to frontend model
        const newCampaign = mapUserProjectToCampaign(response.data.userProject);
        setCampaigns([...campaigns, newCampaign]);
        console.log('✅ Campaign created successfully:', newCampaign);
      } else {
        throw new Error('Failed to create campaign: Invalid response');
      }

    } catch (error) {
      console.error('Failed to create campaign:', error);
      throw error;
    }
  };

  const handleApproveCampaign = async (id: string) => {
    try {
      console.log('✅ Approving campaign:', id);
      await verifyUserProject(id, { status: 'APPROVED' });

      // Update local state
      setCampaigns(
        campaigns.map((c) => (c.id === id ? { ...c, status: 'approved' as const } : c))
      );
      console.log('✅ Campaign approved successfully');
    } catch (error) {
      console.error('Failed to approve campaign:', error);
      alert('Failed to approve campaign. Please try again.');
    }
  };

  const handleRejectCampaign = async (id: string, reason: string) => {
    try {
      console.log('❌ Rejecting campaign:', id, 'Reason:', reason);
      await verifyUserProject(id, { status: 'REJECTED', reason });

      // Update local state
      setCampaigns(
        campaigns.map((c) => (c.id === id ? { ...c, status: 'rejected' as const, rejectionReason: reason } : c))
      );
      console.log('❌ Campaign rejected successfully');
    } catch (error) {
      console.error('Failed to reject campaign:', error);
      alert('Failed to reject campaign. Please try again.');
    }
  };

  const handleApproveProject = async (id: string) => {
    try {
      console.log('✅ Approving donor project:', id);
      await verifyDonorProject(id, { status: 'APPROVED' });

      // Update local state
      setProjects(
        projects.map((p) => (p.id === id ? { ...p, status: 'approved' as const } : p))
      );
      console.log('✅ Donor project approved successfully');
    } catch (error) {
      console.error('Failed to approve donor project:', error);
      alert('Failed to approve donor project. Please try again.');
    }
  };

  const handleRejectProject = async (id: string, reason: string) => {
    try {
      console.log('❌ Rejecting donor project:', id, 'Reason:', reason);
      await verifyDonorProject(id, { status: 'REJECTED', reason });

      // Update local state
      setProjects(
        projects.map((p) => (p.id === id ? { ...p, status: 'rejected' as const, rejectionReason: reason } : p))
      );
      console.log('❌ Donor project rejected successfully');
    } catch (error) {
      console.error('Failed to reject donor project:', error);
      alert('Failed to reject donor project. Please try again.');
    }
  };

  const handleLogin = async (email: string, password: string, _role: 'student' | 'donor') => {
    setIsSubmitting(true);
    try {
      const response = await login({ email, password });

      if (response.data?.user) {
        const userData = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: mapBackendRole(response.data.user.role),
        };

        setUser(userData);

        // Navigate based on role from backend, not from form
        if (userData.role === 'student') {
          navigate('/dashboard');
        } else if (userData.role === 'donor') {
          navigate('/donor/dashboard');
        } else if (userData.role === 'admin') {
          navigate('/admin');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (
    name: string,
    email: string,
    password: string,
    role: 'student' | 'donor',
    institution?: string
  ) => {
    setIsSubmitting(true);
    try {
      console.log('🔐 Register payload:', { name, email, password, role: mapFrontendRole(role), organizationName: institution });
      const response = await register({
        name,
        email,
        password,
        role: mapFrontendRole(role),
        organizationName: institution,
      });
      console.log('🔐 Register response:', response);

      // Check if email verification is required
      if (response.message && response.message.includes('verification email')) {
        // Show check email page
        setSignupEmail(email);
        setShowCheckEmail(true);
        navigate('/check-email');
      } else if (response.data?.user) {
        // If no email verification required (already verified or instant login)
        const userData = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: mapBackendRole(response.data.user.role),
        };

        setUser(userData);

        // Navigate based on role
        if (userData.role === 'student') {
          navigate('/dashboard');
        } else if (userData.role === 'donor') {
          navigate('/donor/dashboard');
        } else if (userData.role === 'admin') {
          navigate('/admin');
        }
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async (role: 'student' | 'donor') => {
    console.log('🔐 Google Auth initiated with role:', role);
    setIsSubmitting(true);

    try {
      // Map frontend role to backend role
      const backendRole = mapFrontendRole(role);
      console.log('📤 Sending to backend with role:', backendRole);

      // Initiate Google OAuth flow - this will redirect to Google
      initiateGoogleAuth(backendRole);

      // Note: User will be redirected to Google, then back to our app
      // The callback will be handled in useEffect checking for ?token= param
    } catch (error) {
      console.error('Google auth error:', error);
      setIsSubmitting(false);
      throw new Error('Google authentication failed');
    }
  };

  const handleLinkedInAuth = async (role: 'student' | 'donor') => {
    console.log('🔐 LinkedIn Auth:', { role });

    try {
      // Convert frontend role to backend role format
      const backendRole = role === 'student' ? 'USER' : 'DONOR';

      // Initiate LinkedIn OAuth by redirecting to backend endpoint
      initiateLinkedInAuth(backendRole);

      // Note: After LinkedIn authentication, the backend will redirect back to the frontend
      // with a token, and the OAuth callback handling in useEffect will process it
    } catch (error) {
      console.error('LinkedIn auth error:', error);
      throw new Error('LinkedIn authentication failed');
    }
  };

  const handleForgotPassword = async (email: string) => {
    console.log('🔑 Forgot Password:', { email });

    try {
      // Mock forgot password - Replace with actual implementation
      // This would typically:
      // 1. Verify email exists in database
      // 2. Generate password reset token
      // 3. Send email with reset link

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log(`✅ Password reset link sent to ${email}`);
      // In production, the success message would be shown in the AuthPage component
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new Error('Failed to send password reset email');
    }
  };

  const handleEmailVerificationSuccess = (backendUser: any) => {
    console.log('✅ Email verified, setting user:', backendUser);
    const userData = {
      id: backendUser.id,
      name: backendUser.name,
      email: backendUser.email,
      role: mapBackendRole(backendUser.role),
    };
    setUser(userData);
  };

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const handleLogout = () => {
    console.log('👋 Logout');
    // Clear user session and token
    apiLogout();
    setUser(null);
    // Navigate to home
    navigate('/');
  };

  const handleDonate = async (campaignId: string, amount: number) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/donations/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            projectId: campaignId,
            amount,
          }),
        }
      );

      const data = await res.json();

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "DreamXec",
        description: "Campaign Donation",
        order_id: data.orderId,
        handler: async (response: any) => {
          await fetch(
            `${import.meta.env.VITE_API_URL}/donations/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                ...response,
                projectId: campaignId,
              }),
            }
          );

          alert("🎉 Donation successful!");
        },
        theme: { color: "#0B9C2C" },
      };

      // @ts-ignore
      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("❌ Donation failed");
    }
  };


  // Project handlers for donors
  const handleCreateProject = async (data: {
    title: string;
    companyName: string;
    description: string;
    skillsRequired: string[];
    startDate: Date;
    endDate: Date;
  }) => {
    try {
      console.log('📤 Creating project with data:', data);

      // Calculate timeline string from dates
      const diffTime = Math.abs(data.endDate.getTime() - data.startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const months = Math.ceil(diffDays / 30);
      const timeline = `${months} month${months > 1 ? 's' : ''}`;

      const projectData: any = {
        title: data.title,
        description: data.description,
        organization: data.companyName,
        skillsRequired: data.skillsRequired,
        timeline,
        totalBudget: 10000, // Default budget - can be added to the form if needed
      };

      console.log('📦 Sending to backend:', projectData);

      const response = await createDonorProject(projectData);

      if (response.data?.donorProject) {
        const newProject = mapDonorProjectToProject(response.data.donorProject);
        setProjects([...projects, newProject]);
        console.log('✅ Project created:', newProject);
        navigate('/donor/projects');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  };

  const handleApplyToProject = async (projectId: string, coverLetter: string, skills: string[]) => {
    if (!user) {
      console.error('User must be logged in to apply');
      throw new Error('Please log in to apply');
    }

    // Check if user has already applied to this project
    if (userApplications.includes(projectId)) {
      console.error('User has already applied to this project');
      throw new Error('You have already applied to this project');
    }

    try {
      console.log('📝 Applying to project:', projectId);
      const response = await applyToProject({
        donorProjectId: projectId,
        coverLetter,
        skills,
      });

      if (response.data?.application) {
        console.log('✅ Application submitted:', response.data.application);
        // Add the project ID to user applications
        setUserApplications([...userApplications, projectId]);
      }
    } catch (error) {
      console.error('Failed to apply to project:', error);
      throw error;
    }
  };

  const handleUpdateApplicationStatus = (
    projectId: string,
    applicationId: string,
    status: 'accepted' | 'rejected'
  ) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            interestedUsers: project.interestedUsers.map((app) =>
              app.id === applicationId ? { ...app, status } : app
            ),
          };
        }
        return project;
      })
    );
    console.log(`✅ Application ${applicationId} ${status}`);
  };

  const handleUpdateBankDetails = async (bankDetails: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountType: 'savings' | 'current';
    upiId?: string;
  }) => {
    console.log('💰 Updating bank details:', bankDetails);

    try {
      // Mock API call to save bank details
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, this would:
      // 1. Send bank details to backend API
      // 2. Store securely in database
      // 3. Update user profile

      console.log('✅ Bank details updated successfully');
      // You might want to update user state with bank details if needed
    } catch (error) {
      console.error('Failed to update bank details:', error);
      throw new Error('Failed to update bank details');
    }
  };

  return (
    <div className="text-dreamxec-navy text-[10px] not-italic normal-nums font-normal accent-auto caret-transparent block h-full tracking-[normal] leading-[normal] list-outside list-disc overflow-x-auto overflow-y-scroll pointer-events-auto text-start indent-[0px] normal-case visible border-separate font-sans">
      {/* Floating doodle animations */}
      <FloatingDoodles count={8} />

      <img
        src="https://c.animaapp.com/mhd6hm18SGcCN3/assets/icon-1.svg"
        alt="Icon"
        className="caret-transparent hidden"
      />
      <div className="relative caret-transparent z-10">
        <div className="caret-transparent">
          <div
            role="region"
            aria-label="top of page"
            className="caret-transparent h-0 pointer-events-none text-nowrap overflow-hidden"
          >
            <span className="caret-transparent hidden text-nowrap">
              top of page
            </span>
          </div>
          <div className="relative caret-transparent min-h-full mx-auto top-0">
            <div className="caret-transparent">
              <div className="caret-transparent">
                <div className="caret-transparent grid grid-cols-[1fr] grid-rows-[1fr] h-full">
                  <div className="relative self-stretch caret-transparent grid col-end-2 col-start-1 row-end-2 row-start-1 grid-cols-[minmax(0px,1fr)] grid-rows-[1fr] justify-self-stretch">
                    <div className="caret-transparent">
                      <div className="relative caret-transparent grid grid-cols-[minmax(0px,1fr)] grid-rows-[1fr] overflow-clip">
                        <div className="relative box-border caret-transparent grid grid-cols-[minmax(0px,1fr)] grid-rows-[auto] pointer-events-none">
                          <div className="pointer-events-auto">
                            <Routes>
                              {/* Homepage */}
                              <Route
                                path="/"
                                element={
                                  <>
                                    <Header
                                      currentUser={user}
                                      onLogin={handleLoginClick}
                                      onLogout={handleLogout}
                                    />
                                    <Main />
                                  </>
                                }
                              />

                              {/* Browse Campaigns */}
                              <Route
                                path="/campaigns"
                                element={
                                  <>
                                    <Header
                                      currentUser={user}
                                      onLogin={handleLoginClick}
                                      onLogout={handleLogout}
                                    />
                                    <BrowseCampaigns
                                      campaigns={approvedCampaigns}
                                      onViewCampaign={(id) => navigate(`/campaign/${id}`)}
                                    />
                                  </>
                                }
                              />
                              {/* <Route path="/refer-club" element={<ReferClub />} /> */}
                              {/* Campaign Detail */}
                              <Route
                                path="/campaign/:id"
                                element={
                                  <>
                                    {/* <Header 
                                      currentUser={user} 
                                      onLogin={handleLoginClick}
                                      onLogout={handleLogout}
                                    /> */}
                                    <CampaignDetails
                                      currentUser={user}
                                      campaigns={approvedCampaigns}
                                      onDonate={handleDonate}
                                    />
                                  </>
                                }
                              />
                              <Route path="/refer-club" element={<ReferClub />} />
                              {/* Student Dashboard */}
                              <Route
                                path="/dashboard"
                                element={
                                  user?.role === 'student' ? (
                                    <>
                                      <Header
                                        currentUser={user}
                                        onLogin={handleLoginClick}
                                        onLogout={handleLogout}
                                      />
                                      <StudentDashboard
                                        studentName={user.name || 'User'}
                                        campaigns={userCampaigns}
                                        onCreateCampaign={() => navigate('/create')}
                                        onViewCampaign={(id) => navigate(`/campaign/${id}`)}
                                      />

                                    </>
                                  ) : (
                                    <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream">
                                      <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-12 text-center max-w-md">
                                        <div className="card-tricolor-tag"></div>
                                        <p className="text-dreamxec-navy text-xl font-sans mt-4">
                                          Please log in as a student to access the dashboard.
                                        </p>
                                      </div>
                                    </div>
                                  )
                                }
                              />

                              {/* Create Campaign */}
                              <Route
                                path="/create"
                                element={
                                  user?.role === 'student' ? (
                                    <>
                                      <Header
                                        currentUser={user}
                                        onLogin={handleLoginClick}
                                        onLogout={handleLogout}
                                      />
                                      <CreateCampaign
                                        onBack={() => navigate('/dashboard')}
                                        onSubmit={handleCreateCampaign}
                                      />
                                    </>
                                  ) : (
                                    <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream">
                                      <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-12 text-center max-w-md">
                                        <div className="card-tricolor-tag"></div>
                                        <p className="text-dreamxec-navy text-xl font-sans mt-4">
                                          Please log in as a student to create campaigns.
                                        </p>
                                      </div>
                                    </div>
                                  )
                                }
                              />

                              {/* Admin Dashboard */}
                              <Route
                                path="/admin"
                                element={
                                  user?.role === 'admin' ? (
                                    <>
                                      <Header
                                        currentUser={user}
                                        onLogin={handleLoginClick}
                                        onLogout={handleLogout}
                                      />
                                      <AdminDashboard
                                        pendingCampaigns={pendingCampaigns}
                                        allCampaigns={campaigns}
                                        pendingProjects={pendingProjects}
                                        allProjects={projects}
                                        onApprove={handleApproveCampaign}
                                        onReject={handleRejectCampaign}
                                        onApproveProject={handleApproveProject}
                                        onRejectProject={handleRejectProject}
                                      />
                                    </>
                                  ) : (
                                    <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream">
                                      <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-12 text-center max-w-md">
                                        <div className="card-tricolor-tag"></div>
                                        <p className="text-dreamxec-navy text-xl font-sans mt-4">
                                          Please log in as an admin to access the admin dashboard.
                                        </p>
                                      </div>
                                    </div>
                                  )
                                }
                              />

                              <Route path="/admin/referrals" element={<AdminClubReferrals />} />
                              <Route path="/admin/club-referrals" element={<AdminClubReferrals />} />

                              <Route path="/admin/verifications" element={<AdminClubVerifications />} />
                              <Route path="/admin/club-verifications" element={<AdminClubVerifications />} />

                              {/* Auth Page - Login/Signup */}
                              <Route
                                path="/auth"
                                element={
                                  <AuthPage
                                    onLogin={handleLogin}
                                    onSignup={handleSignup}
                                    onGoogleAuth={handleGoogleAuth}
                                    onLinkedInAuth={handleLinkedInAuth}
                                    onForgotPassword={handleForgotPassword}
                                    currentUser={user}
                                    onHeaderLogin={handleLoginClick}
                                    onLogout={handleLogout}
                                  />
                                }
                              />

                              {/* Login alias */}
                              <Route
                                path="/login"
                                element={
                                  <AuthPage
                                    onLogin={handleLogin}
                                    onSignup={handleSignup}
                                    onGoogleAuth={handleGoogleAuth}
                                    onLinkedInAuth={handleLinkedInAuth}
                                    onForgotPassword={handleForgotPassword}
                                    currentUser={user}
                                    onHeaderLogin={handleLoginClick}
                                    onLogout={handleLogout}
                                  />
                                }
                              />

                              {/* OAuth callback handler */}
                              <Route path="/auth/callback" element={<AuthCallback />} />

                              {/* Check Email Page */}
                              <Route
                                path="/check-email"
                                element={
                                  <CheckEmail
                                    email={signupEmail}
                                    onBackToLogin={() => {
                                      setShowCheckEmail(false);
                                      navigate('/auth');
                                    }}
                                  />
                                }
                              />

                              {/* Email Verification */}
                              <Route
                                path="/verify-email/:token"
                                element={
                                  <EmailVerification
                                    onVerificationSuccess={handleEmailVerificationSuccess}
                                  />
                                }
                              />

                              {/* User Profile - Bank Details */}
                              <Route
                                path="/profile"
                                element={
                                  user ? (
                                    <UserProfile
                                      user={user}
                                      onUpdateBankDetails={handleUpdateBankDetails}
                                      onBack={() => navigate(-1)}
                                    />
                                  ) : (
                                    <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream">
                                      <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-12 text-center max-w-md">
                                        <div className="card-tricolor-tag"></div>
                                        <p className="text-dreamxec-navy text-xl font-sans mt-4">
                                          Please log in to access your profile.
                                        </p>
                                        <button
                                          onClick={handleLoginClick}
                                          className="mt-6 px-6 py-3 bg-dreamxec-orange text-white rounded-lg border-4 border-dreamxec-navy font-bold font-display hover:scale-105 transition-transform shadow-pastel-saffron"
                                        >
                                          Sign In
                                        </button>
                                      </div>
                                    </div>
                                  )
                                }
                              />

                              {/* Donor Dashboard */}
                              <Route
                                path="/donor/dashboard"
                                element={
                                  user?.role === 'donor' ? (
                                    <>
                                      <Header
                                        currentUser={user}
                                        onLogin={handleLoginClick}
                                        onLogout={handleLogout}
                                      />
                                      <DonorDashboard
                                        donorName={user.name || 'Donor'}
                                        projectsCount={donorProjects.length}
                                        onCreateProject={() => navigate('/donor/create')}
                                        onViewProjects={() => navigate('/donor/projects')}
                                        getDonorApplications={async () => []}
                                        updateApplicationStatus={async () => { }}
                                        getDonationSummary={async () => ({})}
                                      />
                                    </>
                                  ) : (
                                    <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream">
                                      <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-12 text-center max-w-md">
                                        <div className="card-tricolor-tag"></div>
                                        <p className="text-dreamxec-navy text-xl font-sans mt-4">
                                          Please log in as a donor to access the donor dashboard.
                                        </p>
                                      </div>
                                    </div>
                                  )
                                }
                              />

                              {/* Create Project */}
                              <Route
                                path="/donor/create"
                                element={
                                  user?.role === 'donor' ? (
                                    <>
                                      <Header
                                        currentUser={user}
                                        onLogin={handleLoginClick}
                                        onLogout={handleLogout}
                                      />
                                      <CreateProject
                                        onBack={() => navigate('/donor/dashboard')}
                                        onSubmit={handleCreateProject}
                                      />
                                    </>
                                  ) : (
                                    <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream">
                                      <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-12 text-center max-w-md">
                                        <div className="card-tricolor-tag"></div>
                                        <p className="text-dreamxec-navy text-xl font-sans mt-4">
                                          Please log in as a donor to create projects.
                                        </p>
                                      </div>
                                    </div>
                                  )
                                }
                              />

                              {/* Donor Projects */}
                              <Route
                                path="/donor/projects"
                                element={
                                  user?.role === 'donor' ? (
                                    <>
                                      <Header
                                        currentUser={user}
                                        onLogin={handleLoginClick}
                                        onLogout={handleLogout}
                                      />
                                      <DonorProjects
                                        projects={donorProjects}
                                        onBack={() => navigate('/donor/dashboard')}
                                        onUpdateApplicationStatus={handleUpdateApplicationStatus}
                                      />
                                    </>
                                  ) : (
                                    <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream">
                                      <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-12 text-center max-w-md">
                                        <div className="card-tricolor-tag"></div>
                                        <p className="text-dreamxec-navy text-xl font-sans mt-4">
                                          Please log in as a donor to view your projects.
                                        </p>
                                      </div>
                                    </div>
                                  )
                                }
                              />


                              {/* Browse Projects - For Students */}
                              <Route
                                path="/projects"
                                element={
                                  user?.role === 'student' ? (
                                    <>
                                      <Header
                                        currentUser={user}
                                        onLogin={handleLoginClick}
                                        onLogout={handleLogout}
                                      />
                                      <BrowseProjects
                                        projects={approvedProjects}
                                        currentUserId={user?.id}
                                        role={user?.role}
                                        onApply={handleApplyToProject}
                                        userApplications={userApplications}
                                      />
                                    </>
                                  )
                                    : (
                                      <>
                                        <Header
                                          currentUser={user}
                                          onLogin={handleLoginClick}
                                          onLogout={handleLogout}
                                        />
                                        <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream">
                                          <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-12 text-center max-w-md">
                                            <div className="card-tricolor-tag"></div>
                                            <p className="text-dreamxec-navy text-xl font-sans mt-4">
                                              Please log in as a student to browse projects.
                                            </p>
                                          </div>
                                        </div>
                                      </>

                                    )
                                }
                              />

                              {/* About Us */}
                              <Route
                                path="/about"
                                element={
                                  <>
                                    <Header
                                      currentUser={user}
                                      onLogin={handleLoginClick}
                                      onLogout={handleLogout}
                                    />
                                    <AboutUs />
                                  </>
                                }
                              />
                              {/* verify-president */}
                              <Route path="/verify-president" element={
                                <>
                                  <Header
                                    currentUser={user}
                                    onLogin={handleLoginClick}
                                    onLogout={handleLogout}
                                  />
                                  <VerifyPresident />
                                </>
                              } />

                              {/* President Dashboard */}
                              <Route path="/president" element={<PresidentLayout><PresidentDashboard /></PresidentLayout>} />
                              <Route path="/president/members" element={<PresidentLayout><PresidentMembers /></PresidentLayout>} />
                              <Route path="/president/campaigns" element={<PresidentLayout><PresidentCampaigns /></PresidentLayout>} />
                              <Route path="/president/upload-members" element={<PresidentLayout><UploadMembers /></PresidentLayout>} />
                              <Route path="/president/add-member" element={<PresidentLayout><AddMemberManually /></PresidentLayout>} />
                            </Routes>

                            {/* Footer Routes */}
                            <Routes>
                              <Route path="/start-project" element={<StartAProject/>} />
                              <Route path="/how-it-works/students" element={<HowItWorksStudents/>} />
                              <Route path="/eligibility" element={<ProjectEligibility/>} />
                              <Route path="/resources" element={<ResourceCenter/>} />



                              <Route path="/fund-innovation" element={<FundInnovation/>} />
                              <Route path="/how-it-works/donors" element={<HowItWorksDonors/>} />
                              <Route path="/why-donate" element={<WhyDonate/>} />
                              <Route path="/corporate-partnerships" element={<CorporateCSRPartnerships/>} />
                              <Route path="/alumni-giving" element={<AlumniGivingPrograms/>} />
                              <Route path="/become-mentor" element={<BecomeMentor/>} />
                              <Route path="/perfect-storm" element={<PerfectStorm/>} />
                              <Route path="/careers" element={<Careers/>} />
                              <Route path="/contact" element={<ContactUs/>} />
                              <Route path="/faq" element={<FAQ/>} />

                            </Routes>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            role="region"
            aria-label="bottom of page"
            className="caret-transparent h-0 pointer-events-none text-nowrap overflow-hidden"
          >
            <span className="caret-transparent hidden text-nowrap">
              bottom of page
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component with Router
const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

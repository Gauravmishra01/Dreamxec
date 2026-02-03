import { useState, useEffect } from 'react';
import toast, { Toast, Toaster } from 'react-hot-toast';
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
import TermsAndConditions from './sections/Pages/legal/TermsAndConditions';
import VerifyPresident from './components/VerifyPresident';
import { LoaderProvider, useLoader } from './context/LoaderContext';
import LoadingAnimation from './components/LoadingAnimation';

// Main App Content Component
function AppContent() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [_isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userApplications, setUserApplications] = useState<string[]>([]);
  const [_showCheckEmail, setShowCheckEmail] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      setTimeout(() => {
        setIsInitialLoading(false);
      }, 2500);
    };
    initialize();
  }, []);

  // Handle OAuth callbacks (Google and LinkedIn)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    const provider = urlParams.get('provider');

    const isOAuthCallback = window.location.pathname === '/' ||
      window.location.pathname === '/auth/callback';

    if (!isOAuthCallback) {
      return;
    }

    if (error) {
      console.error(`${provider || 'OAuth'} error:`, error);
      alert(`${provider || 'OAuth'} authentication failed: ${error}`);
      window.history.replaceState({}, '', '/auth');
      navigate('/auth');
      setLoading(false);
      return;
    }

    if (token) {
      const processOAuthCallback = async () => {
        try {
          console.log(`📥 Processing ${provider || 'OAuth'} callback...`);

          let response;
          if (provider === 'linkedin') {
            response = await handleLinkedInCallback();
          } else {
            response = await handleGoogleCallback();
          }

          console.log(`✅ ${provider || 'OAuth'} callback response:`, response);

          if (response.data?.user) {
            // ✅ FIX: Include all fields required by User type
            const userData: User = {
              id: response.data.user.id,
              email: response.data.user.email,
              role: mapBackendRole(response.data.user.role),
              emailVerified: response.data.user.emailVerified || false,
              clubIds: response.data.user?.clubIds || [],
              createdAt: response.data.user.createdAt || new Date().toISOString(),
              updatedAt: response.data.user.updatedAt || new Date().toISOString(), // Ensure 'updatedAt' is part of the User type
              isClubPresident: response.data.user?.isClubPresident || false,
              isClubMember: response.data.user?.isClubMember || false,
              clubVerified: response.data.user?.clubVerified || false,
              name: response.data.user.name,
              studentVerified: response.data.user?.studentVerified,
            };

            setUser(userData);

            if (userData.role === 'student') {
              navigate('/dashboard');
            } else if (userData.role === 'donor') {
              navigate('/donor/dashboard');
            } else if (userData.role === 'admin') {
              navigate('/admin');
            } else if (userData.role === 'STUDENT_PRESIDENT') {
              navigate('/president');
            }
          } else {
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
          // ✅ FIX: Include all fields required by User type
          const userData: User = {
            id: response.data.user.id,
            email: response.data.user.email,
            role: mapBackendRole(response.data.user.role),
            emailVerified: response.data.user.emailVerified || false,
            clubIds: response.data.user?.clubIds || [],
            createdAt: response.data.user.createdAt || new Date().toISOString(),
            updatedAt: response.data.user.updatedAt || new Date().toISOString(), // Ensure 'updatedAt' is part of the User type
            isClubPresident: response.data.user?.isClubPresident || false,
            isClubMember: response.data.user?.isClubMember || false,
            clubVerified: response.data.user?.clubVerified || false,
            name: response.data.user.name,
            studentVerified: response.data.user?.studentVerified,
          };
          setUser(userData);
        }
      } catch (error: any) {
        if (error?.response?.status === 401) {
          setUser(null)
        } else {
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
        const campaignsResponse = await getPublicUserProjects();
        if (campaignsResponse.data?.userProjects) {
          const mappedCampaigns = campaignsResponse.data.userProjects.map(mapUserProjectToCampaign);
          setCampaigns(mappedCampaigns);
        }

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
            setCampaigns(mappedCampaigns);
          }

          if (response.data?.donorProjects?.projects) {
            const mappedProjects = response.data.donorProjects.projects.map(mapDonorProjectToProject);
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
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.role === 'donor') {
        try {
          console.log('💼 Loading donor projects...');
          const response = await getMyDonorProjects();
          if (response.data?.donorProjects) {
            const mappedProjects = response.data.donorProjects.map(mapDonorProjectToProject);
            setProjects(mappedProjects);
          }
        } catch (error) {
          console.error('Failed to load donor projects:', error);
        }
      }
    };

    loadUserData();
  }, [user?.role, user?.id]);

  // Load user applications for students
  useEffect(() => {
    const loadUserApplications = async () => {
      if (user?.role === 'student') {
        try {
          console.log('📝 Loading user applications for student:', user.name);
          const response = await getMyApplications();
          if (response.status === 'success' && response.data?.applications) {
            const appliedProjectIds = response.data.applications.map((app: any) => app.donorProjectId);
            setUserApplications(appliedProjectIds);
          } else {
            setUserApplications([]);
          }
        } catch (error) {
          console.error('Failed to load user applications:', error);
          setUserApplications([]);
        }
      } else {
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

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream">
  //       <div className="text-center">
  //         <div className="w-16 h-16 border-4 border-dreamxec-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="text-dreamxec-navy text-xl font-bold">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }
  // Circular spinner removed - LoadingAnimation component handles all loading states

  const handleCreateCampaign = async (data: {
    title: string;
    description: string;
    clubName: string;
    // skillsRequired?: string[];
    goalAmount: number;

    bannerFile: File | null;
    mediaFiles: File[];

    presentationDeckUrl: string;

    /* NEW */
    campaignType: "INDIVIDUAL" | "TEAM";

    teamMembers?: {
      name: string;
      role: string;
      image?: File | null; // FE image file
    }[];

    faqs?: {
      question: string;
      answer: string;
    }[];

    youtubeUrl?: string;

    milestones: {
      title: string;
      timeline: string;
      budget: string | number;
      description?: string;
    }[];
  }) => {

    showLoader();

    try {
      console.log("🚀 Creating Campaign...");

      const formData = new FormData();

      /* ---------------- BASIC ---------------- */

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("companyName", data.clubName);
      formData.append("goalAmount", data.goalAmount.toString());

      formData.append(
        "presentationDeckUrl",
        data.presentationDeckUrl || ""
      );

      /* ---------------- TYPE ---------------- */

      formData.append("campaignType", data.campaignType);

      /* ---------------- YOUTUBE ---------------- */

      if (data.youtubeUrl) {
        formData.append("youtubeUrl", data.youtubeUrl);
      }

      /* ---------------- FAQS ---------------- */

      if (data.faqs?.length) {
        formData.append("faqs", JSON.stringify(data.faqs));
      }

      /* ---------------- MILESTONES ---------------- */

      const cleanMilestones = data.milestones.map(m => ({
        ...m,
        budget: Number(m.budget),
      }));

      formData.append(
        "milestones",
        JSON.stringify(cleanMilestones)
      );

      /* ---------------- TEAM ---------------- */

      if (
        data.campaignType === "TEAM" &&
        data.teamMembers?.length
      ) {
        // Send team data WITHOUT images
        const teamData = data.teamMembers.map(m => ({
          name: m.name,
          role: m.role,
        }));

        formData.append(
          "teamMembers",
          JSON.stringify(teamData)
        );

        // Send images separately
        data.teamMembers.forEach(member => {
          if (member.image) {
            formData.append("teamImages", member.image);
          }
        });
      }

      /* ---------------- FILES ---------------- */

      if (data.bannerFile) {
        formData.append("bannerFile", data.bannerFile);
      }

      if (data.mediaFiles?.length) {
        data.mediaFiles.forEach(file => {
          formData.append("mediaFiles", file);
        });
      }

      /* ---------------- API CALL ---------------- */

      const response = await createUserProject(formData);

      if (response.data?.userProject) {
        const newCampaign = mapUserProjectToCampaign(
          response.data.userProject
        );

        setCampaigns(prev => [...prev, newCampaign]);

        console.log("✅ Campaign created:", newCampaign);
      } else {
        throw new Error("Invalid response");
      }

    } catch (error) {
      console.error("❌ Campaign creation failed:", error);
      throw error;
    } finally {
      hideLoader();
    }
  };


  const handleApproveCampaign = async (id: string) => {
    showLoader();
    try {
      console.log('✅ Approving campaign:', id);
      await verifyUserProject(id, { status: 'APPROVED' });

      setCampaigns(
        campaigns.map((c) => (c.id === id ? { ...c, status: 'approved' as const } : c))
      );
      console.log('✅ Campaign approved successfully');
    } catch (error) {
      console.error('Failed to approve campaign:', error);
      hideLoader()
      alert('Failed to approve campaign. Please try again.');
    }
  };

  const handleRejectCampaign = async (id: string, reason: string) => {
    showLoader();
    try {
      console.log('❌ Rejecting campaign:', id, 'Reason:', reason);
      await verifyUserProject(id, { status: 'REJECTED', reason });

      setCampaigns(
        campaigns.map((c) => (c.id === id ? { ...c, status: 'rejected' as const, rejectionReason: reason } : c))
      );
      console.log('❌ Campaign rejected successfully');
    } catch (error) {
      console.error('Failed to reject campaign:', error);
      hideLoader();
      alert('Failed to reject campaign. Please try again.');
    }
  };

  const handleApproveProject = async (id: string) => {
    showLoader();
    try {
      console.log('✅ Approving donor project:', id);
      await verifyDonorProject(id, { status: 'APPROVED' });

      setProjects(
        projects.map((p) => (p.id === id ? { ...p, status: 'approved' as const } : p))
      );
      console.log('✅ Donor project approved successfully');
    } catch (error) {
      console.error('Failed to approve donor project:', error);
      hideLoader();
      alert('Failed to approve donor project. Please try again.');
    }
  };

  const handleRejectProject = async (id: string, reason: string) => {
    showLoader();
    try {
      console.log('❌ Rejecting donor project:', id, 'Reason:', reason);
      await verifyDonorProject(id, { status: 'REJECTED', reason });

      setProjects(
        projects.map((p) => (p.id === id ? { ...p, status: 'rejected' as const, rejectionReason: reason } : p))
      );
      console.log('❌ Donor project rejected successfully');
    } catch (error) {
      console.error('Failed to reject donor project:', error);
      hideLoader();
      alert('Failed to reject donor project. Please try again.');
    }
  };

  const handleLogin = async (email: string, password: string, _role: 'student' | 'donor') => {
    showLoader();
    setIsSubmitting(true);
    try {
      const response = await login({ email, password });
      console.log("USER DATA", response.data)
      if (response.data?.user) {
        // ✅ FIX: Include all fields required by User type
        const userData: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          role: mapBackendRole(response.data.user.role),
          emailVerified: response.data.user?.emailVerified || false,
          clubIds: response.data.user?.clubIds || [],
          createdAt: response.data.user.createdAt || new Date().toISOString(),
          updatedAt: response.data.user.updatedAt || new Date().toISOString(), // Ensure 'updatedAt' is part of the User type
          isClubPresident: response.data.user?.isClubPresident || false,
          isClubMember: response.data.user?.isClubMember || false,
          clubVerified: response.data.user?.clubVerified || false,
          name: response.data.user.name,
          studentVerified: response.data.user?.studentVerified,
        };

        setUser(userData);

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
      hideLoader();
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
    showLoader();
    setIsSubmitting(true);
    try {
      const response = await register({
        name,
        email,
        password,
        role: mapFrontendRole(role),
        organizationName: institution,
      });

      if (response.message && response.message.includes('verification email')) {
        setSignupEmail(email);
        setShowCheckEmail(true);
        navigate('/check-email');
      } else if (response.data?.user) {
        // ✅ FIX: Include all fields required by User type
        const userData: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          role: mapBackendRole(response.data.user.role),
          emailVerified: response.data.user.emailVerified || false,
          clubIds: response.data.user?.clubIds || [],
          createdAt: response.data.user.createdAt || new Date().toISOString(),
          updatedAt: response.data.user.updatedAt || new Date().toISOString(), // Ensure 'updatedAt' is part of the User type
          isClubPresident: response.data.user?.isClubPresident || false,
          isClubMember: response.data.user?.isClubMember || false,
          clubVerified: response.data.user?.clubVerified || false,
          name: response.data.user.name,
          studentVerified: response.data.user?.studentVerified,
        };

        setUser(userData);

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
      hideLoader();
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async (role: 'student' | 'donor') => {
    showLoader();
    setIsSubmitting(true);
    try {
      const backendRole = mapFrontendRole(role);
      initiateGoogleAuth(backendRole);
    } catch (error) {
      console.error('Google auth error:', error);
      hideLoader()
      setIsSubmitting(false);
      throw new Error('Google authentication failed');
    }
  };

  const handleLinkedInAuth = async (role: 'student' | 'donor') => {
    showLoader();
    try {
      const backendRole = role === 'student' ? 'USER' : 'DONOR';
      initiateLinkedInAuth(backendRole);
    } catch (error) {
      console.error('LinkedIn auth error:', error);
      hideLoader();
      throw new Error('LinkedIn authentication failed');
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`✅ Password reset link sent to ${email}`);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new Error('Failed to send password reset email');
    }
  };

  const handleEmailVerificationSuccess = (backendUser: any) => {
    // ✅ FIX: Include all fields required by User type
    const userData: User = {
      id: backendUser.id,
      email: backendUser.email,
      role: mapBackendRole(backendUser.role),
      emailVerified: backendUser.emailVerified || false,
      clubIds: backendUser?.clubIds || [],
      createdAt: backendUser.createdAt || new Date().toISOString(),
      updatedAt: backendUser.updatedAt || new Date().toISOString(), // Ensure 'updatedAt' is part of the User type
      isClubPresident: backendUser?.isClubPresident || false,
      isClubMember: backendUser?.isClubMember || false,
      clubVerified: backendUser?.clubVerified || false,
      name: backendUser.name,
      studentVerified: backendUser?.studentVerified,
    };
    setUser(userData);
  };

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const handleLogout = () => {
    apiLogout();
    setUser(null);
    navigate('/');
  };

  const handleDonate = async (campaignId: string, amount: number) => {
    showLoader()
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
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                projectId: campaignId,
              }),
            }
          );

          toast.success("🎉 Donation successful!");
        },
        theme: { color: "#0B9C2C" },
      };

      // @ts-ignore
      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      hideLoader();
      toast.error("❌ Donation failed");
    }
  };

  const handleCreateProject = async (data: {
    title: string;
    companyName: string;
    description: string;
    skillsRequired: string[];
    startDate: Date;
    endDate: Date;
  }) => {
    showLoader();
    try {
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
        totalBudget: 10000,
      };

      const response = await createDonorProject(projectData);

      if (response.data?.donorProject) {
        const newProject = mapDonorProjectToProject(response.data.donorProject);
        setProjects([...projects, newProject]);
        console.log('✅ Project created:', newProject);
        navigate('/donor/projects');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      hideLoader();
      throw error;
    }
  };

  const handleApplyToProject = async (projectId: string, coverLetter: string, skills: string[]) => {
    if (!user) throw new Error('Please log in to apply');
    if (userApplications.includes(projectId)) throw new Error('You have already applied to this project');

    try {
      const response = await applyToProject({
        donorProjectId: projectId,
        coverLetter,
        skills,
      });

      if (response.data?.application) {
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
  };

  const handleUpdateBankDetails = async (bankDetails: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Bank details updated successfully');
    } catch (error) {
      console.error('Failed to update bank details:', error);
      throw new Error('Failed to update bank details');
    }
  };

  return (
    <div className="text-dreamxec-navy text-[10px] not-italic normal-nums font-normal accent-auto caret-transparent block h-full tracking-[normal] leading-[normal] list-outside list-disc overflow-x-auto overflow-y-scroll pointer-events-auto text-start indent-[0px] normal-case visible border-separate font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#fff',
            color: '#333',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
          },
        }}
        containerStyle={{
          top: 50,
          right: 20,
        }}

      />

      <FloatingDoodles count={8} />

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
                                    {isInitialLoading ? (
                                      <LoadingAnimation fullScreen={true} showDarkModeToggle={false} />
                                    ) : (
                                      <>
                                        <Header
                                          currentUser={user}
                                          onLogin={handleLoginClick}
                                          onLogout={handleLogout}

                                        />
                                        <Main />
                                      </>
                                    )}
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
                              {/* <Route
                                path="/dashboard"
                                element={
                                  (user?.role === 'student' || user?.role === 'STUDENT_PRESIDENT') ? (
                                    <>
                                      <Header
                                        currentUser={user}
                                        onLogin={handleLoginClick}
                                        onLogout={handleLogout}
                                      />
                                      <StudentDashboard
                                        studentName={user.name || 'User'}
                                        campaigns={userCampaigns}
                                        user={user}
                                        studentVerified={user.studentVerified}
                                        onCreateCampaign={() => navigate('/create')}
                                        onViewCampaign={(id) => navigate(`/campaign/${id}`)}
                                        isClubPresident={user.role === 'STUDENT_PRESIDENT'}
                                        isClubMember={false}
                                        clubVerified={user.role === 'STUDENT_PRESIDENT'}
                                      />

                                    </>
                                  ) : (
                                    <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream">
                                      <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-12 text-center max-w-md">
                                        <div className="card-tricolor-tag"></div>
                                        <p className="text-dreamxec-navy text-xl font-sans mt-4">
                                          <p className="text-dreamxec-navy text-xl font-sans mt-4">
                                            Every journey begins with the right role.
                                            <br />
                                            Log in as a student to access your DreamXec dashboard.
                                          </p>
                                          <button
                                            onClick={() => navigate("/auth")}
                                            className="mt-8 px-8 py-3 bg-dreamxec-orange text-white font-bold rounded-xl
                     hover:bg-dreamxec-saffron transition-colors shadow-lg"
                                          >
                                            Log in
                                          </button>
                                        </p>
                                      </div>
                                    </div>
                                  )
                                }
                              /> */}
                              <Route
                                path="/dashboard"
                                element={
                                  (user?.role === 'student' || user?.role === 'STUDENT_PRESIDENT') ? (
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
                                        isClubPresident={user?.role === 'STUDENT_PRESIDENT'}
                                        isClubMember={false}
                                        clubVerified={user?.role === 'STUDENT_PRESIDENT'}
                                        user={user}
                                        studentVerified={user.studentVerified}
                                      />
                                    </>
                                  ) : (
                                    // ... (restricted access div remains the same)
                                    <div className="min-h-screen flex items-center justify-center bg-dreamxec-cream">
                                      <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-12 text-center max-w-md">
                                        <div className="card-tricolor-tag"></div>
                                        <div className="text-dreamxec-navy text-xl font-sans mt-4">
                                          <p className="text-dreamxec-navy text-xl font-sans mt-4">
                                            Every journey begins with the right role.
                                            <br />
                                            Log in as a student to access your DreamXec dashboard.
                                          </p>
                                          <button
                                            onClick={() => navigate("/auth")}
                                            className="mt-8 px-8 py-3 bg-dreamxec-orange text-white font-bold rounded-xl
                     hover:bg-dreamxec-saffron transition-colors shadow-lg"
                                          >
                                            Log in
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                }
                              />

                              {/* Create Campaign */}
                              <Route
                                path="/create"
                                element={
                                  user?.role === 'student' || user?.role === 'STUDENT_PRESIDENT' ? (
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
                              <Route path="/start-project" element={<StartAProject />} />


                              <Route path="/start-project" element={<StartAProject />} />
                              <Route path="/how-it-works/students" element={<HowItWorksStudents />} />
                              <Route path="/eligibility" element={<ProjectEligibility />} />
                              <Route path="/resources" element={<ResourceCenter />} />
                              <Route path="/fund-innovation" element={<FundInnovation />} />
                              <Route path="/how-it-works/donors" element={<HowItWorksDonors />} />
                              <Route path="/why-donate" element={<WhyDonate />} />
                              <Route path="/corporate-partnerships" element={<CorporateCSRPartnerships />} />
                              <Route path="/alumni-giving" element={<AlumniGivingPrograms />} />
                              <Route path="/become-mentor" element={<BecomeMentor />} />
                              <Route path="/perfect-storm" element={<PerfectStorm />} />
                              <Route path="/careers" element={<Careers />} />
                              <Route path="/contact" element={<ContactUs />} />
                              <Route path="/faq" element={<FAQ />} />
                              <Route path="/terms-And-Conditions" element={<TermsAndConditions />} />
                              {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                               */}
                              <Route path="/how-it-works/students" element={<HowItWorksStudents />} />
                              <Route path="/eligibility" element={<ProjectEligibility />} />
                              <Route path="/resources" element={<ResourceCenter />} />



                              <Route path="/fund-innovation" element={<FundInnovation />} />
                              <Route path="/how-it-works/donors" element={<HowItWorksDonors />} />
                              <Route path="/why-donate" element={<WhyDonate />} />
                              <Route path="/corporate-partnerships" element={<CorporateCSRPartnerships />} />
                              <Route path="/alumni-giving" element={<AlumniGivingPrograms />} />
                              <Route path="/become-mentor" element={<BecomeMentor />} />
                              <Route path="/perfect-storm" element={<PerfectStorm />} />
                              <Route path="/careers" element={<Careers />} />
                              <Route path="/contact" element={<ContactUs />} />
                              <Route path="/faq" element={<FAQ />} />

                            </Routes >
                          </div >
                        </div >
                      </div >
                    </div >
                  </div >
                </div >
              </div >
            </div >
          </div >
          <div
            role="region"
            aria-label="bottom of page"
            className="caret-transparent h-0 pointer-events-none text-nowrap overflow-hidden"
          >
            <span className="caret-transparent hidden text-nowrap">
              bottom of page
            </span>
          </div>
        </div >
      </div >
    </div >
  );
}

// Main App Component with Router
const App = () => {
  return (
    <Router>
      <LoaderProvider>
        <AppContent />
      </LoaderProvider>
    </Router>
  );
};

export default App;
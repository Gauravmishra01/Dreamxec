import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { Campaign, User } from '../types';
import { Header } from '../sections/Header';
import { StarDecoration } from './icons/StarDecoration';
import { FooterContent } from '../sections/Footer/components/FooterContent';
import { getUserProject } from '../services/userProjectService';
import { mapUserProjectToCampaign } from '../services/mappers';
import MobileDonateCTA from './MobileDonateCTA';
import { addRecentCampaign } from '../lib/recentCampaigns';
import DiscoverySection from './DiscoverySection';
import YouTube from "react-youtube";
import {
  createRazorpayOrderAuthenticated,
  createRazorpayOrderGuest,
  verifyPayment,
} from "../services/donationService";
import CommentSection from "./comments/CommentSection";



interface CampaignDetailsProps {
  currentUser: User | null;
  campaigns: Campaign[];
  onLogin?: () => void;
  onLogout?: () => void;
  onDonate?: (campaignId: string, amount: number) => void;
}

export type Milestone = {
  id?: string;
  title: string;
  timeline: string;
  budget: number;
  description?: string;
};

const FAQItem = ({
  faq,
}: {
  faq: { question: string; answer: string };
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-3 sm:border-4 border-dreamxec-navy rounded-lg sm:rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 text-left font-bold text-dreamxec-navy font-display text-xs sm:text-sm md:text-base"
      >
        <span className="pr-2 break-words">{faq.question}</span>
        <span className={`transition-transform flex-shrink-0 text-xs sm:text-sm ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className="px-3 sm:px-4 md:px-5 pb-2.5 sm:pb-3 md:pb-4">
          <p className="text-dreamxec-navy/80 text-xs sm:text-sm md:text-base break-words">{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

interface CleanDescriptionProps {
  description: string;
}

function CleanDescription({ description }: CleanDescriptionProps) {
  const cleanText = useMemo(() => {
    if (!description?.trim()) return <NoDescription />;

    let cleaned = description
      .replace(/\s+/g, ' ')
      .replace(/[\r\n]+/g, '\n')
      .trim();

    const paragraphs = cleaned
      .split(/(?<=[.!?])\s+/)
      .map(p => p.trim())
      .filter(p => p.length > 10)
      .reduce((acc: string[], sentence, index) => {
        const lastPara = acc[acc.length - 1];
        if (!lastPara || (lastPara.split(/[.!?]/).length + 1) < 4) {
          acc[acc.length - 1] = lastPara ? `${lastPara} ${sentence}` : sentence;
        } else {
          acc.push(sentence);
        }
        return acc;
      }, [''])
      .filter(p => p.length > 20);

    return paragraphs.length > 0 ? (
      paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="text-dreamxec-navy/95 font-sans text-sm sm:text-base md:text-lg leading-relaxed mb-3 sm:mb-4 md:mb-6 first:mb-4 sm:first:mb-6 md:first:mb-8 last:mb-0 
                   w-full text-balance hyphens-auto indent-0 sm:indent-6 first:indent-0 
                   bg-gradient-to-r from-transparent via-white to-transparent p-2 sm:p-3 md:p-4 -mx-2 sm:-mx-3 md:-mx-4 rounded-lg sm:rounded-xl break-words"
        >
          {paragraph}
        </p>
      ))
    ) : (
      <NoDescription />
    );
  }, [description]);

  return <div className="w-full overflow-hidden">{cleanText}</div>;
}

function NoDescription() {
  return (
    <div className="text-center py-6 sm:py-8 md:py-12 px-3 sm:px-4">
      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 md:mb-6 bg-gradient-to-br from-dreamxec-navy/10 to-dreamxec-orange/10 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center">
        <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-dreamxec-navy/30" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332-.477-4.5-1.253" />
        </svg>
      </div>
      <h3 className="text-base sm:text-lg md:text-xl font-bold text-dreamxec-navy/70 mb-2 font-display">No description available</h3>
      <p className="text-xs sm:text-sm md:text-base text-dreamxec-navy/50 max-w-md mx-auto">Campaign details will be updated soon.</p>
    </div>
  );
}

const getYoutubeId = (url?: string) => {
  if (!url) return null;

  const regExp =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;

  const match = url.match(regExp);
  return match ? match[1] : null;
};


export default function CampaignDetails({ currentUser, campaigns, onLogin, onLogout, onDonate }: CampaignDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [email, setEmail] = useState("")
  const [showDonateModal, setShowDonateModal] = useState(false);
  type CampaignTab = 'about' | 'video' | 'media' | 'presentation' | 'faqs' | 'comments';
  const [activeTab, setActiveTab] = useState<CampaignTab>('about');
  const showMobileCTA = campaign?.status === 'approved';

  const refreshCampaign = async () => {
    const res = await getUserProject(id!);
    const mapped = mapUserProjectToCampaign(res.data.userProject);
    setCampaign(mapped);
  };

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const getFileType = (url: string) => {
    const lower = url.toLowerCase();
    if (lower.endsWith('.pdf')) return 'pdf';
    if (lower.endsWith('.ppt') || lower.endsWith('.pptx')) return 'ppt';
    return 'unknown';
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;

    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/\/d\/(.*?)(\/|$)/);
      if (fileIdMatch?.[1]) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
    }

    if (url.endsWith('.pdf')) {
      return url;
    }

    return null;
  };

  useEffect(() => {
    if (campaign) {
      addRecentCampaign(campaign);
    }
  }, [campaign]);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);

        const res = await getUserProject(id!);
        const mapped = mapUserProjectToCampaign(res.data.userProject);

        if (mapped.status !== 'approved') {
          setError('This campaign is not available');
          return;
        }

        setCampaign(mapped);
      } catch (err) {
        console.error(err);
        setError('Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  useEffect(() => {
    if (campaign) {
      console.log("FAQs:", campaign.faqs);
    }
  }, [campaign]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      const isDonor = currentUser?.role === 'donor' || currentUser?.role === 'DONOR';
      if (!isDonor || !id) return;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE}/wishlist/check/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setIsWishlisted(response.data.isWishlisted);
        }
      } catch (error) {
        console.error('Failed to check wishlist status', error);
      }
    };

    if (campaign && currentUser) {
      checkWishlistStatus();
    }
  }, [currentUser, id, campaign]);

  const handleWishlistToggle = async () => {
    if (!currentUser) return navigate('/auth');

    setWishlistLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE}/wishlist/toggle`,
        { campaignId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 'success') {
        setIsWishlisted(response.data.isWishlisted);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist', error);
      alert('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dreamxec-cream">
        {/* <Header currentUser={currentUser} onLogin={onLogin} onLogout={onLogout} /> */}

        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <p className="text-base sm:text-lg md:text-xl text-dreamxec-navy">Loading campaign...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dreamxec-cream">
        {/* <Header currentUser={currentUser} onLogin={onLogin} onLogout={onLogout} /> */}
        <div className="flex items-center justify-center min-h-[60vh] px-3 sm:px-4">
          <div className="card-pastel-offwhite rounded-lg sm:rounded-xl border-3 sm:border-4 md:border-5 border-dreamxec-navy shadow-pastel-card p-4 sm:p-6 md:p-12 text-center max-w-md w-full mx-3 sm:mx-4">
            <div className="card-tricolor-tag"></div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-dreamxec-navy mb-2 sm:mb-3 md:mb-4 font-display">Error</h2>
            <p className="text-xs sm:text-sm md:text-base text-dreamxec-navy font-sans mb-3 sm:mb-4 md:mb-6 break-words">{error}</p>
            <button
              onClick={() => navigate('/campaigns')}
              className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-dreamxec-orange text-white rounded-lg border-3 sm:border-4 border-dreamxec-navy font-bold font-display hover:scale-105 transition-transform shadow-pastel-saffron text-xs sm:text-sm md:text-base"
            >
              Browse Campaigns
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-dreamxec-cream">
        {/* <Header currentUser={currentUser} onLogin={onLogin} onLogout={onLogout} /> */}
        <div className="flex items-center justify-center min-h-[60vh] px-3 sm:px-4">
          <div className="card-pastel-offwhite rounded-lg sm:rounded-xl border-3 sm:border-4 md:border-5 border-dreamxec-navy shadow-pastel-card p-4 sm:p-6 md:p-12 text-center max-w-md w-full mx-3 sm:mx-4">
            <div className="card-tricolor-tag"></div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-dreamxec-navy mb-2 sm:mb-3 md:mb-4 font-display">
              Campaign Not Found
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-dreamxec-navy font-sans mb-3 sm:mb-4 md:mb-6 break-words">
              The campaign you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/campaigns')}
              className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-dreamxec-orange text-white rounded-lg border-3 sm:border-4 border-dreamxec-navy font-bold font-display hover:scale-105 transition-transform shadow-pastel-saffron text-xs sm:text-sm md:text-base"
            >
              Browse Campaigns
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100);
  const remainingAmount = campaign.goalAmount - campaign.currentAmount;

  const handleDonate = () => {
    setShowDonateModal(true);
  };

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = Number(donationAmount);
    if (!amount || amount <= 0) return;

    try {
      let res;

      if (currentUser) {
        console.log("✅ GOOGLE USER DONATION:", currentUser.email);
        res = await createRazorpayOrderAuthenticated({
          amount,
          projectId: campaign.id,
        });
      } else {
        console.log("✅ GUEST DONATION:", email);
        if (!email) throw new Error("Email required for guests");
        res = await createRazorpayOrderGuest({
          amount,
          projectId: campaign.id,
          email,
        });
      }

      console.log("CREATE ORDER RESPONSE =", res);

      const { orderId, amount: razorAmount, key } = res;
      if (!orderId || !key) {
        throw new Error("Invalid order payload");
      }

      const options = {
        key,
        amount: razorAmount,
        currency: "INR",
        order_id: orderId,
        name: "DreamXec",
        description: campaign.title,
        prefill: currentUser ? { email: currentUser.email } : { email },
        handler: async (response: any) => {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          setShowDonateModal(false);
          setDonationAmount("");
          setTimeout(async () => {
            await refreshCampaign();
          }, 2000);
        },
        theme: { color: "#0B9C2C" },
      };

      // @ts-ignore
      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Donation failed", err);
      alert("Payment failed. Please try again.");
    }
  };

  const isDonor = currentUser?.role === 'donor' || currentUser?.role === 'DONOR';

  const isVideo = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerUrl.includes(ext));
  };

  return (
    <div className="min-h-screen bg-dreamxec-cream relative overflow-x-hidden">
      {/* <Header currentUser={currentUser} onLogin={onLogin} onLogout={onLogout} /> */}

      {/* Decorative elements - hidden on mobile and small tablets */}
      <div className="hidden lg:block absolute top-20 left-10 z-0 opacity-20 pointer-events-none">
        <StarDecoration className="w-16 h-16" color="#FF7F00" />
      </div>
      <div className="hidden lg:block absolute top-40 right-20 z-0 opacity-20 pointer-events-none">
        <StarDecoration className="w-12 h-12" color="#0B9C2C" />
      </div>
      <div className="hidden lg:block absolute bottom-32 left-1/4 z-0 opacity-15 pointer-events-none">
        <StarDecoration className="w-20 h-20" color="#000080" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 pb-20 sm:pb-24 lg:pb-16">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2 text-dreamxec-navy font-bold font-display hover:text-dreamxec-orange transition-colors text-xs sm:text-sm md:text-base"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="truncate">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          {/* Left Column - Campaign Image & Details */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6 w-full overflow-hidden">
            {/* Campaign Image */}
            <div className="card-pastel-offwhite rounded-lg sm:rounded-xl border-3 sm:border-4 md:border-5 border-dreamxec-navy shadow-pastel-card overflow-hidden w-full">
              <div className="card-tricolor-tag"></div>
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover bg-dreamxec-black"
              />
            </div>

            {/* Campaign Title & Info */}
            <div className="card-pastel-offwhite rounded-lg sm:rounded-xl md:rounded-2xl border-3 sm:border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden w-full">
              <div className="card-tricolor-tag"></div>

              <div className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
                {/* Title Row */}
                <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-5">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-dreamxec-navy font-display leading-tight flex-1 break-words min-w-0">
                    {campaign.title}
                  </h1>

                  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0">
                    {isDonor && (
                      <button
                        onClick={handleWishlistToggle}
                        disabled={wishlistLoading}
                        className={`p-1.5 sm:p-2 md:p-2.5 rounded-full transition-all hover:scale-110 ${isWishlisted
                          ? 'text-red-500 bg-red-50'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                          fill={isWishlisted ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={isWishlisted ? 0 : 2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    )}

                    <span
                      className={`px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg font-bold text-[10px] sm:text-xs whitespace-nowrap ${campaign.status === 'approved'
                        ? 'bg-green-100 text-green-700 border-2 border-green-300'
                        : campaign.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                          : 'bg-red-100 text-red-700 border-2 border-red-300'
                        }`}
                    >
                      {campaign.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-5 text-[10px] sm:text-xs md:text-sm lg:text-base text-dreamxec-navy/70">
                  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 min-w-0">
                    <span className="text-sm sm:text-base md:text-lg flex-shrink-0">🏛️</span>
                    <span className="font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">{campaign.club?.college}</span>
                  </div>

                  <div className="w-1 h-1 rounded-full bg-dreamxec-navy/30 hidden sm:block flex-shrink-0"></div>

                  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 min-w-0">
                    <span className="text-sm sm:text-base md:text-lg flex-shrink-0">👥</span>
                    <span className="font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">{campaign.club?.name}</span>
                  </div>

                  <div className="w-1 h-1 rounded-full bg-dreamxec-navy/30 hidden sm:block flex-shrink-0"></div>

                  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                    <span className="text-sm sm:text-base md:text-lg flex-shrink-0">🏷️</span>
                    <span className="font-medium whitespace-nowrap">{campaign.category}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-3 sm:mb-4 md:mb-6 border-b-3 sm:border-b-4 border-dreamxec-navy overflow-x-auto -mx-3 sm:-mx-0 px-3 sm:px-0 scrollbar-hide">
              <div className="flex gap-1 sm:gap-2 md:gap-4 lg:gap-6 min-w-max">
                {(['about', 'video', 'media', 'presentation', 'faqs', 'comments'] as const).map((tab: CampaignTab) => {
                  const isActive = activeTab === tab;

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        relative pb-2 sm:pb-3 px-2 sm:px-3 md:px-4
                        min-w-[60px] sm:min-w-[80px] md:min-w-[100px]
                        min-h-[36px] sm:min-h-[40px] md:min-h-[48px] flex items-center justify-center
                        text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg
                        font-bold font-display capitalize
                        whitespace-nowrap
                        transition-all duration-300 ease-out
                        ${isActive
                          ? 'text-dreamxec-navy scale-105'
                          : 'text-dreamxec-navy/60 hover:text-dreamxec-navy/80 active:scale-95'}
                      `}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`${tab}-panel`}
                    >
                      {tab}

                      {isActive && (
                        <span
                          className="absolute left-0 bottom-0 w-full h-[2px] sm:h-[3px] md:h-[4px] bg-dreamxec-orange rounded-full animate-in duration-300"
                        />
                      )}

                      <span className="absolute inset-0 rounded-lg transition-colors active:bg-dreamxec-navy/5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="card-pastel-offwhite rounded-lg sm:rounded-xl md:rounded-2xl border-3 sm:border-4 border-dreamxec-navy shadow-pastel-card p-3 sm:p-4 md:p-6 lg:p-8 w-full overflow-hidden">
                <div className="card-tricolor-tag"></div>

                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-dreamxec-navy mb-3 sm:mb-4 md:mb-6 lg:mb-8 font-display leading-tight break-words">
                  About This Campaign
                </h2>

                <div className="prose prose-dreamxec prose-sm sm:prose-base md:prose-lg w-full max-w-full">
                  <CleanDescription description={campaign.description} />
                </div>
              </div>
            )}

            {/* YouTube Video Tab */}
            {activeTab === "video" && campaign.youtubeUrl && (
              <div className="card-pastel-offwhite rounded-lg sm:rounded-xl border-3 sm:border-4 md:border-5 border-dreamxec-navy shadow-pastel-card p-3 sm:p-4 md:p-6 w-full overflow-hidden">
                <div className="card-tricolor-tag"></div>

                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-dreamxec-navy mb-3 sm:mb-4 md:mb-6 font-display mt-1 sm:mt-2 md:mt-4 break-words">
                  Campaign Video
                </h2>

                <div className="rounded-lg sm:rounded-xl overflow-hidden border-3 sm:border-4 border-dreamxec-navy shadow-lg w-full">
                  <YouTube
                    videoId={getYoutubeId(campaign.youtubeUrl) || ""}
                    className="w-full"
                    iframeClassName="w-full aspect-video"
                    opts={{
                      width: "100%",
                      height: "auto",
                      playerVars: {
                        autoplay: 0,
                      },
                    }}
                  />
                </div>

                <p className="mt-2 sm:mt-3 md:mt-4 text-dreamxec-navy/70 text-[10px] sm:text-xs md:text-sm text-center">
                  Watch how this campaign makes an impact 🎯
                </p>
              </div>
            )}

            {/* Media Gallery */}
            {activeTab === 'media' && (
              <div className="card-pastel-offwhite border-3 sm:border-4 md:border-5 border-dreamxec-navy rounded-lg sm:rounded-xl shadow-pastel-card p-3 sm:p-4 md:p-6 w-full overflow-hidden">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-dreamxec-navy break-words">
                  Campaign Media
                </h3>

                {campaign?.campaignMedia && campaign.campaignMedia.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    {campaign.campaignMedia.map((url, index) => (
                      <div
                        key={index}
                        className="rounded-md sm:rounded-lg overflow-hidden border-2 sm:border-3 border-dreamxec-navy bg-white aspect-square"
                      >
                        {isVideo(url) ? (
                          <video
                            src={url}
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={url}
                            alt={`Campaign media ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-dreamxec-navy/70 text-xs sm:text-sm md:text-base">
                    No media uploaded for this campaign yet.
                  </p>
                )}
              </div>
            )}

            {/* Pitch Deck */}
            {activeTab === 'presentation' && (
              <div className="card-pastel-offwhite rounded-lg sm:rounded-xl border-3 sm:border-4 md:border-5 border-dreamxec-navy shadow-pastel-card p-3 sm:p-4 md:p-6 w-full overflow-hidden">
                <div className="card-tricolor-tag"></div>

                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-dreamxec-navy mb-3 sm:mb-4 md:mb-6 font-display leading-tight mt-1 sm:mt-2 md:mt-4 text-left break-words">
                  Presentation Deck
                </h2>

                {campaign.presentationDeckUrl ? (
                  (() => {
                    const embedUrl = getEmbedUrl(campaign.presentationDeckUrl);

                    return embedUrl ? (
                      <div className="w-full aspect-video sm:aspect-[4/3] lg:max-h-[500px] border-3 sm:border-4 border-dreamxec-navy rounded-md sm:rounded-lg overflow-hidden bg-white shadow-inner">
                        <iframe
                          src={embedUrl}
                          className="w-full h-full"
                          allow="autoplay; fullscreen"
                          title="Campaign Presentation"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="p-3 sm:p-4 md:p-6 bg-dreamxec-cream rounded-lg sm:rounded-xl border-3 sm:border-4 border-dreamxec-navy text-center">
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 md:mb-4 text-dreamxec-navy/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-dreamxec-navy/80 mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg lg:text-xl font-medium break-words">
                          Preview not available for this file type
                        </p>
                        <a
                          href={campaign.presentationDeckUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 sm:gap-2 md:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-dreamxec-navy text-white rounded-lg sm:rounded-xl font-bold font-display text-xs sm:text-sm md:text-base lg:text-lg hover:bg-dreamxec-orange transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span className="whitespace-nowrap">Open Presentation</span>
                        </a>
                      </div>
                    );
                  })()
                ) : (
                  <div className="p-4 sm:p-6 md:p-8 lg:p-12 text-center bg-dreamxec-cream/50 rounded-lg sm:rounded-xl border-2 border-dreamxec-navy/30">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 md:mb-6 text-dreamxec-navy/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-dreamxec-navy/70 mb-1.5 sm:mb-2 md:mb-3 font-display break-words">
                      No Presentation Available
                    </h3>
                    <p className="text-dreamxec-navy/60 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl max-w-md mx-auto leading-relaxed break-words px-2">
                      This campaign hasn't uploaded a presentation deck yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="card-pastel-offwhite rounded-lg sm:rounded-xl border-3 sm:border-4 border-dreamxec-navy shadow-pastel-card p-4 sm:p-6 w-full overflow-hidden">
                <div className="card-tricolor-tag"></div>

                <CommentSection
                  campaignId={campaign.id}
                  campaignOwnerId={campaign.userId}
                  currentUser={currentUser}
                  onLogin={onLogin}
                />
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faqs' && campaign.faqs?.length > 0 && (
              <div className="card-pastel-offwhite rounded-lg sm:rounded-xl border-3 sm:border-4 md:border-5 border-dreamxec-navy shadow-pastel-card p-3 sm:p-4 md:p-6 w-full overflow-hidden">
                <div className="card-tricolor-tag"></div>

                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-dreamxec-navy mb-3 sm:mb-4 md:mb-6 font-display mt-1 sm:mt-2 md:mt-4 break-words">
                  Campaign FAQs
                </h2>

                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  {campaign.faqs.map((faq, index) => (
                    <FAQItem key={index} faq={faq} />
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="card-pastel-offwhite rounded-lg sm:rounded-xl border-3 sm:border-4 border-dreamxec-navy shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 w-full overflow-hidden">
              <div className="card-tricolor-tag"></div>

              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-dreamxec-navy mb-3 sm:mb-4 md:mb-6 lg:mb-8 font-display leading-tight break-words">
                Campaign Timeline & Fund Allocation
              </h2>

              {campaign.milestones && campaign.milestones.length > 0 ? (
                <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
                  {campaign.milestones.map((milestone, index) => (
                    <div key={index} className="group relative flex items-start gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6 bg-white/60 border border-dreamxec-navy/10 rounded-lg hover:border-dreamxec-orange/30 hover:shadow-md transition-all duration-300">

                      {/* Step indicator */}
                      <div className="flex-shrink-0 pt-0.5 sm:pt-1">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 flex items-center justify-center rounded-full bg-gradient-to-r from-dreamxec-orange to-dreamxec-saffron border-2 border-white shadow-sm group-hover:scale-[1.05] transition-transform duration-300 font-bold text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg text-white">
                          {index + 1}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2 md:mb-3 lg:mb-4">
                          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold text-dreamxec-navy font-display leading-tight flex-1 pr-2 break-words min-w-0">
                            {milestone.title}
                          </h3>
                          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 rounded-full text-[10px] sm:text-xs md:text-sm lg:text-base font-medium bg-dreamxec-orange/90 text-white whitespace-nowrap shadow-sm self-start">
                            {milestone.timeline}
                          </span>
                        </div>

                        {/* Description */}
                        {milestone.description && (
                          <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-dreamxec-navy/75 leading-relaxed mb-2 sm:mb-3 md:mb-4 lg:mb-5 line-clamp-3 sm:line-clamp-2 break-words">
                            {milestone.description}
                          </p>
                        )}

                        {/* Budget */}
                        <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-dreamxec-navy/10 gap-2">
                          <span className="text-[10px] sm:text-xs md:text-sm lg:text-base font-medium text-dreamxec-navy/80 tracking-wide truncate">
                            Budget Allocation
                          </span>
                          <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-dreamxec-green whitespace-nowrap">
                            ₹{milestone.budget.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="pt-3 sm:pt-4 md:pt-6 lg:pt-8 pb-2 sm:pb-3 md:pb-4 lg:pb-6 px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 border-t-2 border-dreamxec-navy bg-gradient-to-r from-white to-dreamxec-cream/50 rounded-lg sm:rounded-xl shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 md:gap-3">
                      <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-dreamxec-navy font-display break-words">
                        Total Planned Allocation
                      </span>
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-dreamxec-green to-emerald-700 text-transparent bg-clip-text whitespace-nowrap">
                        ₹{campaign.milestones.reduce((sum, m) => sum + m.budget, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 text-center border-2 border-dreamxec-navy/20 bg-dreamxec-cream/30 rounded-lg sm:rounded-xl">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mx-auto mb-2 sm:mb-3 md:mb-4 text-dreamxec-navy/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-dreamxec-navy mb-1 sm:mb-1.5 md:mb-2 font-display break-words">
                    Timeline Coming Soon
                  </h3>
                  <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-dreamxec-navy/70 max-w-sm mx-auto break-words px-2">
                    Milestones will appear here after campaign approval
                  </p>
                </div>
              )}

              <p className="mt-3 sm:mt-4 md:mt-6 lg:mt-8 text-[10px] sm:text-xs md:text-sm text-dreamxec-navy/60 font-medium leading-relaxed pt-2 sm:pt-3 md:pt-4 border-t border-dreamxec-navy/10 break-words">
                * Timeline shows phased fund utilization across execution milestones
              </p>
            </div>
          </div>


          {/* Right Column - Funding Card */}
          <div className="lg:col-span-1 w-full">
            <div className="card-pastel-offwhite rounded-lg sm:rounded-xl border-3 sm:border-4 md:border-5 border-dreamxec-navy shadow-pastel-card p-3 sm:p-4 md:p-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] overflow-y-auto w-full">
              <div className="card-tricolor-tag"></div>

              {/* Funding Amount */}
              <div className="mt-1 sm:mt-2 md:mt-4 mb-3 sm:mb-4 md:mb-6">
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dreamxec-navy mb-1 sm:mb-1.5 md:mb-2 font-display break-words">
                  ₹{campaign.currentAmount.toLocaleString()}
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-dreamxec-navy opacity-70 font-sans break-words">
                  raised of ₹{campaign.goalAmount.toLocaleString()} goal
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <div className="w-full h-4 sm:h-5 md:h-6 bg-dreamxec-cream rounded-full border-3 sm:border-4 border-dreamxec-navy overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-dreamxec-green to-dreamxec-saffron transition-all duration-500 flex items-center justify-center"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <span className="text-white text-[10px] sm:text-xs font-bold font-display">
                      {progressPercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
                <div className="p-2.5 sm:p-3 md:p-4 bg-dreamxec-cream rounded-md sm:rounded-lg border-2 sm:border-3 border-dreamxec-orange text-center">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-dreamxec-navy font-display break-words">
                    ₹{remainingAmount.toLocaleString()}
                  </p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-dreamxec-navy opacity-70 font-sans">Remaining</p>
                </div>
              </div>

              {/* Donate Button */}
              {campaign.status === 'approved' && (
                <button
                  onClick={handleDonate}
                  className="w-full px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 bg-dreamxec-green text-white rounded-md sm:rounded-lg border-3 sm:border-4 border-dreamxec-navy font-bold font-display text-sm sm:text-base md:text-lg lg:text-xl hover:scale-105 transition-transform shadow-pastel-green flex items-center justify-center gap-1.5 sm:gap-2"
                >
                  <span className="truncate">Support This Campaign</span>
                </button>
              )}

              {/* Share */}
              <div className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t-3 sm:border-t-4 border-dreamxec-navy">
                <p className="text-[10px] sm:text-xs md:text-sm font-bold text-dreamxec-navy mb-1.5 sm:mb-2 md:mb-3 font-display flex items-center gap-1 sm:gap-1.5 md:gap-2">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="truncate">Share this campaign</span>
                </p>

                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {/* LinkedIn Share */}
                  <button
                    onClick={() => {
                      const campaignUrl = window.location.href;
                      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(campaignUrl)}`;
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                    className="flex-1 p-1.5 sm:p-2 md:p-3 bg-[#0A66C2] text-white rounded-md sm:rounded-lg border-2 sm:border-3 border-dreamxec-navy hover:scale-105 transition-transform"
                    aria-label="Share on LinkedIn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mx-auto"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                    </svg>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank")}
                    className="p-1.5 sm:p-2 md:p-3 bg-blue-600 text-white rounded-md sm:rounded-lg border-2 sm:border-3 border-dreamxec-navy hover:scale-110 hover:-rotate-3 transition-all shadow-lg"
                    title="Share on Facebook"
                    aria-label="Share on Facebook"
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>

                  {/* Twitter */}
                  <button
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          "Check out this amazing campaign!"
                        )}&url=${encodeURIComponent(window.location.href)}`,
                        "_blank"
                      )
                    }
                    className="p-1.5 sm:p-2 md:p-3 bg-black text-white flex items-center justify-center rounded-md sm:rounded-lg border-2 sm:border-3 border-dreamxec-navy hover:scale-110 hover:rotate-3 transition-all shadow-lg"
                    title="Share on Twitter"
                    aria-label="Share on Twitter"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#ffffff"
                      viewBox="0 0 16 16"
                      className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                    >
                      <path d="M12.6 0.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867 -5.07 -4.425 5.07H0.316l5.733 -6.57L0 0.75h5.063l3.495 4.633L12.601 0.75Z" />
                    </svg>
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent("Check out this amazing campaign!")}%20${encodeURIComponent(window.location.href)}`, "_blank")}
                    className="p-1.5 sm:p-2 md:p-3 bg-green-600 text-white rounded-md sm:rounded-lg border-2 sm:border-3 border-dreamxec-navy hover:scale-110 hover:-rotate-3 transition-all shadow-lg"
                    title="Share on WhatsApp"
                    aria-label="Share on WhatsApp"
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Team Members */}
            {campaign.campaignType === "TEAM" &&
              campaign.teamMembers?.length > 0 && (
                <div className="card-pastel-offwhite mt-3 sm:mt-4 md:mt-6 lg:mt-8 rounded-lg sm:rounded-xl border-3 sm:border-4 md:border-5 border-dreamxec-navy shadow-pastel-card p-3 sm:p-4 md:p-6 w-full overflow-hidden">
                  <div className="card-tricolor-tag"></div>

                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-dreamxec-navy mb-3 sm:mb-4 md:mb-6 font-display break-words">
                    Meet the Team
                  </h2>

                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    {campaign.teamMembers.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 sm:gap-3 md:gap-4 bg-white border-2 sm:border-3 border-dreamxec-navy rounded-lg sm:rounded-xl p-2 sm:p-2.5 md:p-3"
                      >
                        <img
                          src={member.image || "https://via.placeholder.com/100"}
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-dreamxec-orange flex-shrink-0"
                          alt={member.name}
                        />

                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-dreamxec-navy text-xs sm:text-sm md:text-base truncate">
                            {member.name}
                          </p>
                          <p className="text-[10px] sm:text-xs md:text-sm text-dreamxec-navy/70 truncate">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>

        <DiscoverySection
          campaigns={campaigns}
          currentCampaign={campaign}
        />
      </div>

      {/* Donation Modal */}
      {showDonateModal && (
        <div
          className="fixed inset-0 z-[9999] flex justify-center items-center p-3 sm:p-4"
          style={{ backgroundColor: 'rgba(0, 0, 128, 0.8)' }}
          onClick={() => setShowDonateModal(false)}
        >
          <div
            className="card-pastel-offwhite rounded-lg sm:rounded-xl border-3 sm:border-4 md:border-5 border-dreamxec-navy shadow-pastel-card max-w-md w-full mx-3 sm:mx-4 p-4 sm:p-5 md:p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-tricolor-tag"></div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-dreamxec-navy mb-3 sm:mb-4 md:mb-6 font-display mt-1 sm:mt-2 md:mt-4 break-words">
              Support This Campaign
            </h2>

            <form onSubmit={handleDonateSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Amount field */}
              <div>
                <label className="block text-sm sm:text-base md:text-lg font-bold text-dreamxec-navy mb-1.5 sm:mb-2 md:mb-3 font-display">
                  Donation Amount (₹)
                </label>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  step="1"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-3 sm:border-4 border-dreamxec-navy rounded-md sm:rounded-lg text-base sm:text-lg md:text-xl font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-green focus:ring-2 focus:ring-dreamxec-green transition-all"
                />
              </div>

              {/* Email field for guests */}
              {!currentUser && (
                <div>
                  <label className="block text-sm sm:text-base md:text-lg font-bold text-dreamxec-navy mb-1.5 sm:mb-2 md:mb-3 font-display">
                    Email:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-3 sm:border-4 border-dreamxec-navy rounded-md sm:rounded-lg text-base sm:text-lg md:text-xl font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-green focus:ring-2 focus:ring-dreamxec-green transition-all"
                    required
                    placeholder="Enter email"
                  />
                </div>
              )}

              {/* Quick amounts */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {[100, 500, 1000, 5000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setDonationAmount(amount.toString())}
                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-dreamxec-cream text-dreamxec-navy rounded-md sm:rounded-lg border-2 sm:border-3 border-dreamxec-orange font-bold font-display hover:bg-dreamxec-orange hover:text-white transition-all text-xs sm:text-sm whitespace-nowrap"
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 sm:gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDonateModal(false)}
                  className="flex-1 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gray-300 text-dreamxec-navy rounded-md sm:rounded-lg border-3 sm:border-4 border-dreamxec-navy font-bold font-display hover:scale-105 transition-transform text-xs sm:text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!donationAmount || (!currentUser && !email)}
                  className="flex-1 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-dreamxec-green text-white rounded-md sm:rounded-lg border-3 sm:border-4 border-dreamxec-navy font-bold font-display hover:scale-105 transition-transform shadow-pastel-green disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
                >
                  Donate Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MobileDonateCTA
        visible={showMobileCTA}
        onDonateClick={handleDonate}
        currentAmount={campaign.currentAmount}
        goalAmount={campaign.goalAmount}
      />
      <FooterContent />
    </div>
  );
}
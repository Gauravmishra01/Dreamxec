import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { Campaign, User } from '../types';
import { Header } from '../sections/Header';
import { StarDecoration } from './icons/StarDecoration';
import { FooterContent } from '../sections/Footer/components/FooterContent';
import { getUserProject } from '../services/userProjectService';
import { mapUserProjectToCampaign } from '../services/mappers';


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


export default function CampaignDetails({ currentUser, campaigns, onLogin, onLogout, onDonate }: CampaignDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [email, setEmail] = useState("")
  const [showDonateModal, setShowDonateModal] = useState(false);
  type CampaignTab = 'about' | 'media' | 'presentation';
  const [activeTab, setActiveTab] = useState<CampaignTab>('about');




  // Wishlist State
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

    // Google Drive file
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/\/d\/(.*?)(\/|$)/);
      if (fileIdMatch?.[1]) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
    }

    // PDF
    if (url.endsWith('.pdf')) {
      return url;
    }

    return null;
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);

        const res = await getUserProject(id!);
        const mapped = mapUserProjectToCampaign(res.data.userProject);

        // 🔒 HARD GATE
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

  // Check Wishlist Status
  useEffect(() => {
    const checkWishlistStatus = async () => {
      // Check if user is donor (safely handle case sensitivity if needed, but assuming 'donor' or 'DONOR')
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
        <Header currentUser={currentUser} onLogin={onLogin} onLogout={onLogout} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-xl text-dreamxec-navy">Loading campaign...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dreamxec-cream">
        <Header currentUser={currentUser} onLogin={onLogin} onLogout={onLogout} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-12 text-center max-w-md">
            <div className="card-tricolor-tag"></div>
            <h2 className="text-3xl font-bold text-dreamxec-navy mb-4 font-display">Error</h2>
            <p className="text-dreamxec-navy font-sans mb-6">{error}</p>
            <button
              onClick={() => navigate('/campaigns')}
              className="px-6 py-3 bg-dreamxec-orange text-white rounded-lg border-4 border-dreamxec-navy font-bold font-display hover:scale-105 transition-transform shadow-pastel-saffron"
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
        <Header currentUser={currentUser} onLogin={onLogin} onLogout={onLogout} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-12 text-center max-w-md">
            <div className="card-tricolor-tag"></div>
            <h2 className="text-3xl font-bold text-dreamxec-navy mb-4 font-display">
              Campaign Not Found
            </h2>
            <p className="text-dreamxec-navy font-sans mb-6">
              The campaign you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/campaigns')}
              className="px-6 py-3 bg-dreamxec-orange text-white rounded-lg border-4 border-dreamxec-navy font-bold font-display hover:scale-105 transition-transform shadow-pastel-saffron"
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
    // if (!currentUser) {
    //   if (onLogin) {
    //     onLogin();
    //   } else {
    //     navigate('/auth');
    //   }
    //   return;
    // }
    setShowDonateModal(true);
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(donationAmount);
    if (amount > 0) {
      if (onDonate) {
        onDonate(campaign.id, amount);
      } else {
        // Fallback: simply log — real donation flow should be provided via prop
        console.log('Donate:', campaign.id, amount);
        alert('Donation has stopped Due to some technical error. Please try again later.');
      }
      setShowDonateModal(false);
      setDonationAmount('');
    }
  };

  // Helper check
  const isDonor = currentUser?.role === 'donor' || currentUser?.role === 'DONOR';

  // Helper function to check if URL is a video
  const isVideo = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerUrl.includes(ext));
  };

  return (
    <div className="min-h-screen bg-dreamxec-cream relative overflow-hidden">
      <Header currentUser={currentUser} onLogin={onLogin} onLogout={onLogout} />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 z-0 opacity-20 pointer-events-none">
        <StarDecoration className="w-16 h-16" color="#FF7F00" />
      </div>
      <div className="absolute top-40 right-20 z-0 opacity-20 pointer-events-none">
        <StarDecoration className="w-12 h-12" color="#0B9C2C" />
      </div>
      <div className="absolute bottom-32 left-1/4 z-0 opacity-15 pointer-events-none">
        <StarDecoration className="w-20 h-20" color="#000080" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 mt-20 pb-16">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-dreamxec-navy font-bold font-display hover:text-dreamxec-orange transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Left Column - Campaign Image & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Image */}
            <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card overflow-hidden">
              <div className="card-tricolor-tag"></div>
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Campaign Title & Info */}
            <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-6">
              <div className="card-tricolor-tag"></div>
              <div className="flex items-start justify-between gap-4 mt-4">
                <div>
                  <h1 className="text-4xl font-bold text-dreamxec-navy mb-3 font-display flex items-center gap-3">
                    {campaign.title}
                    {isDonor && (
                      <button
                        onClick={handleWishlistToggle}
                        disabled={wishlistLoading}
                        className={`p-2 rounded-full transition-all hover:scale-110 ${isWishlisted ? 'text-red-500' : 'text-gray-300 hover:text-red-300'
                          }`}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <svg className="w-8 h-8" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    )}
                  </h1>
                  <div className="flex items-center gap-4 text-dreamxec-navy opacity-80">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-sans">{campaign.clubName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="font-sans">{campaign.category}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg border-3 font-bold font-display ${campaign.status === 'approved' ? 'bg-dreamxec-green text-white border-dreamxec-navy' :
                  campaign.status === 'pending' ? 'bg-yellow-400 text-dreamxec-navy border-dreamxec-navy' :
                    'bg-red-500 text-white border-dreamxec-navy'
                  }`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </div>
              </div>
            </div>
            {/* Tabs */}
            <div className="mb-6 border-b-4 border-dreamxec-navy">
              <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide">
                {(['about', 'media', 'presentation'] as CampaignTab[]).map(tab => {
                  const isActive = activeTab === tab;

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
            relative pb-3 px-1
            text-base sm:text-lg md:text-xl
            font-bold font-display capitalize
            whitespace-nowrap
            transition-all duration-200
            ${isActive
                          ? 'text-dreamxec-navy'
                          : 'text-dreamxec-navy/60 hover:text-dreamxec-navy'}
          `}
                    >
                      {tab}

                      {/* Active underline */}
                      {isActive && (
                        <span className="absolute left-0 -bottom-[4px] w-full h-[4px] bg-dreamxec-orange rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* About Tab */}

            {activeTab === 'about' && (
              <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-6">
                <div className="card-tricolor-tag"></div>
                <h2 className="text-2xl font-bold text-dreamxec-navy mb-4 font-display mt-4">
                  About This Campaign
                </h2>
                <p className="text-dreamxec-navy font-sans text-lg leading-relaxed whitespace-pre-wrap">
                  {campaign.description}
                </p>
              </div>
            )}


            {/* Media Gallery */}
            {activeTab === 'media' && (
              <div className="card-pastel-offwhite border-5 border-dreamxec-navy rounded-xl shadow-pastel-card p-6">
                <h3 className="text-2xl font-bold mb-4 text-dreamxec-navy">
                  Campaign Media
                </h3>

                {campaign?.campaignMedia && campaign.campaignMedia.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {campaign.campaignMedia.map((url, index) => (
                      <div
                        key={index}
                        className="rounded-lg overflow-hidden border-3 border-dreamxec-navy bg-white"
                      >
                        {isVideo(url) ? (
                          <video
                            src={url}
                            controls
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <img
                            src={url}
                            alt={`Campaign media ${index + 1}`}
                            className="w-full h-48 object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-dreamxec-navy/70 text-sm">
                    No media uploaded for this campaign yet.
                  </p>
                )}
              </div>
            )}


            {/* Pitch Deck */}
            {activeTab === 'presentation' && (
              <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-6">
                <div className="card-tricolor-tag"></div>

                <h2 className="text-2xl font-bold text-dreamxec-navy mb-4 font-display mt-4">
                  Presentation Deck
                </h2>

                {campaign.presentationDeckUrl ? (
                  (() => {
                    const embedUrl = getEmbedUrl(campaign.presentationDeckUrl);

                    return embedUrl ? (
                      <div className="w-full h-[70vh] border-4 border-dreamxec-navy rounded-lg overflow-hidden bg-white">
                        <iframe
                          src={embedUrl}
                          className="w-full h-full"
                          allow="autoplay"
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-dreamxec-cream rounded-lg border-3 border-dreamxec-navy">
                        <p className="text-dreamxec-navy mb-3">
                          Preview not available for this file type.
                        </p>
                        <a
                          href={campaign.presentationDeckUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-dreamxec-navy text-white rounded-lg font-bold hover:bg-dreamxec-orange transition"
                        >
                          Open Presentation
                        </a>
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-dreamxec-navy/70">
                    No presentation deck uploaded for this campaign.
                  </p>
                )}
              </div>
            )}


            {/* Milestones */}


            {/* Timeline */}
            <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-6">
              <div className="card-tricolor-tag"></div>

              <h2 className="text-2xl font-bold text-dreamxec-navy mb-6 font-display mt-4">
                Campaign Timeline & Fund Allocation
              </h2>

              {campaign.milestones && campaign.milestones.length > 0 ? (
                <div className="space-y-5">
                  {campaign.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="relative flex gap-4 p-5 bg-dreamxec-cream rounded-xl border-4 border-dreamxec-navy"
                    >
                      {/* Step number */}
                      <span className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-dreamxec-orange text-white font-bold text-lg shadow-md">
                        {index + 1}
                      </span>

                      <div className="flex-1">
                        {/* Title + Timeline */}
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-dreamxec-navy">
                            {milestone.title}
                          </h3>

                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-dreamxec-saffron text-white">
                            {milestone.timeline}
                          </span>
                        </div>

                        {/* Description */}
                        {milestone.description && (
                          <p className="text-sm text-dreamxec-navy/80 mb-3 leading-relaxed">
                            {milestone.description}
                          </p>
                        )}

                        {/* Budget */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-dreamxec-navy">
                            Budget Allocation
                          </span>
                          <span className="text-lg font-bold text-dreamxec-green">
                            ₹{milestone.budget.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Total Allocation */}
                  <div className="mt-6 p-4 rounded-lg border-4 border-dreamxec-navy bg-white flex items-center justify-between">
                    <span className="font-bold text-dreamxec-navy">
                      Total Planned Allocation
                    </span>
                    <span className="text-xl font-bold text-dreamxec-green">
                      ₹
                      {campaign.milestones
                        .reduce((sum, m) => sum + m.budget, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-lg border-4 border-dreamxec-navy bg-dreamxec-cream text-center">
                  <p className="text-dreamxec-navy font-bold">
                    Timeline details will be shared soon.
                  </p>
                  <p className="text-sm text-dreamxec-navy/70 mt-1">
                    The campaign owner will update milestones after approval.
                  </p>
                </div>
              )}

              <p className="mt-6 text-xs text-dreamxec-navy/60 italic">
                * This timeline explains how funds will be utilized across execution phases.
              </p>
            </div>

          </div>

          {/* Right Column - Funding Card */}
          <div className="lg:col-span-1">
            <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="card-tricolor-tag"></div>

              {/* Funding Amount */}
              <div className="mt-4 mb-6">
                <p className="text-5xl font-bold text-dreamxec-navy mb-2 font-display">
                  ₹{campaign.currentAmount.toLocaleString()}
                </p>
                <p className="text-xl text-dreamxec-navy opacity-70 font-sans">
                  raised of ₹{campaign.goalAmount.toLocaleString()} goal
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full h-6 bg-dreamxec-cream rounded-full border-4 border-dreamxec-navy overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-dreamxec-green to-dreamxec-saffron transition-all duration-500 flex items-center justify-center"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <span className="text-white text-xs font-bold font-display">
                      {progressPercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="p-4 bg-dreamxec-cream rounded-lg border-3 border-dreamxec-orange text-center">
                  <p className="text-2xl font-bold text-dreamxec-navy font-display">
                    ₹{remainingAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-dreamxec-navy opacity-70 font-sans">Remaining</p>
                </div>
                {/* <div className="p-4 bg-dreamxec-cream rounded-lg border-3 border-dreamxec-green text-center">
                  <p className="text-2xl font-bold text-dreamxec-navy font-display">
                    {Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-sm text-dreamxec-navy opacity-70 font-sans">Days Left</p>
                </div> */}
              </div>

              {/* Donate Button */}
              {campaign.status === 'approved' && (
                <button
                  onClick={handleDonate}
                  className="w-full px-6 py-4 bg-dreamxec-green text-white rounded-lg border-4 border-dreamxec-navy font-bold font-display text-xl hover:scale-105 transition-transform shadow-pastel-green flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Support This Campaign
                </button>
              )}

              {/* Share */}
              <div className="mt-6 pt-6 border-t-4 border-dreamxec-navy">
                <p className="text-sm font-bold text-dreamxec-navy mb-3 font-display flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share this campaign
                </p>

                <div className="grid grid-cols-4 gap-2">
                  {/* LinkedIn Share */}
                  <button
                    onClick={() => {
                      const campaignUrl = window.location.href;
                      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(campaignUrl)}`;
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                    className="flex-1 p-3 bg-[#0A66C2] text-white rounded-lg border-3 border-dreamxec-navy hover:scale-105 transition-transform"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 mx-auto"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                    </svg>
                  </button>


                  {/* Facebook */}
                  <button
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank")}
                    className="p-3 bg-blue-600 text-white rounded-lg border-3 border-dreamxec-navy hover:scale-110 hover:-rotate-3 transition-all shadow-lg"
                    title="Share on Facebook"
                  >
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
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
                    className="p-3 bg-black text-white flex items-center justify-center rounded-lg border-3 border-dreamxec-navy hover:scale-110 hover:rotate-3 transition-all shadow-lg"
                    title="Share on Twitter"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#ffffff"
                      viewBox="0 0 16 16"
                      height="16"
                      width="16"
                    >
                      <path d="M12.6 0.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867 -5.07 -4.425 5.07H0.316l5.733 -6.57L0 0.75h5.063l3.495 4.633L12.601 0.75Z" />
                    </svg>
                  </button>


                  {/* WhatsApp */}
                  <button
                    onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent("Check out this amazing campaign!")}%20${encodeURIComponent(window.location.href)}`, "_blank")}
                    className="p-3 bg-green-600 text-white rounded-lg border-3 border-dreamxec-navy hover:scale-110 hover:-rotate-3 transition-all shadow-lg"
                    title="Share on WhatsApp"
                  >
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonateModal && (
        <div
          className="fixed inset-0 z-[9999] flex justify-center items-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 128, 0.8)' }}
          onClick={() => setShowDonateModal(false)}
        >
          <div
            className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-tricolor-tag"></div>
            <h2 className="text-3xl font-bold text-dreamxec-navy mb-6 font-display mt-4">
              Support This Campaign
            </h2>
            <form onSubmit={handleDonateSubmit}>
              <div className="mb-6">
                <label className="block text-lg font-bold text-dreamxec-navy mb-3 font-display">
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
                  className="w-full px-4 py-3 border-4 border-dreamxec-navy rounded-lg text-xl font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-green focus:ring-2 focus:ring-dreamxec-green transition-all"
                />
              </div>
              <div className="mb-6">
                <label className="block text-lg font-bold text-dreamxec-navy mb-3 font-display">
                  Email:
                </label>
                <input type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full px-4 py-3 border-4 border-dreamxec-navy rounded-lg text-xl font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-green focus:ring-2 focus:ring-dreamxec-green transition-all"
                  required
                  placeholder="Enter email" />
              </div>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[100, 500, 1000, 5000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setDonationAmount(amount.toString())}
                    className="px-3 py-2 bg-dreamxec-cream text-dreamxec-navy rounded-lg border-3 border-dreamxec-orange font-bold font-display hover:bg-dreamxec-orange hover:text-white transition-all"
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDonateModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-300 text-dreamxec-navy rounded-lg border-4 border-dreamxec-navy font-bold font-display hover:scale-105 transition-transform"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-dreamxec-green text-white rounded-lg border-4 border-dreamxec-navy font-bold font-display hover:scale-105 transition-transform shadow-pastel-green"
                >
                  Donate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <FooterContent />
    </div>
  );
}

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { Campaign, User } from '../types';
import { StarDecoration } from './icons/StarDecoration';
import { FooterContent } from '../sections/Footer/components/FooterContent';
import { getUserProject } from '../services/userProjectService';
import { mapUserProjectToCampaign } from '../services/mappers';
import MobileDonateCTA from './MobileDonateCTA';
import DonateModal from './DonateModal';
import { addRecentCampaign } from '../lib/recentCampaigns';
import DiscoverySection from './DiscoverySection';
import YouTube from "react-youtube";
import {
  createRazorpayOrderAuthenticated,
  createRazorpayOrderGuest,
  verifyPayment,
} from "../services/donationService";
import CommentSection from "./comments/CommentSection";
import { Resizable } from "re-resizable";
import PublicMilestoneEcosystem from './milestones/PublicMilestoneEcosystem';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

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

/* ─────────────────────────────────────────────
   FAQ ITEM  – neobrutalist accordion
───────────────────────────────────────────── */
const FAQItem = ({ faq }: { faq: { question: string; answer: string } }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="bg-white rounded-none overflow-hidden transition-all"
      style={{ border: '3px solid #003366', boxShadow: open ? '5px 5px 0 #FF7F00' : '4px 4px 0 #003366' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 sm:px-5 py-3 sm:py-4 text-left font-black text-dreamxec-navy uppercase tracking-wide text-xs sm:text-sm md:text-base bg-white hover:bg-orange-50 transition-colors"
      >
        <span className="pr-3 leading-snug">{faq.question}</span>
        <span
          className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-dreamxec-navy text-white font-black text-base transition-transform rounded-none"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-4 sm:px-5 pb-4 pt-2 border-t-2 border-dashed border-dreamxec-navy/30 bg-amber-50">
          <p className="text-dreamxec-navy/85 text-xs sm:text-sm md:text-base leading-relaxed font-medium">{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   DESCRIPTION
───────────────────────────────────────────── */
interface CleanDescriptionProps { description: string; }

function CleanDescription({ description }: CleanDescriptionProps) {
  const cleanText = useMemo(() => {
    if (!description?.trim()) return <NoDescription />;
    let cleaned = description.replace(/\s+/g, ' ').replace(/[\r\n]+/g, '\n').trim();
    const paragraphs = cleaned
      .split(/(?<=[.!?])\s+/)
      .map(p => p.trim())
      .filter(p => p.length > 10)
      .reduce((acc: string[], sentence) => {
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
      <div className="space-y-4 sm:space-y-5">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-dreamxec-navy font-medium text-sm sm:text-base md:text-lg leading-relaxed"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {paragraph}
          </p>
        ))}
      </div>
    ) : <NoDescription />;
  }, [description]);

  return <div className="w-full overflow-hidden">{cleanText}</div>;
}

function NoDescription() {
  return (
    <div className="text-center py-10 px-4 border-2 border-dashed border-dreamxec-navy/30 rounded-none bg-amber-50">
      <p className="text-dreamxec-navy/60 font-black uppercase tracking-widest text-sm">No description available</p>
      <p className="text-dreamxec-navy/40 text-xs mt-1">Campaign details will be updated soon.</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const getYoutubeId = (url?: string) => {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isDesktop;
}

/* ─────────────────────────────────────────────
   NEOBRUTALIST TAB BUTTON
───────────────────────────────────────────── */
const TabBtn = ({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`relative px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 font-black uppercase tracking-wider text-[10px] sm:text-xs md:text-sm transition-all whitespace-nowrap select-none ${
      active
        ? 'bg-dreamxec-navy text-white'
        : 'bg-white text-dreamxec-navy hover:bg-dreamxec-orange hover:text-white'
    }`}
    style={{
      border: '3px solid #003366',
      boxShadow: active ? '4px 4px 0 #FF7F00' : '2px 2px 0 #003366',
      transform: active ? 'translate(-2px,-2px)' : 'none',
    }}
  >
    {label}
  </button>
);

/* ─────────────────────────────────────────────
   SECTION CARD – neobrutalist wrapper
───────────────────────────────────────────── */
const NeoCard = ({
  children, className = '', accentColor = '#003366',
}: { children: React.ReactNode; className?: string; accentColor?: string }) => (
  <div
    className={`bg-white ${className}`}
    style={{ border: '3px solid #003366', boxShadow: `6px 6px 0 ${accentColor}` }}
  >
    {children}
  </div>
);

/* ─────────────────────────────────────────────
   SECTION HEADING
───────────────────────────────────────────── */
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-dreamxec-navy uppercase tracking-tight mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
    <span className="inline-block w-2 sm:w-2.5 h-6 sm:h-7 bg-dreamxec-orange flex-shrink-0" />
    {children}
  </h2>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function CampaignDetails({ currentUser, campaigns, onLogin, onLogout, onDonate }: CampaignDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [email, setEmail] = useState('');
  const [showDonateModal, setShowDonateModal] = useState(false);
  type CampaignTab = 'about' | 'video' | 'media' | 'presentation' | 'faqs';
  const [activeTab, setActiveTab] = useState<CampaignTab>('about');
  const showMobileCTA = campaign?.status === 'approved';
  const [deckWidth, setDeckWidth] = useState<number | string>('100%');
  const isDesktop = useIsDesktop();

  const refreshCampaign = async () => {
    const res = await getUserProject(id!);
    const mapped = mapUserProjectToCampaign(res.data.userProject);
    setCampaign(mapped);
  };

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // const getEmbedUrl = (url: string) => {
  //   if (!url) return null;
  //   if (url.includes('drive.google.com')) {
  //     const fileIdMatch = url.match(/\/d\/(.*?)(\/|$)/);
  //     if (fileIdMatch?.[1]) return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
  //   }
  //   if (url.endsWith('.pdf')) return url;
  //   return null;
  // };
  const getEmbedUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/\/d\/(.*?)(\/|$)/);
      if (fileIdMatch?.[1]) return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    return url; // Returns raw url for DocViewer fallback
  };

  useEffect(() => { if (campaign) addRecentCampaign(campaign); }, [campaign]);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const res = await getUserProject(id!);
        const mapped = mapUserProjectToCampaign(res.data.userProject);
        if (mapped.status !== 'approved') { setError('This campaign is not available'); return; }
        setCampaign(mapped);
      } catch (err) {
        setError('Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      const isDonorUser = currentUser?.role === 'donor' || currentUser?.role === 'DONOR';
      if (!isDonorUser || !id) return;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE}/wishlist/check/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (response.data.status === 'success') setIsWishlisted(response.data.isWishlisted);
      } catch {}
    };
    if (campaign && currentUser) checkWishlistStatus();
  }, [currentUser, id, campaign]);

  const handleWishlistToggle = async () => {
    if (!currentUser) return navigate('/auth');
    setWishlistLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE}/wishlist/toggle`, { campaignId: id }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.status === 'success') setIsWishlisted(response.data.isWishlisted);
    } catch { alert('Failed to update wishlist'); }
    finally { setWishlistLoading(false); }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-dreamxec-cream flex items-center justify-center">
      <div className="text-center p-8" style={{ border: '4px solid #003366', boxShadow: '8px 8px 0 #FF7F00', background: '#fff' }}>
        <div className="w-10 h-10 border-4 border-dreamxec-navy border-t-dreamxec-orange rounded-full animate-spin mx-auto mb-4" />
        <p className="font-black uppercase tracking-widest text-dreamxec-navy text-sm">Loading campaign...</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error || !campaign) return (
    <div className="min-h-screen bg-dreamxec-cream flex items-center justify-center px-4">
      <div className="text-center p-8 max-w-sm w-full" style={{ border: '4px solid #003366', boxShadow: '8px 8px 0 #FF7F00', background: '#fff' }}>
        <div className="w-14 h-14 bg-dreamxec-navy rounded-none flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-black text-2xl">!</span>
        </div>
        <h2 className="text-xl font-black text-dreamxec-navy uppercase mb-2">{error ? 'Error' : 'Not Found'}</h2>
        <p className="text-dreamxec-navy/70 text-sm mb-6">{error || "This campaign doesn't exist or has been removed."}</p>
        <button
          onClick={() => navigate('/campaigns')}
          className="px-6 py-2.5 bg-dreamxec-orange text-white font-black uppercase tracking-wide text-sm transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
          style={{ border: '3px solid #003366', boxShadow: '4px 4px 0 #003366' }}
        >
          Browse Campaigns
        </button>
      </div>
    </div>
  );

  const progressPercentage = Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100);
  const remainingAmount = campaign.goalAmount - campaign.currentAmount;
  const isDonor = currentUser?.role === 'donor' || currentUser?.role === 'DONOR';
  const deckIframeHeight = isDesktop ? 700 : 320;

  const handleDonate = () => setShowDonateModal(true);

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(donationAmount);
    if (!amount || amount <= 0) return;
    try {
      let res;
      if (currentUser) {
        res = await createRazorpayOrderAuthenticated({ amount, projectId: campaign.id });
      } else {
        if (!email) throw new Error('Email required for guests');
        res = await createRazorpayOrderGuest({ amount, projectId: campaign.id, email });
      }
      const { orderId, amount: razorAmount, key } = res;
      if (!orderId || !key) throw new Error('Invalid order payload');
      const options = {
        key, amount: razorAmount, currency: 'INR', order_id: orderId,
        name: 'DreamXec', description: campaign.title,
        prefill: currentUser ? { email: currentUser.email } : { email },
        handler: async (response: any) => {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          setShowDonateModal(false);
          setDonationAmount('');
          setTimeout(async () => { await refreshCampaign(); }, 2000);
        },
        theme: { color: '#0B9C2C' },
      };
      // @ts-ignore
      new window.Razorpay(options).open();
    } catch { alert('Payment failed. Please try again.'); }
  };

  const isVideo = (url: string) => ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'].some(ext => url.toLowerCase().includes(ext));

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    approved: { bg: '#dcfce7', text: '#166534', border: '#16a34a' },
    pending:  { bg: '#fef9c3', text: '#854d0e', border: '#ca8a04' },
    rejected: { bg: '#fee2e2', text: '#991b1b', border: '#dc2626' },
  };
  const sc = statusColors[campaign.status] || statusColors.pending;

  return (
    <div className="min-h-screen bg-dreamxec-cream relative overflow-x-hidden">

      {/* ── Decorative raw marks ── */}
      <div className="hidden lg:block fixed top-32 left-6 z-0 pointer-events-none opacity-10">
        <div className="w-16 h-16 border-4 border-dreamxec-orange rotate-12" />
      </div>
      <div className="hidden lg:block fixed top-64 right-8 z-0 pointer-events-none opacity-10">
        <div className="w-10 h-10 bg-dreamxec-green rotate-45" />
      </div>

      {/* ── MAIN ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-24 sm:pb-28 lg:pb-12">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-6 flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-dreamxec-navy font-black uppercase tracking-wider text-xs sm:text-sm transition-all hover:bg-dreamxec-navy hover:text-white"
          style={{ border: '3px solid #003366', boxShadow: '3px 3px 0 #003366' }}
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 md:gap-8 items-start">

          {/* ════════════════════════════════
              LEFT COLUMN
          ════════════════════════════════ */}
          <div className="w-full flex-1 min-w-0 space-y-5 sm:space-y-6">

            {/* Hero Image */}
            <div style={{ border: '4px solid #003366', boxShadow: '8px 8px 0 #FF7F00' }}>
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover block"
              />
            </div>

            {/* Title Card */}
            <NeoCard accentColor="#FF7F00" className="p-4 sm:p-5 md:p-6">
              <div className="flex items-start gap-3 mb-3">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-dreamxec-navy uppercase leading-tight flex-1 break-words tracking-tight">
                  {campaign.title}
                </h1>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isDonor && (
                    <button
                      onClick={handleWishlistToggle}
                      disabled={wishlistLoading}
                      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-all hover:scale-110"
                      style={{ border: '2px solid #003366', background: isWishlisted ? '#fee2e2' : '#fff' }}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill={isWishlisted ? '#ef4444' : 'none'} stroke={isWishlisted ? '#ef4444' : '#003366'} viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  )}
                  <span
                    className="px-2.5 py-1 font-black uppercase tracking-widest text-[10px] sm:text-xs"
                    style={{ background: sc.bg, color: sc.text, border: `2px solid ${sc.border}` }}
                  >
                    {campaign.status}
                  </span>
                </div>
              </div>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { emoji: '🏛️', label: campaign.club?.college },
                  {
                    emoji: '👥',
                    label: campaign.club?.name,
                    onClick: campaign.club?.slug ? () => navigate(`/clubs/${campaign.club?.slug}`) : undefined,
                  },
                  { emoji: '🏷️', label: campaign.category },
                ].map((chip, i) => (
                  <div
                    key={i}
                    onClick={chip.onClick}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold bg-white ${chip.onClick ? 'cursor-pointer hover:bg-dreamxec-orange hover:text-white' : ''} transition-colors`}
                    style={{ border: '2px solid #003366' }}
                  >
                    <span>{chip.emoji}</span>
                    <span className="truncate max-w-[120px] sm:max-w-none text-dreamxec-navy">{chip.label}</span>
                  </div>
                ))}
              </div>
            </NeoCard>

            {/* ── Tabs ── */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {(['about', 'presentation', 'video', 'media', 'faqs'] as const).map(tab => (
                <TabBtn key={tab} label={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
              ))}
            </div>

            {/* ── About ── */}
            {activeTab === 'about' && (
              <NeoCard className="p-4 sm:p-5 md:p-6 lg:p-8" accentColor="#FF7F00">
                <SectionHeading>About This Campaign</SectionHeading>
                <CleanDescription description={campaign.description} />
              </NeoCard>
            )}

            {/* ── Video ── */}
            {activeTab === 'video' && campaign.youtubeUrl && (
              <NeoCard className="p-4 sm:p-5 md:p-6" accentColor="#0B9C2C">
                <SectionHeading>Campaign Video</SectionHeading>
                <div style={{ border: '3px solid #003366', boxShadow: '5px 5px 0 #003366' }}>
                  <YouTube
                    videoId={getYoutubeId(campaign.youtubeUrl) || ''}
                    className="w-full"
                    iframeClassName="w-full aspect-video"
                    opts={{ width: '100%', height: 'auto', playerVars: { autoplay: 0 } }}
                  />
                </div>
                <p className="mt-3 text-dreamxec-navy/60 font-bold text-xs uppercase tracking-widest text-center">
                  Watch how this campaign makes an impact 🎯
                </p>
              </NeoCard>
            )}

            {/* ── Media ── */}
            {activeTab === 'media' && (
              <NeoCard className="p-4 sm:p-5 md:p-6" accentColor="#003366">
                <SectionHeading>Campaign Media</SectionHeading>
                {campaign?.campaignMedia && campaign.campaignMedia.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {campaign.campaignMedia.map((url, index) => (
                      <div key={index} className="aspect-square overflow-hidden" style={{ border: '3px solid #003366', boxShadow: '4px 4px 0 #FF7F00' }}>
                        {isVideo(url)
                          ? <video src={url} controls className="w-full h-full object-cover" />
                          : <img src={url} alt={`Campaign media ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                        }
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-dreamxec-navy/60 font-bold text-sm uppercase tracking-wide">No media uploaded yet.</p>
                )}
              </NeoCard>
            )}

            {/* ── Presentation ── */}
            {/* {activeTab === 'presentation' && (
              <div className="w-full">
                {isDesktop ? (
                  <Resizable
                    size={{ width: deckWidth, height: 'auto' }}
                    minWidth={600}
                    maxWidth={window.innerWidth * 0.95}
                    enable={{ right: true }}
                    onResizeStop={(e, direction, ref) => setDeckWidth(ref.offsetWidth)}
                    style={{ overflow: 'visible' }}
                  >
                    <NeoCard className="p-5 md:p-6" accentColor="#FF7F00">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <SectionHeading>Presentation Deck</SectionHeading>
                        <span className="text-xs text-dreamxec-navy/50 font-bold uppercase tracking-wide flex items-center gap-1">
                          ← Drag right edge to resize →
                        </span>
                      </div>
                      <div style={{ height: 700, border: '3px solid #003366', boxShadow: '5px 5px 0 #003366' }}>
                        <iframe src={getEmbedUrl(campaign.presentationDeckUrl!) ?? undefined} className="w-full h-full" title="Presentation Deck" />
                      </div>
                    </NeoCard>
                  </Resizable>
                ) : (
                  <NeoCard className="p-3 sm:p-4" accentColor="#FF7F00">
                    <SectionHeading>Presentation Deck</SectionHeading>
                    <div style={{ height: deckIframeHeight, border: '3px solid #003366' }}>
                      <iframe src={getEmbedUrl(campaign.presentationDeckUrl!) ?? undefined} className="w-full h-full" title="Presentation Deck" />
                    </div>
                    <p className="mt-2 text-[10px] text-dreamxec-navy/50 font-bold uppercase tracking-widest text-center">
                      View on larger screen for best experience
                    </p>
                  </NeoCard>
                )}
              </div>
            )} */}

                        {activeTab === 'presentation' && (
              <div className="w-full">
                {isDesktop ? (
                  <Resizable
                    size={{ width: deckWidth, height: 'auto' }}
                    minWidth={600}
                    maxWidth={window.innerWidth * 0.95}
                    enable={{ right: true }}
                    onResizeStop={(e, direction, ref) => setDeckWidth(ref.offsetWidth)}
                    style={{ overflow: 'visible' }}
                  >
                    <NeoCard className="p-5 md:p-6" accentColor="#FF7F00">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <SectionHeading>Presentation Deck</SectionHeading>
                        <span className="text-xs text-dreamxec-navy/50 font-bold uppercase tracking-wide flex items-center gap-1">
                          ← Drag right edge to resize →
                        </span>
                      </div>
                      <div style={{ height: 700, border: '3px solid #003366', boxShadow: '5px 5px 0 #003366' }}>
                        <iframe src={getEmbedUrl(campaign.presentationDeckUrl!) ?? undefined} className="w-full h-full" title="Presentation Deck" />
                      </div>
                    </NeoCard>
                  </Resizable>
                ) : (
                  <NeoCard className="p-3 sm:p-4" accentColor="#FF7F00">
                    <SectionHeading>Presentation Deck</SectionHeading>
                    <div style={{ height: deckIframeHeight, border: '3px solid #003366' }}>
                      <iframe src={getEmbedUrl(campaign.presentationDeckUrl!) ?? undefined} className="w-full h-full" title="Presentation Deck" />
                    </div>
                    <p className="mt-2 text-[10px] text-dreamxec-navy/50 font-bold uppercase tracking-widest text-center">
                      View on larger screen for best experience
                    </p>
                  </NeoCard>
                )}
              </div>
            )}


            {/* ── FAQs ── */}
            {activeTab === 'faqs' && campaign.faqs?.length > 0 && (
              <NeoCard className="p-4 sm:p-5 md:p-6" accentColor="#0B9C2C">
                <SectionHeading>Campaign FAQs</SectionHeading>
                <div className="space-y-3 sm:space-y-4">
                  {campaign.faqs.map((faq, index) => (
                    <FAQItem key={index} faq={faq} />
                  ))}
                </div>
              </NeoCard>
            )}

            {/* ── Timeline ── */}
            <NeoCard className="p-4 sm:p-5 md:p-6 lg:p-8" accentColor="#003366">
              <SectionHeading>Campaign Timeline &amp; Fund Allocation</SectionHeading>
              <PublicMilestoneEcosystem campaign={campaign} />
              <p className="mt-4 pt-4 text-[10px] sm:text-xs text-dreamxec-navy/50 font-bold uppercase tracking-wide border-t-2 border-dashed border-dreamxec-navy/20">
                * Timeline shows phased fund utilization across execution milestones
              </p>
            </NeoCard>

            {/* ── Comments ── */}
            <NeoCard className="p-4 sm:p-5 md:p-6" accentColor="#FF7F00">
              <SectionHeading>Discussion</SectionHeading>
              <CommentSection
                campaignId={campaign.id}
                campaignOwnerId={campaign.userId}
                currentUser={currentUser}
                onLogin={onLogin}
              />
            </NeoCard>
          </div>

          {/* ════════════════════════════════
              RIGHT COLUMN — Funding Card
          ════════════════════════════════ */}
          <div className="w-full lg:w-[360px] xl:w-[400px] flex-shrink-0 space-y-4 sm:space-y-5">

            <NeoCard className="p-4 sm:p-5 md:p-6" accentColor="#FF7F00">

              {/* Raised amount */}
              <div className="mb-4 sm:mb-5 pb-4 sm:pb-5 border-b-2 border-dreamxec-navy/20">
                <p className="text-3xl sm:text-4xl md:text-5xl font-black text-dreamxec-navy tracking-tighter break-all">
                  ₹{campaign.currentAmount.toLocaleString()}
                </p>
                <p className="text-sm sm:text-base text-dreamxec-navy/60 font-bold mt-1">
                  raised of <span className="text-dreamxec-navy">₹{campaign.goalAmount.toLocaleString()}</span> goal
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4 sm:mb-5">
                <div className="w-full h-5 sm:h-6 bg-gray-100 overflow-hidden" style={{ border: '3px solid #003366' }}>
                  <div
                    className="h-full bg-dreamxec-green relative flex items-center justify-end pr-1 transition-all duration-700"
                    style={{ width: `${Math.max(progressPercentage, 4)}%` }}
                  >
                    <span className="text-white text-[9px] sm:text-[10px] font-black">{progressPercentage.toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="mb-4 sm:mb-5">
                <div
                  className="p-3 sm:p-4 text-center"
                  style={{ border: '3px solid #FF7F00', boxShadow: '4px 4px 0 #003366', background: '#fff7ed' }}
                >
                  <p className="text-xl sm:text-2xl font-black text-dreamxec-navy">₹{remainingAmount.toLocaleString()}</p>
                  <p className="text-[10px] sm:text-xs text-dreamxec-navy/60 font-black uppercase tracking-widest mt-0.5">Remaining</p>
                </div>
              </div>

              {/* Performance Score */}
              <div className="mb-4 sm:mb-5 p-3 sm:p-4" style={{ border: '2px dashed #FF7F00', background: '#fff7ed' }}>
                <p className="text-xs font-black text-dreamxec-navy uppercase tracking-wide mb-2">Performance Score</p>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} viewBox="0 0 24 24" fill={(campaign.rating ?? 5) >= star ? '#FF7F00' : 'none'} stroke="#FF7F00" strokeWidth="2" className="w-4 h-4 sm:w-5 sm:h-5">
                      <polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2" />
                    </svg>
                  ))}
                  <span className="ml-2 font-black text-dreamxec-navy text-sm">{(campaign.rating ?? 5).toFixed(1)} / 5</span>
                </div>
                <p className="text-[10px] text-dreamxec-navy/50 font-bold mt-1">Based on milestone performance</p>
              </div>

              {/* Donate Button */}
              {campaign.status === 'approved' && (
                <button
                  onClick={handleDonate}
                  className="w-full py-3 sm:py-4 font-black uppercase tracking-widest text-sm sm:text-base text-white transition-all active:translate-x-[3px] active:translate-y-[3px] flex items-center justify-center gap-2 group hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, #FF7F00 0%, #ef4444 100%)',
                    border: '3px solid #003366',
                    boxShadow: '5px 5px 0 #003366',
                  }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  Support This Campaign
                </button>
              )}

              {/* Share */}
              <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t-2 border-dreamxec-navy/20">
                <p className="text-[10px] sm:text-xs font-black text-dreamxec-navy uppercase tracking-widest mb-2 sm:mb-3">Share Campaign</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    {
                      label: 'Li',
                      bg: '#0A66C2',
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mx-auto">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                        </svg>
                      ),
                      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank'),
                    },
                    {
                      label: 'Fb', bg: '#1877F2',
                      icon: <svg className="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
                      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'),
                    },
                    {
                      label: 'X', bg: '#000',
                      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 16 16" className="w-3.5 h-3.5 mx-auto"><path d="M12.6 0.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H0.316l5.733-6.57L0 0.75h5.063l3.495 4.633L12.601 0.75Z" /></svg>,
                      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this amazing campaign!')}&url=${encodeURIComponent(window.location.href)}`, '_blank'),
                    },
                    {
                      label: 'Wa', bg: '#25D366',
                      icon: <svg className="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>,
                      action: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out "${campaign.title}" on DreamXec! `)}${encodeURIComponent(window.location.href)}`, '_blank'),
                    },
                  ].map(({ bg, icon, action }, i) => (
                    <button
                      key={i}
                      onClick={action}
                      className="p-2.5 sm:p-3 text-white flex items-center justify-center transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px]"
                      style={{ background: bg, border: '2px solid #003366', boxShadow: '3px 3px 0 #003366' }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </NeoCard>

            {/* Team Members */}
            {campaign.campaignType === 'TEAM' && campaign.teamMembers?.length > 0 && (
              <NeoCard className="p-4 sm:p-5 md:p-6" accentColor="#0B9C2C">
                <SectionHeading>Meet the Team</SectionHeading>
                <div className="space-y-3">
                  {campaign.teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2.5 sm:p-3 bg-white transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                      style={{ border: '2px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}
                    >
                      <img
                        src={member.image || 'https://via.placeholder.com/100'}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover flex-shrink-0"
                        style={{ border: '2px solid #FF7F00' }}
                        alt={member.name}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-dreamxec-navy text-xs sm:text-sm uppercase truncate">{member.name}</p>
                        <p className="text-[10px] sm:text-xs text-dreamxec-navy/60 font-medium truncate">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </NeoCard>
            )}
          </div>
        </div>

        <DiscoverySection campaigns={campaigns} currentCampaign={campaign} />
      </div>

      {/* Modals */}
      <DonateModal
        show={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        donationAmount={donationAmount}
        setDonationAmount={setDonationAmount}
        onSubmit={handleDonateSubmit}
        currentUser={currentUser}
        email={email}
        setEmail={setEmail}
      />

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
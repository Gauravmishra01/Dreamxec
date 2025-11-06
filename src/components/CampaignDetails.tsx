import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProject } from '../services/userProjectService';
import { mapUserProjectToCampaign } from '../services/mappers';
import type { Campaign, User } from '../types';
import { Header } from '../sections/Header';
import { StarDecoration } from './icons/StarDecoration';

interface CampaignDetailsProps {
  currentUser: User | null;
  onLogin?: () => void;
  onLogout?: () => void;
  onDonate?: (campaignId: string, amount: number) => void;
}

export default function CampaignDetails({ currentUser, onLogin, onLogout, onDonate }: CampaignDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonateModal, setShowDonateModal] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const resp = await getUserProject(id) as any;
        let userProject: any = null;
        if (resp && resp.data && resp.data.userProject) {
          userProject = resp.data.userProject;
        } else if (resp && resp.userProject) {
          userProject = resp.userProject;
        } else if (resp && resp.id) {
          // resp already looks like a UserProject
          userProject = resp;
        }

        if (!userProject) {
          throw new Error('No user project returned from API');
        }

        const mappedCampaign = mapUserProjectToCampaign(userProject);
        setCampaign(mappedCampaign);
      } catch (err) {
        console.error('Failed to fetch campaign:', err);
        setError('Failed to load campaign details');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

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
    if (!currentUser) {
      if (onLogin) {
        onLogin();
      } else {
        navigate('/auth');
      }
      return;
    }
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
        alert('Donation flow is not wired. This is a placeholder.');
      }
      setShowDonateModal(false);
      setDonationAmount('');
    }
  };

  return (
    <div className="min-h-screen bg-dreamxec-cream relative overflow-hidden">
  <Header currentUser={currentUser} onLogin={onLogin} onLogout={onLogout} />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 z-0 opacity-20">
        <StarDecoration className="w-16 h-16" color="#FF7F00" />
      </div>
      <div className="absolute top-40 right-20 z-0 opacity-20">
        <StarDecoration className="w-12 h-12" color="#0B9C2C" />
      </div>
      <div className="absolute bottom-32 left-1/4 z-0 opacity-15">
        <StarDecoration className="w-20 h-20" color="#000080" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 mt-20">
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

        <div className="grid lg:grid-cols-3 gap-8">
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
                  <h1 className="text-4xl font-bold text-dreamxec-navy mb-3 font-display">
                    {campaign.title}
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
                <div className={`px-4 py-2 rounded-lg border-3 font-bold font-display ${
                  campaign.status === 'approved' ? 'bg-dreamxec-green text-white border-dreamxec-navy' :
                  campaign.status === 'pending' ? 'bg-yellow-400 text-dreamxec-navy border-dreamxec-navy' :
                  'bg-red-500 text-white border-dreamxec-navy'
                }`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-6">
              <div className="card-tricolor-tag"></div>
              <h2 className="text-2xl font-bold text-dreamxec-navy mb-4 font-display mt-4">
                About This Campaign
              </h2>
              <p className="text-dreamxec-navy font-sans text-lg leading-relaxed whitespace-pre-wrap">
                {campaign.description}
              </p>
            </div>

            {/* Timeline */}
            <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-6">
              <div className="card-tricolor-tag"></div>
              <h2 className="text-2xl font-bold text-dreamxec-navy mb-4 font-display mt-4">
                Campaign Timeline
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-dreamxec-cream rounded-lg border-3 border-dreamxec-orange">
                  <svg className="w-8 h-8 text-dreamxec-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-dreamxec-navy opacity-70 font-sans">Started</p>
                    <p className="text-lg font-bold text-dreamxec-navy font-display">
                      {campaign.createdAt instanceof Date 
                        ? campaign.createdAt.toLocaleDateString() 
                        : new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-dreamxec-cream rounded-lg border-3 border-dreamxec-green">
                  <svg className="w-8 h-8 text-dreamxec-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-dreamxec-navy opacity-70 font-sans">Deadline</p>
                    <p className="text-lg font-bold text-dreamxec-navy font-display">
                      {campaign.deadline instanceof Date 
                        ? campaign.deadline.toLocaleDateString() 
                        : new Date(campaign.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Funding Card */}
          <div className="lg:col-span-1">
            <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-6 sticky top-24">
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
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-dreamxec-cream rounded-lg border-3 border-dreamxec-orange text-center">
                  <p className="text-2xl font-bold text-dreamxec-navy font-display">
                    ₹{remainingAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-dreamxec-navy opacity-70 font-sans">Remaining</p>
                </div>
                <div className="p-4 bg-dreamxec-cream rounded-lg border-3 border-dreamxec-green text-center">
                  <p className="text-2xl font-bold text-dreamxec-navy font-display">
                    {Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-sm text-dreamxec-navy opacity-70 font-sans">Days Left</p>
                </div>
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
                  Donate Now
                </button>
              )}

              {/* Share */}
              <div className="mt-6 pt-6 border-t-4 border-dreamxec-navy">
                <p className="text-sm font-bold text-dreamxec-navy mb-3 font-display">Share this campaign:</p>
                <div className="flex gap-3">
                  <button className="flex-1 p-3 bg-blue-600 text-white rounded-lg border-3 border-dreamxec-navy hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="flex-1 p-3 bg-blue-400 text-white rounded-lg border-3 border-dreamxec-navy hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>
                  <button className="flex-1 p-3 bg-green-600 text-white rounded-lg border-3 border-dreamxec-navy hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
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
    </div>
  );
}

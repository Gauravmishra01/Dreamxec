import { useState } from 'react';
import type { Campaign } from '../types';
import CampaignCard from './CampaignCard';
import { StarDecoration } from './icons/StarDecoration';
import { FooterContent } from '../sections/Footer/components/FooterContent';

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const SlidersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" x2="4" y1="21" y2="14" />
    <line x1="4" x2="4" y1="10" y2="3" />
    <line x1="12" x2="12" y1="21" y2="12" />
    <line x1="12" x2="12" y1="8" y2="3" />
    <line x1="20" x2="20" y1="21" y2="16" />
    <line x1="20" x2="20" y1="12" y2="3" />
    <line x1="2" x2="6" y1="14" y2="14" />
    <line x1="10" x2="14" y1="8" y2="8" />
    <line x1="18" x2="22" y1="16" y2="16" />
  </svg>
);

interface BrowseCampaignsProps {
  campaigns: Campaign[];
  onViewCampaign: (id: string) => void;
}

type SortOption = 'recent' | 'goal' | 'progress';

export default function BrowseCampaigns({ campaigns, onViewCampaign }: BrowseCampaignsProps) {
  console.log(campaigns)
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const filteredCampaigns = campaigns
    .filter((campaign) => {
      const query = searchQuery.toLowerCase();
      return (
        campaign.title.toLowerCase().includes(query) ||
        campaign.club?.name.toLowerCase().includes(query) ||
        campaign.description.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'goal':
          return b.goalAmount - a.goalAmount;
        case 'progress':
          const progressA = (a.currentAmount / a.goalAmount) * 100;
          const progressB = (b.currentAmount / b.goalAmount) * 100;
          return progressB - progressA;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-dreamxec-cream">
      {/* Subtle Background Decorations */}
      <div className="absolute top-24 left-8 opacity-10">
        <StarDecoration className="w-12 h-12" color="#FF7F00" />
      </div>
      <div className="absolute top-64 right-16 opacity-10">
        <StarDecoration className="w-10 h-10" color="#0B9C2C" />
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-dreamxec-navy to-dreamxec-berkeley-blue border-b-8 border-dreamxec-orange shadow-xl">
        {/* <div className="card-tricolor-tag absolute top-0 right-0"></div> */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "48px 48px"
                    }}
                />
          <div className="flex items-start gap-4 mb-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-dreamxec-orange font-display leading-tight">
              Browse Campaigns
            </h1>
            <StarDecoration className="w-12 h-12 mt-2" color="#FF7F00" />
          </div>
          <p className="text-dreamxec-cream/95 text-xl sm:text-2xl font-medium max-w-2xl leading-relaxed">
            Discover and support student-led initiatives across clubs & colleges. 
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-12">
          
          {/* Search */}
          <div className="relative flex-1 group">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-dreamxec-navy/60 w-6 h-6 group-focus-within:text-dreamxec-orange transition-colors" />
            <input
              type="text"
              placeholder="Search campaigns, clubs, colleges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-4 border-2 border-dreamxec-navy rounded-xl text-lg font-medium text-dreamxec-navy bg-white/80 backdrop-blur-sm focus:outline-none focus:border-dreamxec-orange focus:ring-4 focus:ring-dreamxec-orange/30 shadow-pastel-card hover:shadow-xl transition-all duration-300"
            />
          </div>

          {/* Sort */}
          <div className="relative group">
            <SlidersIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-dreamxec-navy/60 w-6 h-6 group-focus-within:text-dreamxec-orange transition-colors" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full lg:w-64 pl-16 pr-8 py-4 border-2 border-dreamxec-navy rounded-xl text-lg font-semibold text-dreamxec-navy bg-white/80 backdrop-blur-sm focus:outline-none focus:border-dreamxec-green focus:ring-4 focus:ring-dreamxec-green/30 shadow-pastel-card hover:shadow-xl appearance-none cursor-pointer transition-all duration-300"
            >
              <option value="recent">Most Recent First</option>
              <option value="goal">Highest Goals</option>
              <option value="progress">Nearing Completion</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {filteredCampaigns.length === 0 ? (
          <div className="card-pastel-offwhite rounded-2xl border-2 border-dreamxec-navy shadow-pastel-card p-16 sm:p-24 text-center max-w-2xl mx-auto">
            <div className="card-tricolor-tag"></div>
            <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-dreamxec-orange/20 to-dreamxec-navy/20 rounded-2xl flex items-center justify-center border-2 border-dreamxec-navy/30">
              <SearchIcon className="w-14 h-14 text-dreamxec-navy/50" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy mb-4 font-display">
              No Campaigns Found
            </h2>
            <p className="text-xl text-dreamxec-navy/70 font-medium leading-relaxed">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          <div>
            {/* Results Count */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-dreamxec-orange text-white rounded-xl border-2 border-dreamxec-navy shadow-pastel-saffron hover:shadow-xl transition-all">
                <span className="text-2xl font-black font-display">
                  {filteredCampaigns.length}
                </span>
                <span className="text-lg font-semibold">campaign{filteredCampaigns.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  href={`/campaign/${campaign.id}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <FooterContent />
    </div>
  );
}

import { useState } from 'react';
import type { Campaign } from '../types';
import CampaignCard from './CampaignCard';
import { StarDecoration } from './icons/StarDecoration';
import { FooterContent } from '../sections/Footer/components/FooterContent';

// Simple SVG Icons
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const SlidersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" x2="4" y1="21" y2="14"/>
    <line x1="4" x2="4" y1="10" y2="3"/>
    <line x1="12" x2="12" y1="21" y2="12"/>
    <line x1="12" x2="12" y1="8" y2="3"/>
    <line x1="20" x2="20" y1="21" y2="16"/>
    <line x1="20" x2="20" y1="12" y2="3"/>
    <line x1="2" x2="6" y1="14" y2="14"/>
    <line x1="10" x2="14" y1="8" y2="8"/>
    <line x1="18" x2="22" y1="16" y2="16"/>
  </svg>
);

interface BrowseCampaignsProps {
  campaigns: Campaign[];
  onViewCampaign: (id: string) => void;
}

type SortOption = 'recent' | 'goal' | 'progress';

export default function BrowseCampaigns({ campaigns, onViewCampaign }: BrowseCampaignsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const filteredCampaigns = campaigns
    .filter((campaign) => {
      const query = searchQuery.toLowerCase();
      return (
        campaign.title.toLowerCase().includes(query) ||
        campaign.clubName.toLowerCase().includes(query) ||
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
    <div className="min-h-screen bg-dreamxec-cream relative overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute top-20 left-10 z-0 opacity-20">
        <StarDecoration className="w-16 h-16" color="#FF7F00" />
      </div>
      <div className="absolute top-40 right-20 z-0 opacity-20">
        <StarDecoration className="w-12 h-12" color="#0B9C2C" />
      </div>
      <div className="absolute bottom-32 left-1/4 z-0 opacity-15">
        <StarDecoration className="w-20 h-20" color="#000080" />
      </div>

      {/* Header Section */}
      <div className="relative bg-dreamxec-berkeley-blue border-b-8 border-dreamxec-orange shadow-pastel-saffron z-10">
        <div className="card-tricolor-tag"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-dreamxec-orange font-display">
              Browse Campaigns
            </h1>
            <StarDecoration className="w-10 h-10 hidden sm:block" color="#FF7F00" />
          </div>
          <p className="text-dreamxec-cream text-xl sm:text-2xl font-sans">
            Discover and support student-led initiatives
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Input */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dreamxec-navy opacity-60 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-4 border-dreamxec-navy rounded-lg text-lg font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-orange focus:ring-2 focus:ring-dreamxec-orange transition-all shadow-pastel-saffron"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <SlidersIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dreamxec-navy opacity-60 w-5 h-5 z-10" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full sm:w-auto pl-12 pr-10 py-3 border-4 border-dreamxec-navy rounded-lg text-lg  text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-green focus:ring-2 focus:ring-dreamxec-green transition-all appearance-none cursor-pointer shadow-pastel-green font-display font-bold"
            >
              <option value="recent">Most Recent</option>
              <option value="goal">Highest Goal</option>
              <option value="progress">Nearing Goal</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {filteredCampaigns.length === 0 ? (
          <div className="card-pastel-offwhite rounded-xl p-12 border-5 border-dreamxec-navy shadow-pastel-card text-center">
            <div className="card-tricolor-tag"></div>
            <div className="bg-dreamxec-cream border-5 border-dreamxec-navy w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchIcon className="w-12 h-12 text-dreamxec-navy" />
            </div>
            <p className="text-dreamxec-navy text-2xl font-display font-bold">
              No campaigns found matching your search
            </p>
            <p className="text-dreamxec-navy text-lg font-sans mt-2 opacity-80">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-dreamxec-orange text-white rounded-lg border-3 border-dreamxec-navy shadow-pastel-saffron">
                <span className="font-bold font-display text-lg">
                  {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Campaign Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onClick={() => onViewCampaign(campaign.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <FooterContent />
    </div>
  );
}

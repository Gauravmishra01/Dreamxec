import { useState } from 'react';
import type { Campaign } from '../types';
import CampaignCard from './CampaignCard';
import { StarDecoration } from './icons/StarDecoration';
import { FooterContent } from '../sections/Footer/components/FooterContent';

const SearchIcon = ({ className, style }: { className?: string , style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const SlidersIcon = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
    <div className="min-h-screen" style={{ background: '#FFF5E4', backgroundImage: 'radial-gradient(circle, #FF7F0018 1px, transparent 1px)', backgroundSize: '24px 24px' }}>

      {/* ── HERO HEADER ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0B1F3A 0%, #0a2e5c 100%)',
          borderBottom: '3px solid #111',
          boxShadow: '0 6px 0 #111',
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Orange stripe accent — bottom */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: '6px', background: 'repeating-linear-gradient(90deg, #FF7F00, #FF7F00 40px, #111 40px, #111 44px)' }}
        />

        {/* Star decorations */}
        <div className="absolute top-8 right-12 opacity-20">
          <StarDecoration className="w-14 h-14" color="#FF7F00" />
        </div>
        <div className="absolute bottom-10 left-10 opacity-10">
          <StarDecoration className="w-10 h-10" color="#0B9C2C" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          {/* Tag chip */}
          <div
            className="inline-flex items-center gap-2 mb-5"
            style={{
              background: '#FFE066',
              border: '2px solid #111',
              borderRadius: '5px',
              padding: '4px 14px',
              boxShadow: '3px 3px 0 #111',
              fontFamily: "'Sora', system-ui, sans-serif",
              fontSize: '12px',
              fontWeight: 800,
              color: '#111',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            🎯 DreamXec Platform
          </div>

          <div className="flex items-start gap-4 mb-4">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{
                fontFamily: "'Sora', system-ui, sans-serif",
                fontWeight: 900,
                color: '#FF7F00',
                letterSpacing: '-0.03em',
                textShadow: '4px 4px 0 #FF450044',
              }}
            >
              Explore Campaigns
            </h1>
            {/* <StarDecoration className="w-12 h-12 mt-2 flex-shrink-0" color="#FF7F00" /> */}
          </div>

          <p
            className="text-xl sm:text-2xl max-w-2xl leading-relaxed"
            style={{ color: 'rgba(255,245,228,0.90)', fontWeight: 500, fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            Discover and support student-led initiatives across clubs & colleges.
          </p>
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 mb-12">

          {/* Search input */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#111', opacity: 0.5 }} />
            <input
              type="text"
              placeholder="Search campaigns, clubs, colleges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '44px',
                paddingRight: '20px',
                paddingTop: '14px',
                paddingBottom: '14px',
                border: '2.5px solid #111',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 600,
                color: '#111',
                background: '#fff',
                boxShadow: '4px 4px 0 #111',
                outline: 'none',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                transition: 'box-shadow 0.15s ease, transform 0.15s ease',
              }}
              onFocus={e => {
                e.target.style.boxShadow = '6px 6px 0 #FF7F00';
                e.target.style.borderColor = '#FF7F00';
              }}
              onBlur={e => {
                e.target.style.boxShadow = '4px 4px 0 #111';
                e.target.style.borderColor = '#111';
              }}
            />
          </div>

          {/* Sort select */}
          <div className="relative">
            <SlidersIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
              style ={{ color: '#111', opacity: 0.6, zIndex: 1 }}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              style={{
                width: '100%',
                minWidth: '240px',
                paddingLeft: '44px',
                paddingRight: '36px',
                paddingTop: '14px',
                paddingBottom: '14px',
                border: '2.5px solid #111',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                color: '#111',
                background: '#fff',
                boxShadow: '4px 4px 0 #111',
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer',
                fontFamily: "'Sora', system-ui, sans-serif",
                transition: 'box-shadow 0.15s ease',
              }}
              onFocus={e => { e.target.style.boxShadow = '6px 6px 0 #0B9C2C'; e.target.style.borderColor = '#0B9C2C'; }}
              onBlur={e => { e.target.style.boxShadow = '4px 4px 0 #111'; e.target.style.borderColor = '#111'; }}
            >
              <option value="recent">Most Recent First</option>
              <option value="goal">Highest Goals</option>
              <option value="progress">Nearing Completion</option>
            </select>
            {/* custom arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── RESULTS ── */}
        {filteredCampaigns.length === 0 ? (
          <div
            className="text-center max-w-xl mx-auto p-16 sm:p-20"
            style={{
              background: '#fff',
              border: '2.5px solid #111',
              borderRadius: '16px',
              boxShadow: '6px 6px 0 #111',
            }}
          >
            <div
              className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
              style={{
                background: '#FFE066',
                border: '2.5px solid #111',
                borderRadius: '12px',
                boxShadow: '4px 4px 0 #111',
              }}
            >
              <SearchIcon className="w-12 h-12" style={{ color: '#111' }} />
            </div>
            <h2
              className="text-3xl sm:text-4xl mb-3"
              style={{
                fontFamily: "'Sora', system-ui, sans-serif",
                fontWeight: 900,
                color: '#111',
                letterSpacing: '-0.02em',
              }}
            >
              No Campaigns Found
            </h2>
            <p style={{ fontSize: '16px', color: '#555', fontWeight: 500, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          <div>
            {/* Results count badge */}
            <div className="mb-10">
              <div
                className="inline-flex items-center gap-3"
                style={{
                  background: '#FF7F00',
                  border: '2.5px solid #111',
                  borderRadius: '8px',
                  padding: '8px 18px',
                  boxShadow: '4px 4px 0 #111',
                  fontFamily: "'Sora', system-ui, sans-serif",
                }}
              >
                <span style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                  {filteredCampaigns.length}
                </span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                  campaign{filteredCampaigns.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Campaign Grid */}
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
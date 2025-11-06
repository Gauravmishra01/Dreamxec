import type { Campaign } from '../types';
import { StarDecoration } from './icons/StarDecoration';

interface CampaignCardProps {
  campaign: Campaign;
  onClick: () => void;
}

export default function CampaignCard({ campaign, onClick }: CampaignCardProps) {
  const progressPercentage = Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100);

  return (
    <div
      onClick={onClick}
      className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card overflow-hidden cursor-pointer group hover:scale-105 transition-transform duration-300 relative"
    >
      <div className="card-tricolor-tag"></div>
      
      {/* Campaign Image */}
      <div className="relative h-48 overflow-hidden mt-4">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 border-b-4 border-dreamxec-navy"
        />
      </div>

      {/* Campaign Content */}
      <div className="p-5">
        {/* Title and Club */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-dreamxec-navy mb-2 line-clamp-2 group-hover:text-dreamxec-orange transition-colors font-display">
            {campaign.title}
          </h3>
          <p className="text-base text-dreamxec-navy opacity-80 font-sans font-semibold">
            {campaign.clubName}
          </p>
        </div>

        {/* Funding Progress */}
        <div className="space-y-3">
          {/* Amount Raised */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-dreamxec-navy font-display">
              ₹{campaign.currentAmount.toLocaleString()}
            </span>
            <span className="text-base text-dreamxec-navy opacity-70 font-sans">
              of ₹{campaign.goalAmount.toLocaleString()}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-dreamxec-cream rounded-full h-3 overflow-hidden border-3 border-dreamxec-navy">
              <div
                className="h-full rounded-full transition-all duration-500 bg-tricolor-horizontal"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Progress Percentage */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-dreamxec-green text-white rounded-lg border-3 border-dreamxec-navy">
              <span className="font-bold font-display text-sm">
                {progressPercentage.toFixed(0)}% funded
              </span>
            </div>
            <StarDecoration className="w-5 h-5" color="#FF7F00" />
          </div>
        </div>
      </div>
    </div>
  );
}

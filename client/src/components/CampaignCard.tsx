import type { Campaign } from '../types';
import { StarDecoration } from './icons/StarDecoration';

interface CampaignCardProps {
  campaign: Campaign;
  href: string;
}

export default function CampaignCard({ campaign, href }: CampaignCardProps) {
  const currentAmount = campaign.currentAmount ?? 0;
  const goalAmount = campaign.goalAmount ?? 0;
  const progressPercentage = goalAmount > 0 ? Math.min(
    (currentAmount / goalAmount) * 100,
    100
  ) : 0;

  return (
    <a href={href} className="block focus:outline-none focus:ring-2 focus:ring-dreamxec-orange/50 rounded-xl h-full">
      <div className="card-pastel-offwhite rounded-xl border-2 border-dreamxec-navy shadow-pastel-card overflow-hidden group hover:shadow-xl hover:border-dreamxec-orange/70 transition-all duration-300 h-full flex flex-col">

        {/* <div className="card-tricolor-tag"></div> */}

        {/* Image */}
        <div className="relative w-full aspect-video  overflow-hidden">
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500 border-b-2 border-dreamxec-navy"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-dreamxec-navy mb-3 line-clamp-2 leading-tight font-display">
              {campaign.title}
            </h3>

            <div className="flex flex-col sm:flex-row gap-2 text-sm text-dreamxec-navy/70 font-medium">
              <span>{campaign.club?.college || 'DreamXec Academy'}</span>
              <span className="text-dreamxec-orange">•</span>
              <span>{campaign.club?.name || 'DreamXec Club'}</span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="mt-auto space-y-4">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-2xl font-bold text-dreamxec-navy">
                ₹{currentAmount.toLocaleString()}
              </span>
              <span className="text-sm text-dreamxec-navy/60">
                of ₹{goalAmount.toLocaleString()}
              </span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border-2 border-dreamxec-navy/50">
              <div
                className="h-full bg-gradient-to-r from-dreamxec-green to-emerald-600 rounded-full transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="px-3 py-1.5 bg-dreamxec-green text-white rounded-lg font-semibold text-sm border border-dreamxec-navy/30">
                {progressPercentage.toFixed(0)}% funded
              </div>
              <StarDecoration className="w-5 h-5 text-dreamxec-orange" color="#FF7F00" />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

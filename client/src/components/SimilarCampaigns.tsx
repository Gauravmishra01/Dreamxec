import { useNavigate } from 'react-router-dom';
import type { Campaign } from '../types';

interface Props {
  campaigns: Campaign[];
  currentCampaign: Campaign;
}

export default function SimilarCampaigns({
  campaigns,
  currentCampaign,
}: Props) {
  const navigate = useNavigate();

  const similar = campaigns
    .filter(
      c =>
        c.id !== currentCampaign.id &&
        c.category === currentCampaign.category
    )
    .slice(0, 6);

  if (similar.length === 0) return null;

  return (
    <section className="mt-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-dreamxec-navy font-display">
          Similar Campaigns
        </h3>
        <span className="text-sm text-dreamxec-navy/60 font-medium">
          You may also like
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {similar.map(campaign => {
          const progress = Math.min(
            (campaign.currentAmount / campaign.goalAmount) * 100,
            100
          );

          return (
            <div
              key={campaign.id}
              onClick={() => navigate(`/campaign/${campaign.id}`)}
              className="
                group
                bg-dreamxec-cream
                rounded-xl
                border-2 border-dreamxec-navy
                shadow-pastel-card
                cursor-pointer
                transition-all
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="h-40 w-full object-cover rounded-t-xl"
                />

                {/* Category */}
                <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold bg-white/90 border-2 border-dreamxec-navy rounded-full text-dreamxec-navy">
                  {campaign.category}
                </span>

                {/* Progress chip */}
                <span
                  className={`
                    absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full border-2 border-dreamxec-navy
                    ${progress >= 80
                      ? 'bg-dreamxec-orange text-white'
                      : 'bg-dreamxec-green text-white'}
                  `}
                >
                  {progress.toFixed(0)}%
                </span>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h4 className="font-bold text-dreamxec-navy text-base leading-snug line-clamp-2">
                  {campaign.title}
                </h4>

                {/* Progress bar */}
                <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-dreamxec-navy/20">
                  <div
                    className="h-full bg-gradient-to-r from-dreamxec-green to-dreamxec-saffron transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Numbers */}
                <div className="flex justify-between text-xs font-medium text-dreamxec-navy/80">
                  <span>
                    ₹{campaign.currentAmount.toLocaleString()} raised
                  </span>
                  <span>
                    ₹{campaign.goalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

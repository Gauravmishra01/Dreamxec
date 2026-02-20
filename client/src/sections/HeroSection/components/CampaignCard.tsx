import type { HeroCampaign } from "../../../hooks/useHeroCampaigns";
import { StarDecoration } from "../../../components/icons/StarDecoration";

type Props = {
  campaign: HeroCampaign;
};

export const CampaignCard = ({ campaign }: Props) => {
  const progressPercentage = Math.min(
    Math.round((campaign.raised / campaign.goal) * 100),
    100
  );

  return (
    <a
      href={`/campaign/${campaign.id}`}
      className="block focus:outline-none focus:ring-4 focus:ring-dreamxec-orange/40 rounded-xl h-full"
    >
      <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card overflow-hidden group hover:scale-105 transition-transform duration-300 relative h-full flex flex-col">
        
        <div className="card-tricolor-tag"></div>

        {/* Campaign Image - Fixed aspect ratio container */}
        <div className="relative w-full aspect-video mt-4 overflow-hidden">
          <img
            src={campaign.image}
            alt={campaign.title}
            className="absolute bg-dreamxec-gray-800 inset-0 w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 border-b-4 border-dreamxec-navy"
            loading="lazy"
          />
        </div>

        {/* Campaign Content - Grows to fill remaining space */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col">
          <div className="mb-4 flex-shrink-0">
            <h3 className="text-lg sm:text-xl font-bold text-dreamxec-navy mb-2 line-clamp-2 group-hover:text-dreamxec-orange transition-colors font-display min-h-[3.5rem]">
              {campaign.title}
            </h3>
            <p className="text-sm sm:text-base text-dreamxec-navy opacity-80 font-sans font-semibold line-clamp-1">
              {campaign.category}
            </p>
          </div>

          <div className="space-y-3 mt-auto">
            <div className="flex justify-between items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-dreamxec-navy font-display truncate">
                ₹{campaign.raised.toLocaleString()}
              </span>
              <span className="text-sm sm:text-base text-dreamxec-navy opacity-70 font-sans whitespace-nowrap">
                of ₹{campaign.goal.toLocaleString()}
              </span>
            </div>

            <div className="relative">
              <div className="w-full bg-dreamxec-cream rounded-full h-3 overflow-hidden border-3 border-dreamxec-navy">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-tricolor-horizontal"
                  style={{ width: `${progressPercentage}%` }}
                  role="progressbar"
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-dreamxec-green text-white rounded-lg border-3 border-dreamxec-navy">
                <span className="font-bold font-display text-xs sm:text-sm whitespace-nowrap">
                  {progressPercentage.toFixed(0)}% funded
                </span>
              </div>
              <StarDecoration className="w-5 h-5 flex-shrink-0" color="#FF7F00" />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};


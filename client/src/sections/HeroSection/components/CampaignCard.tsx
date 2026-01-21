import { useNavigate } from "react-router-dom";
import type { HeroCampaign } from "../../../hooks/useHeroCampaigns";

type Props = {
  campaign: HeroCampaign;
};

export const CampaignCard = ({ campaign }: Props) => {
  const navigate = useNavigate();

  const progress = Math.min(
    Math.round((campaign.raised / campaign.goal) * 100),
    100
  );

  return (
    <article
      className="
        w-full
        h-full
        card-pastel rounded-2xl
        overflow-hidden
        flex flex-col
      "
    >
      {/* Fixed height image container */}
      <div className="h-40 sm:h-48 w-full bg-gray-100 flex-shrink-0">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content with flex-1 to fill space */}
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        {/* Header - fixed size */}
        <div className="flex-shrink-0">
          <span className="text-xs font-semibold text-dreamxec-navy/70">
            {campaign.category}
          </span>

          <h3 className="mt-2 text-base sm:text-lg font-bold text-dreamxec-navy line-clamp-2 min-h-[3rem]">
            {campaign.title}
          </h3>
        </div>

        {/* Spacer - grows to push content to bottom */}
        <div className="flex-1 min-h-[1rem]" />

        {/* Progress - stays at bottom */}
        <div className="flex-shrink-0">
          <div className="flex justify-between text-xs font-semibold text-dreamxec-navy mb-1">
            <span>₹{campaign.raised.toLocaleString()}</span>
            <span>₹{campaign.goal.toLocaleString()}</span>
          </div>

          <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-dreamxec-berkeley-blue transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* CTA button - stays at bottom */}
        <button
          onClick={() => navigate(`/campaign/${campaign.id}`)}
          className="
            mt-4 sm:mt-6 w-full py-2.5 rounded-full
            bg-dreamxec-berkeley-blue
            text-white font-semibold text-sm sm:text-base
            hover:bg-dreamxec-berkeley-blue/90
            active:scale-[0.98]
            transition-all duration-200
            flex-shrink-0
          "
        >
          View Campaign
        </button>
      </div>
    </article>
  );
};


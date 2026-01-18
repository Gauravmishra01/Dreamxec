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
        min-w-[280px] md:min-w-[320px]
        h-full
        card-pastel rounded-2xl
        overflow-hidden
        flex flex-col
      "
    >
      {/* Image */}
      <img
        src={campaign.image}
        alt={campaign.title}
        className="h-40 w-full object-cover"
      />

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-xs font-semibold text-dreamxec-navy/70">
            {campaign.category}
          </span>

          <h3 className="mt-2 text-lg font-bold text-dreamxec-navy">
            {campaign.title}
          </h3>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-dreamxec-navy mb-1">
            <span>₹{campaign.raised.toLocaleString()} raised</span>
            <span>Goal ₹{campaign.goal.toLocaleString()}</span>
          </div>

          <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-dreamxec-berkeley-blue"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate(`/campaign/${campaign.id}`)}
          className="
            mt-6 w-full py-2 rounded-full
            bg-dreamxec-berkeley-blue
            text-white font-semibold
          "
        >
          View Campaign
        </button>
      </div>
    </article>
  );
};

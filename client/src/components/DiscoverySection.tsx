import RecentlyViewedCarousel from './RecentlyViewedCarousel';
import SimilarCampaigns from './SimilarCampaigns';
import type { Campaign } from '../types';

interface Props {
  campaigns: Campaign[];
  currentCampaign: Campaign;
}

export default function DiscoverySection({
  campaigns,
  currentCampaign,
}: Props) {
  return (
    <div className="mt-16 border-t-4 border-dreamxec-navy ">
      <RecentlyViewedCarousel />
      <SimilarCampaigns
        campaigns={campaigns}
        currentCampaign={currentCampaign}
      />
    </div>
  );
}

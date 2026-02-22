import { useNavigate } from 'react-router-dom';
import type { Campaign } from '../types';

interface Props {
  campaigns: Campaign[];
  currentCampaign: Campaign;
}

export default function SimilarCampaigns({ campaigns, currentCampaign }: Props) {
  const navigate = useNavigate();

  const similar = campaigns
    .filter(c => c.id !== currentCampaign.id && c.category === currentCampaign.category)
    .slice(0, 6);

  if (similar.length === 0) return null;

  return (
    <section className="mt-14 sm:mt-16">

      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-7 bg-dreamxec-orange flex-shrink-0" />
          <h3 className="text-xl sm:text-2xl font-black text-dreamxec-navy uppercase tracking-tight">
            Similar Campaigns
          </h3>
        </div>
        <span
          className="text-[10px] font-black uppercase tracking-widest text-dreamxec-navy/50 px-2.5 py-1"
          style={{ border: '2px dashed #003366' }}
        >
          You may also like
        </span>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {similar.map(campaign => {
          const progress = Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100);
          const totalMilestones = campaign.milestones?.length ?? 0;
          const completedMilestones = campaign.milestones?.filter((m: any) => m.status === 'APPROVED').length ?? 0;

          return (
            <div
              key={campaign.id}
              onClick={() => navigate(`/campaign/${campaign.id}`)}
              className="bg-white flex flex-col cursor-pointer transition-all duration-200 hover:translate-x-[-3px] hover:translate-y-[-3px]"
              style={{ border: '3px solid #003366', boxShadow: '5px 5px 0 #FF7F00' }}
            >
              {/* Top stripe */}
              <div className="h-1.5 flex-shrink-0" style={{ background: '#FF7F00' }} />

              {/* Image */}
              <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />

                {/* Progress % chip */}
                <div
                  className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-black text-white"
                  style={{
                    background: progress >= 80 ? '#FF7F00' : '#0B9C2C',
                    border: '2px solid #003366',
                  }}
                >
                  {progress.toFixed(0)}%
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4 flex flex-col flex-1">

                {/* Category + Milestone badge row */}
              

                <div className="flex items-center justify-between gap-2 mb-2.5">

                  {/* Category chip */}
                  <span
                    className="inline-block px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-widest flex-shrink-0"
                    style={{ background: '#FF7F00', border: '2px solid #003366' }}
                  >
                    {campaign.category || 'Technology'}
                  </span>

                  <div className="flex items-center gap-1.5 flex-shrink-0">

                    {/* Rating */}
                    {campaign.rating != null && (
                      <div
                        className="flex items-center gap-1 px-2 py-0.5"
                        style={{ border: '2px solid #FF7F00', background: '#fff7ed' }}
                      >
                        <svg className="w-2.5 h-2.5 text-dreamxec-orange" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span className="text-[10px] font-black text-dreamxec-orange">
                          {campaign.rating.toFixed(1)}
                        </span>
                      </div>
                    )}

                    {/* Milestones */}
                    {totalMilestones > 0 && (
                      <div
                        className="flex items-center gap-1 px-2 py-0.5"
                        style={{ border: '2px solid #003366', background: '#fff' }}
                        title={`${completedMilestones} of ${totalMilestones} milestones completed`}
                      >
                        <svg className="w-2.5 h-2.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#003366" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[10px] font-black text-dreamxec-navy whitespace-nowrap">
                          <span className="font-bold text-dreamxec-navy/40">MS </span>
                          {completedMilestones}<span className="text-dreamxec-navy/40">/{totalMilestones}</span>
                        </span>
                      </div>
                    )}

                  </div>
                </div>

                {/* Title */}
                <h4 className="font-black text-dreamxec-navy text-sm sm:text-base uppercase tracking-tight leading-snug line-clamp-2 mb-3">
                  {campaign.title}
                </h4>

                <div className="mt-auto space-y-1.5">
                  {/* Progress bar */}
                  <div
                    className="w-full h-2.5 overflow-hidden"
                    style={{ border: '2px solid #003366', background: '#f3f4f6' }}
                  >
                    <div
                      className="h-full bg-dreamxec-orange transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Amounts */}
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] sm:text-xs font-black text-dreamxec-navy">
                      ₹{campaign.currentAmount.toLocaleString()} raised
                    </span>
                    <span className="text-[10px] font-bold text-dreamxec-navy/50">
                      ₹{campaign.goalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
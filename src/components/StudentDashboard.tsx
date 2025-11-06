import type { Campaign } from '../types';
import { StarDecoration } from './icons/StarDecoration';
import imageIcon from '../assets/image.png';
import image1Icon from '../assets/image1.png';
import imageCopyIcon from '../assets/imagecopy.png';

interface StudentDashboardProps {
  studentName: string;
  campaigns: Campaign[];
  onCreateCampaign: () => void;
  onViewCampaign: (id: string) => void;
}

export default function StudentDashboard({
  studentName,
  campaigns,
  onCreateCampaign,
  onViewCampaign,
}: StudentDashboardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <div className="w-5 h-5 bg-dreamxec-green border-2 border-dreamxec-navy rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        );
      case 'pending':
        return (
          <div className="w-5 h-5 bg-dreamxec-orange border-2 border-dreamxec-navy rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">⏱</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="w-5 h-5 bg-red-600 border-2 border-dreamxec-navy rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">✕</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-dreamxec-green border-dreamxec-navy text-white',
      pending: 'bg-dreamxec-orange border-dreamxec-navy text-white',
      rejected: 'bg-red-600 border-dreamxec-navy text-white',
    };
    return (
      <span
        className={`px-4 py-2 rounded-lg text-base sm:text-lg font-bold border-3 ${
          styles[status as keyof typeof styles]
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const totalRaised = campaigns
    .filter((c) => c.status === 'approved')
    .reduce((sum, c) => sum + c.currentAmount, 0);

  const approvedCount = campaigns.filter((c) => c.status === 'approved').length;
  const pendingCount = campaigns.filter((c) => c.status === 'pending').length;
  const rejectedCount = campaigns.filter((c) => c.status === 'rejected').length;
  const activeCampaigns = campaigns.filter((c) => c.status !== 'rejected');
  const rejectedCampaigns = campaigns.filter((c) => c.status === 'rejected');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Use existing Header component */}
      {/* <Header /> */}

      {/* Decorative floating stars - original theme */}
      <div className="absolute top-20 left-10 z-0 opacity-20">
        <StarDecoration className="w-16 h-16" color="#FF7F00" />
      </div>
      <div className="absolute top-40 right-20 z-0 opacity-20">
        <StarDecoration className="w-12 h-12" color="#0B9C2C" />
      </div>
      <div className="absolute bottom-32 left-1/4 z-0 opacity-15">
        <StarDecoration className="w-20 h-20" color="#000080" />
      </div>

      {/* Enhanced decorative images - LEFT SIDE - Brighter and animated */}
      <div className="absolute top-32 left-5 z-0 opacity-5 animate-pulse">
        <img src={imageIcon} alt="" className="w-40 h-40 md:w-52 md:h-52 object-contain drop-shadow-lg" />
      </div>
      <div className="absolute top-1/3 left-8 z-0 opacity-10 animate-bounce" style={{ animationDuration: '3s' }}>
        <img src={image1Icon} alt="" className="w-44 h-44 md:w-56 md:h-56 object-contain drop-shadow-xl" />
      </div>
      <div className="absolute bottom-40 left-12 z-0 opacity-25 animate-pulse" style={{ animationDuration: '2s' }}>
        <img src={imageCopyIcon} alt="" className="w-48 h-48 md:w-60 md:h-60 object-contain drop-shadow-2xl" />
      </div>
      <div className="absolute top-2/3 left-4 z-0 opacity-20 hidden lg:block">
        <img src={imageIcon} alt="" className="w-40 h-40 object-contain drop-shadow-lg animate-pulse" style={{ animationDuration: '2.5s' }} />
      </div>

      {/* Enhanced decorative images - RIGHT SIDE - Brighter and animated */}
      <div className="absolute top-24 right-8 z-0 opacity-25 animate-bounce" style={{ animationDuration: '2.5s' }}>
        <img src={image1Icon} alt="" className="w-44 h-44 md:w-56 md:h-56 object-contain drop-shadow-lg" />
      </div>
      <div className="absolute top-1/2 right-5 z-0 opacity-20 animate-pulse" style={{ animationDuration: '3s' }}>
        <img src={imageCopyIcon} alt="" className="w-40 h-40 md:w-52 md:h-52 object-contain drop-shadow-xl" />
      </div>
      <div className="absolute bottom-48 right-10 z-0 opacity-25 animate-bounce" style={{ animationDuration: '3.5s' }}>
        <img src={imageIcon} alt="" className="w-48 h-48 md:w-60 md:h-60 object-contain drop-shadow-2xl" />
      </div>
      <div className="absolute top-1/4 right-6 z-0 opacity-20 hidden lg:block">
        <img src={image1Icon} alt="" className="w-40 h-40 object-contain drop-shadow-lg animate-pulse" style={{ animationDuration: '2s' }} />
      </div>
      <div className="absolute bottom-1/4 right-4 z-0 opacity-20 hidden md:block">
        <img src={imageCopyIcon} alt="" className="w-36 h-36 object-contain drop-shadow-xl animate-pulse" />
      </div>
      {/* Header Section with Tricolor Accent */}
      <div className="relative bg-dreamxec-navy border-b-8 border-dreamxec-orange shadow-pastel-saffron z-10">
        <div className="card-tricolor-tag"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-dreamxec-orange font-display">
              Welcome back, {studentName}!
            </h1>
            <StarDecoration className="w-10 h-10 hidden sm:block" color="#FF7F00" />
          </div>
          <p className="text-dreamxec-cream text-xl sm:text-2xl font-sans">
            Manage your fundraising campaigns and track your progress
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Stats Cards - Oil Pastel Style */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Total Raised Card */}
          <div className="card-pastel rounded-xl p-6 card-pastel-tilt-left hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <p className="text-dreamxec-navy text-base sm:text-lg font-bold font-display">
                Total Raised
              </p>
              <div className="icon-pastel-container w-10 h-10 p-2">
                <span className="text-dreamxec-saffron text-xl">↗</span>
              </div>
            </div>
            <p className="text-5xl sm:text-6xl font-bold text-dreamxec-navy font-display">
              ₹{totalRaised.toLocaleString()}
            </p>
            <div className="mt-2 h-1 bg-tricolor-horizontal rounded"></div>
          </div>

          {/* Active Campaigns Card */}
          <div className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <p className="text-dreamxec-navy text-base sm:text-lg font-bold font-display">
                Active Campaigns
              </p>
              <div className="icon-pastel-container w-10 h-10 p-2">
                <span className="text-dreamxec-green text-xl">✓</span>
              </div>
            </div>
            <p className="text-5xl sm:text-6xl font-bold text-dreamxec-navy font-display">
              {approvedCount}
            </p>
            <div className="mt-2 h-1 bg-dreamxec-green rounded"></div>
          </div>

          {/* Pending Review Card */}
          <div className="card-pastel rounded-xl p-6 card-pastel-tilt-right hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <p className="text-dreamxec-navy text-base sm:text-lg font-bold font-display">
                Pending Review
              </p>
              <div className="icon-pastel-container w-10 h-10 p-2">
                <span className="text-dreamxec-orange text-xl">⏱</span>
              </div>
            </div>
            <p className="text-5xl sm:text-6xl font-bold text-dreamxec-navy font-display">
              {pendingCount}
            </p>
            <div className="mt-2 h-1 bg-dreamxec-orange rounded"></div>
          </div>
        </div>

        {/* Main Campaigns Section */}
        <div className="card-pastel-offwhite rounded-xl p-6 sm:p-8 border-5 border-dreamxec-navy shadow-pastel-card">
          <div className="card-tricolor-tag"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 mt-4">
            <div className="flex items-center gap-3">
              <h2 className="text-4xl sm:text-5xl font-bold text-dreamxec-navy font-display">
                Your Campaigns
              </h2>
              <StarDecoration className="w-8 h-8" color="#0B9C2C" />
            </div>
            <button
              onClick={onCreateCampaign}
              className="btn-pastel-primary inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-display text-xl sm:text-2xl"
            >
              <span className="text-3xl leading-none">+</span>
              Create New Campaign
            </button>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-dreamxec-cream border-5 border-dreamxec-navy w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-pastel-saffron">
                <span className="text-dreamxec-orange text-5xl font-bold">+</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy mb-3 font-display">
                No campaigns yet
              </h3>
              <p className="text-dreamxec-navy text-xl sm:text-2xl mb-6 font-sans max-w-md mx-auto">
                Create your first campaign to start raising funds for your club and make an impact!
              </p>
              <button
                onClick={onCreateCampaign}
                className="btn-pastel-secondary inline-flex items-center gap-2 px-8 py-4 rounded-lg font-display text-xl sm:text-2xl"
              >
                <span className="text-3xl leading-none">+</span>
                Create Campaign
              </button>
            </div>
          ) : (
            <>
              {activeCampaigns.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-4 border-dreamxec-navy">
                        <th className="text-left py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display">
                          Campaign
                        </th>
                        <th className="text-left py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display hidden sm:table-cell">
                          Goal
                        </th>
                        <th className="text-left py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display hidden md:table-cell">
                          Raised
                        </th>
                        <th className="text-left py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display">
                          Status
                        </th>
                        <th className="text-right py-4 px-4 text-base sm:text-lg font-bold text-dreamxec-navy font-display">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeCampaigns.map((campaign, index) => {
                        const progress = (campaign.currentAmount / campaign.goalAmount) * 100;
                        return (
                          <tr
                            key={campaign.id}
                            className={`border-b-2 border-dreamxec-gray-200 hover:bg-dreamxec-cream transition-colors ${
                              index % 2 === 0 ? 'bg-white' : 'bg-dreamxec-beige'
                            }`}
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(campaign.status)}
                                <div>
                                  <p className="font-bold text-lg sm:text-xl text-dreamxec-navy font-display">
                                    {campaign.title}
                                  </p>
                                  <p className="text-base text-dreamxec-navy opacity-70 font-sans">
                                    {campaign.clubName}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-lg sm:text-xl text-dreamxec-navy font-bold font-sans hidden sm:table-cell">
                              ₹{campaign.goalAmount.toLocaleString()}
                            </td>
                            <td className="py-4 px-4 hidden md:table-cell">
                              <div>
                                <p className="font-bold text-lg sm:text-xl text-dreamxec-navy font-sans">
                                  ₹{campaign.currentAmount.toLocaleString()}
                                </p>
                                <div className="progress-bar-pastel mt-2 h-3 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-dreamxec-green transition-all"
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                  ></div>
                                </div>
                                <p className="text-sm text-dreamxec-navy opacity-70 mt-1 font-sans">
                                  {progress.toFixed(0)}% funded
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4">{getStatusBadge(campaign.status)}</td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => onViewCampaign(campaign.id)}
                                className="bg-dreamxec-orange text-white px-5 py-3 rounded-lg font-bold text-base sm:text-lg border-3 border-dreamxec-navy hover:translate-x-1 hover:translate-y-1 transition-transform font-display shadow-pastel-saffron"
                              >
                                View →
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Rejected Campaigns Section */}
              {rejectedCampaigns.length > 0 && (
                <div className="mt-12">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-3xl sm:text-4xl font-bold text-red-600 font-display">
                      Rejected Campaigns
                    </h3>
                    <div className="w-8 h-8 bg-red-600 border-2 border-dreamxec-navy rounded flex items-center justify-center">
                      <span className="text-white text-lg font-bold">✕</span>
                    </div>
                    <span className="text-lg text-dreamxec-navy font-bold font-sans">
                      ({rejectedCount})
                    </span>
                  </div>

                  <div className="space-y-4">
                    {rejectedCampaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="card-pastel-offwhite rounded-xl p-6 border-5 border-red-600 shadow-lg"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              {getStatusIcon(campaign.status)}
                              <div>
                                <h4 className="font-bold text-xl sm:text-2xl text-dreamxec-navy font-display">
                                  {campaign.title}
                                </h4>
                                <p className="text-base text-dreamxec-navy opacity-70 font-sans">
                                  {campaign.clubName}
                                </p>
                              </div>
                            </div>
                            
                            {campaign.rejectionReason && (
                              <div className="mt-4 p-4 bg-red-50 border-3 border-red-600 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <div className="icon-pastel-container w-8 h-8 p-1 flex-shrink-0 bg-red-600">
                                    <span className="text-white text-lg">!</span>
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm text-red-600 mb-1 font-display">
                                      REJECTION REASON:
                                    </p>
                                    <p className="text-dreamxec-navy font-sans text-base leading-relaxed">
                                      {campaign.rejectionReason}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 md:flex-col">
                            {getStatusBadge(campaign.status)}
                            <button
                              onClick={() => onViewCampaign(campaign.id)}
                              className="bg-dreamxec-navy text-white px-5 py-3 rounded-lg font-bold text-base sm:text-lg border-3 border-dreamxec-navy hover:scale-105 transition-transform font-display shadow-lg whitespace-nowrap"
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Info about resubmission */}
                  <div className="mt-6 card-pastel rounded-xl p-5 border-4 border-dreamxec-orange shadow-pastel-saffron">
                    <div className="flex items-start gap-3">
                      <div className="icon-pastel-container w-10 h-10 p-2 flex-shrink-0">
                        <span className="text-dreamxec-saffron text-xl">💡</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-dreamxec-navy mb-2 font-display">
                          About Rejected Campaigns
                        </h4>
                        <p className="text-dreamxec-navy font-sans text-base leading-relaxed">
                          Review the rejection reason above and address the concerns. You can create a new campaign 
                          with the necessary improvements. Contact support if you need clarification on the rejection.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Additional Info Card */}
        <div className="mt-8 card-pastel rounded-xl p-6 border-5 border-dreamxec-navy shadow-pastel-green">
          <div className="flex items-start gap-4">
            <div className="icon-pastel-container w-12 h-12 p-2 flex-shrink-0">
              <span className="text-dreamxec-saffron text-2xl">💡</span>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-dreamxec-navy mb-2 font-display">
                Pro Tip
              </h3>
              <p className="text-dreamxec-navy font-sans leading-relaxed text-lg sm:text-xl">
                Keep your campaign description clear and compelling. Include specific goals, 
                timelines, and how the funds will be used. Add images to make your campaign 
                more engaging and trustworthy!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

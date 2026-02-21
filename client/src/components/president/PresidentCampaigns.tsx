import React, { useEffect, useState } from "react";
import {
  getApprovedClubCampaigns,
  getPendingClubCampaigns,
  getRejectedClubCampaigns,
  type ClubCampaign,
} from "../../services/clubService";
import type { Campaign } from '../../types';

interface PresidentCampaignsProps {
  clubId: string;
}

type CampaignTab = "APPROVED" | "PENDING" | "REJECTED";

export default function PresidentCampaigns({ clubId }: PresidentCampaignsProps) {
  const [campaigns, setCampaigns] = useState<ClubCampaign[]>([]);
  const [activeTab, setActiveTab] = useState<CampaignTab>("APPROVED");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCampaign, setSelectedCampaign] = useState<ClubCampaign | null>(null);

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, clubId]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      let res;

      if (activeTab === "APPROVED") {
        res = await getApprovedClubCampaigns(clubId);
      } else if (activeTab === "PENDING") {
        res = await getPendingClubCampaigns(clubId);
      } else {
        res = await getRejectedClubCampaigns(clubId);
      }

      const campaignsData =
        res.data?.campaigns ||
        res.data?.data?.campaigns ||
        res.data?.data ||
        [];

      setCampaigns(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const statusColor: Record<CampaignTab, string> = {
    APPROVED: "bg-green-100 text-green-700 border-green-300",
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
    REJECTED: "bg-red-100 text-red-700 border-red-300",
  };

  const statusIcon: Record<CampaignTab, string> = {
    APPROVED: "✓",
    PENDING: "⏳",
    REJECTED: "✕",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-dreamxec-navy mb-6">
        Club Campaigns
      </h1>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
        {(["APPROVED", "PENDING", "REJECTED"] as CampaignTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all
        ${activeTab === tab
                ? "bg-dreamxec-navy text-white shadow-lg sm:scale-105"
                : "bg-white border-2 border-dreamxec-navy text-dreamxec-navy hover:bg-dreamxec-orange hover:text-white hover:border-dreamxec-orange"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>



      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dreamxec-navy"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No {activeTab.toLowerCase()} campaigns found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(c => {
            const progress =
              c.status === "APPROVED" && c.goalAmount > 0
                ? Math.min((c.amountRaised / c.goalAmount) * 100, 100)
                : 0;

            return (
              <div
                key={c.id}
                className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {/* Campaign Image */}
                {c.imageUrl && (
                  <div className="w-full h-40 mb-4 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={c.imageUrl}
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${statusColor[c.status]}`}
                >
                  <span>{statusIcon[c.status]}</span>
                  {c.status}
                </span>

                {/* Title */}
                <h3 className="text-xl font-bold text-dreamxec-navy mb-2 line-clamp-2">
                  {c.title}
                </h3>

                {/* Company & Type */}
                <p className="text-sm text-gray-600 mb-3">
                  {c.companyName} • {c.campaignType}
                </p>

                {/* Description Preview */}
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                  {c.description}
                </p>

                {/* Progress Bar (for approved) */}
                {c.status === "APPROVED" && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-gray-700">₹{c.amountRaised.toLocaleString()}</span>
                      <span className="text-gray-500">₹{c.goalAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% funded</p>
                  </div>
                )}

                {/* View Details Button */}
                <button
                  onClick={() => setSelectedCampaign(c)}
                  className="w-full bg-dreamxec-orange text-white font-semibold py-2.5 rounded-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedCampaign && (
        <CampaignModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  );
}

// Campaign Detail Modal Component
interface CampaignModalProps {
  campaign: ClubCampaign;
  onClose: () => void;
}

function CampaignModal({ campaign, onClose }: CampaignModalProps) {
  const progress =
    campaign.status === "APPROVED" && campaign.goalAmount > 0
      ? Math.min((campaign.amountRaised / campaign.goalAmount) * 100, 100)
      : 0;

  const statusColor: Record<string, string> = {
    APPROVED: "bg-green-100 text-green-700 border-green-300",
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
    REJECTED: "bg-red-100 text-red-700 border-red-300",
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-4 left-full ml-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all z-10"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {/* Header Section */}
          <div className="border-b-4 border-dreamxec-navy pb-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-dreamxec-navy mb-2">
                  {campaign.title}
                </h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="font-semibold">{campaign.companyName}</span>
                  <span className="text-gray-400">•</span>
                  <span className="bg-dreamxec-navy text-white px-3 py-1 rounded-full text-sm">
                    {campaign.campaignType}
                  </span>
                </p>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${statusColor[campaign.status]}`}
              >
                {campaign.status}
              </span>
            </div>

            {/* Main Image */}
            {campaign.imageUrl && (
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-80 object-cover rounded-xl shadow-md"
              />
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-dreamxec-navy mb-3">About Campaign</h3>
            <p className="text-gray-700 leading-relaxed">{campaign.description}</p>
          </div>

          {/* Financial Info */}
          <div className="bg-gradient-to-br from-dreamxec-navy to-blue-900 text-white rounded-xl p-6 mb-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Financial Overview</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-blue-200 text-sm mb-1">Goal Amount</p>
                <p className="text-2xl font-bold">₹{campaign.goalAmount.toLocaleString()}</p>
              </div>
              {campaign.status === "APPROVED" && (
                <div>
                  <p className="text-blue-200 text-sm mb-1">Amount Raised</p>
                  <p className="text-2xl font-bold text-green-300">₹{campaign.amountRaised.toLocaleString()}</p>
                </div>
              )}
            </div>

            {campaign.status === "APPROVED" && (
              <>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-blue-200">{progress.toFixed(1)}% of goal achieved</p>
              </>
            )}
          </div>

          {/* Skills Required */}
          {campaign.skillsRequired?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-dreamxec-navy mb-3">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {campaign.skillsRequired.map(skill => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-dreamxec-orange text-white rounded-full text-sm font-medium shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Media Gallery */}
          {campaign.campaignMedia?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-dreamxec-navy mb-3">Media Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {campaign.campaignMedia.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Campaign media ${i + 1}`}
                    className="h-32 w-full object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Team Members */}
          {campaign.teamMembers?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-dreamxec-navy mb-3">Team Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {campaign.teamMembers.map(m => (
                  <div key={m.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-dreamxec-orange">
                    <p className="font-semibold text-dreamxec-navy">{m.name}</p>
                    <p className="text-sm text-gray-600">{m.email}</p>
                    {m.role && (
                      <p className="text-sm text-dreamxec-orange font-medium mt-1">{m.role}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {campaign.faqs?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-dreamxec-navy mb-3">FAQs</h3>
              <div className="space-y-3">
                {campaign.faqs.map((f, i) => (
                  <div key={i} className="bg-blue-50 rounded-lg p-4 border-l-4 border-dreamxec-navy">
                    <p className="font-semibold text-dreamxec-navy mb-2">{f.question}</p>
                    <p className="text-gray-700 text-sm">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-4 mb-6 flex-wrap">
            {campaign.presentationDeckUrl && (
              <a
                href={campaign.presentationDeckUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md font-medium"
              >
                📄 View Pitch Deck
              </a>
            )}
            {campaign.youtubeUrl && (
              <a
                href={campaign.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-all shadow-md font-medium"
              >
                ▶ Watch on YouTube
              </a>
            )}
          </div>

          {/* Rejection Reason */}
          {campaign.status === "REJECTED" && campaign.rejectionReason && (
            <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="font-bold text-red-700 mb-2 flex items-center gap-2">
                <span>⚠</span> Rejection Reason
              </p>
              <p className="text-red-600">{campaign.rejectionReason}</p>
            </div>
          )}

          {/* Meta Information */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <p className="font-semibold text-gray-700">Created</p>
                <p>{new Date(campaign.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Last Updated</p>
                <p>{new Date(campaign.updatedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Owner ID</p>
                <p className="font-mono text-xs">{campaign.userId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

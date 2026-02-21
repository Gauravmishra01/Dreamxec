import React, { useEffect, useState } from 'react';
import { getMyDonations, type Donation } from '../services/donationService';

interface Props {
  onClose: () => void;
}

export default function DonationHistoryModal({ onClose }: Props) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const res: any = await getMyDonations();

        console.log("DONATIONS RESPONSE:", res);

        // ✅ THIS MATCHES YOUR BACKEND
        if (res?.success && Array.isArray(res.donations)) {
          setDonations(res.donations);
        }

      } catch (err) {
        console.error('Failed to load donations', err);
      } finally {
        setLoading(false);
      }
    };

    loadDonations();
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border-2 border-dreamxec-navy shadow-pastel-card max-w-3xl w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-dreamxec-navy mb-6">
          💝 Donation History
        </h2>

        {loading ? (
          <p className="text-center">Loading donations...</p>

        ) : donations.length === 0 ? (
          <p className="text-center text-lg">No donations yet.</p>

        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {donations.map((d) => (
              <div
                key={d.id}
                className="border-3 border-dreamxec-navy rounded-xl p-4 bg-dreamxec-cream"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-lg text-dreamxec-navy">
                      ₹{d.amount}
                    </p>

                    <p className="text-sm">
                      Project: {d.userProject?.title}
                    </p>

                    <p className="text-xs opacity-60">
                      {new Date(d.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span className="font-semibold text-sm">
                    {d.anonymous ? 'Anonymous' : 'Public'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="btn-pastel-secondary px-6 py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

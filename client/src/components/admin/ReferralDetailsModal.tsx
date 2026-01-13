import React from "react";

type Referral = {
  id: string;
  clubName: string;
  collegeName?: string | null;
  presidentName?: string | null;
  presidentEmail?: string | null;
  presidentPhone?: string | null;
  ficName?: string | null;
  ficEmail?: string | null;
  ficPhone?: string | null;
  referrerEmail?: string | null;
  status: string;
  createdAt: string;
  instagram?: string | null;
  linkedIn?: string | null;
  portfolio?: string | null;
  // add other fields if you store them
};

export default function ReferralDetailsModal({
  referral,
  onClose,
  onApprove,
  onReject,
}: {
  referral: Referral;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}) {
  const handleApprove = async () => {
    await onApprove(referral.id);
  };

  const handleReject = async () => {
    const reason = window.prompt("Enter rejection reason (optional):", "");
    if (reason !== null) {
      await onReject(referral.id, reason);
    }
  };

  // demo image (local upload path you provided)
  const demoBadge = "/mnt/data/4bd1808c-3dfc-4691-8a14-9f593b925c16.png";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-auto">
        <div className="p-6 border-b flex items-start gap-4">
          <img src={demoBadge} alt="badge" className="w-14 h-14 rounded-md" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{referral.clubName}</h2>
            <p className="text-sm text-gray-500">Referral ID: {referral.id}</p>
            <p className="text-sm text-gray-600 mt-2">Status: {referral.status}</p>
            <p className="text-sm text-gray-500">Submitted: {new Date(referral.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-6">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Club / College</h3>
              <p>{referral.clubName}</p>
              <p className="text-sm text-gray-500">{referral.collegeName ?? "—"}</p>
            </div>

            <div>
              <h3 className="font-semibold">President</h3>
              <p>{referral.presidentName ?? "—"}</p>
              <p className="text-sm text-gray-500">{referral.presidentEmail ?? "—"}</p>
              <p className="text-sm text-gray-500">{referral.presidentPhone ?? "—"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Faculty In-charge</h3>
              <p>{referral.ficName ?? "—"}</p>
              <p className="text-sm text-gray-500">{referral.ficEmail ?? "—"}</p>
              <p className="text-sm text-gray-500">{referral.ficPhone ?? "—"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Social Links</h3>
              <p>{referral.instagram ?? "—"}</p>
              <p className="text-sm text-gray-500">{referral.linkedIn ?? "—"}</p>
              <p className="text-sm text-gray-500">{referral.portfolio ?? "—"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Referrer</h3>
              <p>{referral.referrerEmail ?? "—"}</p>
            </div>
          </section>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Approve
            </button>

            <button
              onClick={handleReject}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reject
            </button>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(JSON.stringify(referral, null, 2));
                alert("Referral JSON copied to clipboard");
              }}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Copy JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

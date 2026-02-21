import React, { useEffect, useState, useCallback } from "react";
import {
  getClubMembers,
  removeClubMember,
  changeClubPresident,
} from "../../services/clubService";
import type { ClubMember } from "../../services/clubService";

interface PresidentMembersProps {
  clubId: string;
  currentUserId: string;
}

export default function PresidentMembers({
  clubId,
  currentUserId,
}: PresidentMembersProps) {
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);

  const [acknowledged, setAcknowledged] = useState(false);


  const [showPresidentModal, setShowPresidentModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ClubMember | null>(null);

  const [externalPresident, setExternalPresident] = useState({
    email: "",
    name: "",
    phone: "",
  });

  /* ---------------- FETCH MEMBERS ---------------- */

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getClubMembers(clubId);
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.members || [];

      setMembers(data);
      setLastUpdatedAt(new Date());
      setSecondsAgo(0);
    } catch (err) {
      console.error("Failed to fetch members", err);
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  /* ---------------- AUTO REFRESH ---------------- */

  useEffect(() => {
    fetchMembers();

    const refreshInterval = setInterval(fetchMembers, 30000);
    const timer = setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(timer);
    };
  }, [fetchMembers]);

  /* ---------------- REMOVE MEMBER ---------------- */

  const handleRemove = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      await removeClubMember(clubId, memberId);
      fetchMembers();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to remove member");
    }
  };

  /* ---------------- PRESIDENT CHANGE ---------------- */

  const promoteMember = async () => {
    try {
      if (selectedMember?.id) {
        await changeClubPresident(clubId, { memberId: selectedMember.id });
      } else {
        await changeClubPresident(clubId, externalPresident);
      }

      setShowPresidentModal(false);
      setSelectedMember(null);
      setExternalPresident({ email: "", name: "", phone: "" });
      fetchMembers();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to change president");
    }
  };

  if (loading) return <p className="p-6">Loading members…</p>;

  /* ---------------- UI ---------------- */

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-dreamxec-navy">
          Club Members
        </h1>

        <div className="text-sm text-gray-500">
          Last updated {secondsAgo}s ago
        </div>
      </div>

      <table className="w-full border border-dreamxec-navy rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-dreamxec-navy text-white">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {members.map((m) => {
            const isPresident = m.userId === currentUserId;

            return (
              <tr key={m.id} className="border-t">
                <td className="p-3">{m.name || "—"}</td>
                <td className="p-3">{m.email}</td>

                <td className="p-3">
                  {isPresident ? (
                    <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded">
                      President
                    </span>
                  ) : (
                    "Member"
                  )}
                </td>

                <td className="p-3 text-center space-x-3">
                  {/* PRESIDENT SELF */}
                  {isPresident ? (
                    <button
                      onClick={() => {
                        setSelectedMember(null);
                        setShowPresidentModal(true);
                      }}
                      className="text-orange-600 hover:underline text-sm"
                    >
                      Leave as President
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setSelectedMember(m);
                          setShowPresidentModal(true);
                        }}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Promote
                      </button>

                      <button
                        onClick={() => handleRemove(m.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ---------------- PRESIDENT MODAL ---------------- */}
      {showPresidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-dreamxec-navy/60 backdrop-blur-sm"
            onClick={() => setShowPresidentModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl border-2 border-dreamxec-navy overflow-hidden">

            {/* Header */}
            <div className="px-6 py-4 bg-dreamxec-navy text-white flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-wide">
                President Succession
              </h2>
              <button
                onClick={() => setShowPresidentModal(false)}
                className="text-white/80 hover:text-white text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {selectedMember ? (
                <div className="bg-orange-50 border-l-4 border-dreamxec-orange p-4 rounded-lg">
                  <p className="text-sm text-dreamxec-navy">
                    You are about to promote
                  </p>
                  <p className="text-lg font-bold text-dreamxec-navy mt-1">
                    {selectedMember.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    ({selectedMember.email})
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 border-l-4 border-dreamxec-navy p-4 rounded-lg">
                    <p className="text-sm font-semibold text-dreamxec-navy">
                      Assign President Outside Club
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      This person will be invited and verified automatically.
                    </p>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-dreamxec-navy">
                        Full Name
                      </label>
                      <input
                        className="mt-1 w-full px-4 py-2 rounded-lg border-2 border-dreamxec-navy/20 focus:border-dreamxec-orange focus:outline-none"
                        placeholder="Enter full name"
                        value={externalPresident.name}
                        onChange={(e) =>
                          setExternalPresident({
                            ...externalPresident,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-dreamxec-navy">
                        Email Address
                      </label>
                      <input
                        className="mt-1 w-full px-4 py-2 rounded-lg border-2 border-dreamxec-navy/20 focus:border-dreamxec-orange focus:outline-none"
                        placeholder="email@example.com"
                        value={externalPresident.email}
                        onChange={(e) =>
                          setExternalPresident({
                            ...externalPresident,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-dreamxec-navy">
                        Phone Number
                      </label>
                      <input
                        className="mt-1 w-full px-4 py-2 rounded-lg border-2 border-dreamxec-navy/20 focus:border-dreamxec-orange focus:outline-none"
                        placeholder="+91 XXXXX XXXXX"
                        value={externalPresident.phone}
                        onChange={(e) =>
                          setExternalPresident({
                            ...externalPresident,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mx-6 mb-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                Important
              </p>
              <p className="text-xs text-red-600 mt-1 leading-relaxed">
                Assigning a new president will immediately revoke your president role.
                You will continue as a regular club member unless removed.
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button
                onClick={() => {
                  setShowPresidentModal(false);
                  setAcknowledged(false);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={promoteMember}
                disabled={!acknowledged}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all
      ${acknowledged
                    ? "bg-dreamxec-navy text-white hover:bg-blue-900"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Confirm & Transfer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

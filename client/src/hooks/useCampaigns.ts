import { useEffect, useState } from "react";
import  apiRequest from "../services/api";

/**
 * This type matches the REAL backend response
 * (as already used by BrowseCampaigns)
 */
export type Campaign = {
  id: string;
  title: string;
  clubName: string;
  description: string;
  currentAmount: number;
  goalAmount: number;
  createdAt: string;
  coverImage?: string;
  banner?: string;
};

export function useCampaigns() {
  const [data, setData] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError(false);

        /**
         * ✅ CORRECT endpoint
         * baseURL (from api.ts) + "/campaign"
         * → http://localhost:5000/api/campaign
         */
        const res = await apiRequest("/user-projects/public", { method: "GET" });

        setData(res.data as Campaign[]);
      } catch (err) {
        console.error("useCampaigns error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return { data, loading, error };
}

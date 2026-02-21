import { useEffect, useState } from "react";
import  api  from "../services/api";
import apiRequest from "../services/api";

export type HeroCampaign = {
  id: string;
  title: string;
  category: string;
  raised: number;
  goal: number;
  image: string;
  slug?: string;
  club?: {
    name?: string;
    college?: string;
  };
};

export function useHeroCampaigns() {
  const [data, setData] = useState<HeroCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHeroCampaigns = async () => {
      try {
        setLoading(true);
        setError(false);

        // api.get already returns response.data
        const res = await apiRequest("/user-projects/public", { method: "GET" }) as { data: { userProjects: any[] } };

        const projects = res.data?.userProjects ?? [];

        const adapted: HeroCampaign[] = projects.map((p: any) => ({
          id: p.id,
          title: p.title,
          category: p.companyName ?? "Student Project",
          raised: p.amountRaised ?? 0,
          goal: p.goalAmount,
          image: p.imageUrl || "/assets/dx-logo-2.png",
        }));

        setData(adapted);
      } catch (e) {
        console.error("Hero carousel fetch error:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroCampaigns();
  }, []);

  return { data, loading, error };
}

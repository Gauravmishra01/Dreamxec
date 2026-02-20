import { useEffect, useState } from "react";
import api from "../services/api";
import apiRequest from "../services/api";

export type HeroCampaign = {
  id: string;
  title: string;
  category: string;
  raised: number;
  goal: number;
  image: string;
};

// Development-only dummy data for UI testing when API fails
const DUMMY_CAMPAIGNS: HeroCampaign[] = [
  {
    id: "dummy-1",
    title: "Raising funds for research on commercial Battery packs",
    category: "Society of Automotive Engineers",
    raised: 8000,
    goal: 500000,
    image: "/assets/dx-logo-2.png",
  },
  {
    id: "dummy-2",
    title: "Building our first FSAE Electric Vehicle - Celerons FSAE Team",
    category: "Society of Automotive Engineers",
    raised: 210000,
    goal: 1810000,
    image: "/assets/dx-logo-2.png",
  },
  {
    id: "dummy-3",
    title: "Doom - Old habits new learning platform",
    category: "Tech for Young India",
    raised: 2000,
    goal: 500000,
    image: "/assets/dx-logo-2.png",
  },
  {
    id: "dummy-4",
    title: "F22 RAPTOR - Advanced Aeromodelling Project",
    category: "Aeromodelling Club, NIT Kurukshetra",
    raised: 0,
    goal: 24000,
    image: "/assets/dx-logo-2.png",
  },
  {
    id: "dummy-5",
    title: "Solar-Powered Campus Purifier - Green Tech Initiative",
    category: "Green Tech Club - IIT Delhi",
    raised: 50000,
    goal: 50000,
    image: "/assets/dx-logo-2.png",
  },
  {
    id: "dummy-6",
    title: "AI-Powered Learning Assistant for Rural Students",
    category: "Student Innovation",
    raised: 125000,
    goal: 300000,
    image: "/assets/dx-logo-2.png",
  },
];

// Check if we're in development environment (localhost)
const isDevelopment = (): boolean => {
  try {
    return (
      import.meta.env.DEV ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("local")
    );
  } catch {
    return false;
  }
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
        const res = (await apiRequest("/user-projects/public", {
          method: "GET",
        })) as { data: { userProjects: any[] } };

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

        // Use dummy data ONLY in development environment for UI testing
        if (isDevelopment()) {
          console.warn(
            "🔧 Using dummy campaign data for local development/testing",
          );
          setData(DUMMY_CAMPAIGNS);
          setError(false); // Clear error state when using fallback
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHeroCampaigns();
  }, []);

  return { data, loading, error };
}

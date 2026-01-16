import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../../sections/Header";

export default function PresidentCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    const clubName = localStorage.getItem("clubName");
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API}/donor-projects?clubName=${clubName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setCampaigns(res.data.data);
  };

  return (
    
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-dreamxec-navy mb-6">
        Club Campaigns
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((c: any) => (
          <div
            key={c.id}
            className="p-6 bg-white shadow-xl rounded-xl border-4 border-dreamxec-navy"
          >
            <h2 className="text-2xl font-bold text-dreamxec-navy">{c.title}</h2>
            <p className="text-gray-600">{c.description}</p>

            <p className="mt-4 font-bold">
              Raised: ₹{c.currentAmount} / ₹{c.goalAmount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

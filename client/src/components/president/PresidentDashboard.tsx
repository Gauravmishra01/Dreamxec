import React from "react";
import { StarDecoration } from "../icons/StarDecoration";

interface PresidentDashboardProps {
  stats?: {
    totalMembers: number;
    verifiedMembers: number;
    pendingMembers: number;
    totalCampaigns: number;
    approvedCampaigns: number;
    pendingCampaigns: number;
    rejectedCampaigns: number;
  };
}

// Custom Stat Card
function StatCard({ title, value, icon, colorTheme }: { title: string, value: number, icon: React.ReactNode, colorTheme: 'orange' | 'green' | 'blue' | 'purple' | 'red' | 'navy' }) {
  const themes = {
    orange: 'bg-orange-50 text-orange-700 border-dreamxec-orange shadow-pastel-saffron',
    green: 'bg-green-50 text-green-700 border-dreamxec-green shadow-pastel-green',
    blue: 'bg-blue-50 text-blue-700 border-blue-400 shadow-pastel-navy',
    purple: 'bg-purple-50 text-purple-700 border-purple-400 shadow-pastel-purple',
    red: 'bg-red-50 text-red-700 border-red-400 shadow-pastel-red',
    navy: 'bg-dreamxec-cream text-dreamxec-navy border-dreamxec-navy shadow-pastel-navy',
  };

  return (
    <div className={`rounded-xl p-6 border-3 hover:scale-105 transition-transform flex flex-col justify-between ${themes[colorTheme]}`}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-bold uppercase tracking-wider opacity-80">{title}</p>
        <div className="p-2 bg-white/50 rounded-full shadow-sm backdrop-blur-sm">
          {icon}
        </div>
      </div>
      <p className="text-4xl sm:text-5xl font-bold font-display">{value.toLocaleString()}</p>
    </div>
  );
}

export default function PresidentDashboard({
  stats = {
    totalMembers: 0,
    verifiedMembers: 0,
    pendingMembers: 0,
    totalCampaigns: 0,
    approvedCampaigns: 0,
    pendingCampaigns: 0,
    rejectedCampaigns: 0,
  },
}: PresidentDashboardProps) {
  return (
    <div className="w-full relative z-10">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-10 z-0 opacity-20 pointer-events-none">
        <StarDecoration className="w-20 h-20" color="#FF7F00" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 relative z-10">
        <div>
          <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
            Club Overview <StarDecoration className="w-8 h-8 hidden sm:block" color="#0B9C2C" />
          </h1>
          <p className="text-gray-600 mt-2 font-sans text-lg">Manage your members and oversee club campaigns.</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-lg border-2 border-gray-200 text-sm font-bold text-gray-500 shadow-sm">
          Live Updates Enabled
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold text-dreamxec-navy font-display mb-4 border-b-2 border-dreamxec-navy/10 pb-2">Membership Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Total Members" 
            value={stats.totalMembers} 
            colorTheme="navy" 
            icon={<span className="text-xl">👥</span>} 
          />
          <StatCard 
            title="Verified Members" 
            value={stats.verifiedMembers} 
            colorTheme="green" 
            icon={<span className="text-xl">✅</span>} 
          />
          <StatCard 
            title="Pending Approval" 
            value={stats.pendingMembers} 
            colorTheme="orange" 
            icon={<span className="text-xl">⏳</span>} 
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-dreamxec-navy font-display mb-4 border-b-2 border-dreamxec-navy/10 pb-2">Campaign Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Campaigns" 
            value={stats.totalCampaigns} 
            colorTheme="blue" 
            icon={<span className="text-xl">🎯</span>} 
          />
          <StatCard 
            title="Approved" 
            value={stats.approvedCampaigns} 
            colorTheme="green" 
            icon={<span className="text-xl">🏆</span>} 
          />
          <StatCard 
            title="In Review" 
            value={stats.pendingCampaigns} 
            colorTheme="orange" 
            icon={<span className="text-xl">👀</span>} 
          />
          <StatCard 
            title="Rejected" 
            value={stats.rejectedCampaigns} 
            colorTheme="red" 
            icon={<span className="text-xl">❌</span>} 
          />
        </div>
      </div>

    </div>
  );
}
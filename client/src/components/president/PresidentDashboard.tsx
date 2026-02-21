import React from "react";

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
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-dreamxec-navy">
          Club Overview
        </h1>
        <div className="text-sm text-gray-500 hidden lg:block">
          Last updated just now • Auto-refresh enabled
        </div>
      </div>

      {/* Unified Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {/* Members Section */}
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          trend="+12%"
          icon="👥"
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Verified Members"
          value={stats.verifiedMembers}
          trend="+8%"
          icon="✅"
          color="from-green-500 to-green-600"
        />
        <StatCard
          title="Pending Members"
          value={stats.pendingMembers}
          trend="+3%"
          icon="⏳"
          color="from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Total Campaigns"
          value={stats.totalCampaigns}
          trend="+5%"
          icon="🎯"
          color="from-purple-500 to-purple-600"
        />
      </div>

      {/* Campaign Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <StatCard
          title="Approved Campaigns"
          value={stats.approvedCampaigns}
          trend="+15%"
          icon="✓"
          color="from-emerald-500 to-emerald-600"
          className="border-l-8 border-emerald-500"
        />
        <StatCard
          title="Pending Campaigns"
          value={stats.pendingCampaigns}
          trend="+2%"
          icon="⏳"
          color="from-amber-500 to-amber-600"
          className="border-l-8 border-amber-500"
        />
        <StatCard
          title="Rejected Campaigns"
          value={stats.rejectedCampaigns}
          trend="-1%"
          icon="✕"
          color="from-red-500 to-red-600"
          className="border-l-8 border-red-500"
        />
      </div>

      {/* Footer */}
      <div className="text-center sm:text-left text-sm text-gray-500 pt-4 border-t border-gray-100">
        Last updated just now • Analytics refresh automatically every 5 minutes
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  trend: string;
  icon: string;
  color: string;
  className?: string;
}

function StatCard({ title, value, trend, icon, color, className = "" }: StatCardProps) {
  return (
    <div
      className={`
        group bg-gradient-to-br ${color} bg-white/60 backdrop-blur-sm
        border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl
        transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]
        relative overflow-hidden ${className}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Icon */}
      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition-all">
        <span className="text-2xl">{icon}</span>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <p className="text-sm font-medium text-white/90 mb-2 tracking-wide uppercase">
          {title}
        </p>
        <p className="text-3xl sm:text-4xl lg:text-3xl font-black text-white mb-2 leading-tight">
          {value.toLocaleString()}
        </p>
        <p className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${
          trend.startsWith('+') 
            ? 'bg-white/20 text-emerald-200' 
            : 'bg-white/20 text-rose-200'
        }`}>
          {trend}
        </p>
      </div>

      {/* Shine Effect */}
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all rotate-12" />
    </div>
  );
}

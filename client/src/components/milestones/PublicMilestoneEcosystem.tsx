import React, { useMemo, useEffect, useState } from "react";
import type { Campaign } from "../../types";
import MilestoneProofModal from "./MilestoneProofModal";

interface Props {
  campaign: Campaign;
}

export default function PublicMilestoneEcosystem({ campaign }: Props) {
  const milestones = campaign.milestones || [];
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { totalMilestones, completedMilestones, overallProgress, activeMilestone, totalBudget } = useMemo(() => {
    const total = milestones.length;
    const completed = milestones.filter((m: any) => m.status === "APPROVED").length;
    const active = milestones.find((m: any) => m.status !== "APPROVED");
    const budget = milestones.reduce((sum: number, m: any) => sum + (m.budget || 0), 0);
    return { totalMilestones: total, completedMilestones: completed, overallProgress: total ? (completed / total) * 100 : 0, activeMilestone: active, totalBudget: budget };
  }, [milestones]);

  const formatCountdown = (dueDate?: string) => {
    if (!dueDate) return null;
    const diff = new Date(dueDate).getTime() - now;
    if (diff <= 0) return "Overdue";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return `${days}d ${hours}h left`;
  };

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* ── OVERALL PROGRESS HEADER ── */}
      <div
        className="p-4 sm:p-5 bg-white"
        style={{ border: '3px solid #003366', boxShadow: '6px 6px 0 #FF7F00' }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-dreamxec-navy uppercase tracking-tight flex items-center gap-2">
              <span className="inline-block w-2 h-5 bg-dreamxec-orange flex-shrink-0" />
              Milestone Progress
            </h2>
            <p className="text-xs font-bold text-dreamxec-navy/60 uppercase tracking-widest mt-1">
              {completedMilestones} of {totalMilestones} completed
            </p>
          </div>

          {/* Donut-style count badge */}
          <div
            className="flex items-center gap-1 px-3 py-2"
            style={{ border: '3px solid #003366', background: completedMilestones === totalMilestones && totalMilestones > 0 ? '#0B9C2C' : '#003366' }}
          >
            <span className="text-xl sm:text-2xl font-black text-white">{completedMilestones}</span>
            <span className="text-white/60 font-black text-lg">/</span>
            <span className="text-white/80 font-black text-base">{totalMilestones}</span>
          </div>
        </div>

        {/* Segmented progress track */}
        {totalMilestones > 0 && (
          <div className="mt-4 flex gap-1.5">
            {milestones.map((m: any, i: number) => {
              const done = m.status === "APPROVED";
              const active = !done && m.id === activeMilestone?.id;
              return (
                <div
                  key={i}
                  className="flex-1 h-3 transition-all duration-500"
                  style={{
                    border: '2px solid #003366',
                    background: done ? '#0B9C2C' : active ? '#FF7F00' : '#e5e7eb',
                  }}
                  title={m.title}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ── MILESTONE CARDS ── */}
      <div className="space-y-4 sm:space-y-5">
        {milestones.map((milestone: any, index: number) => {
          const isCompleted = milestone.status === "APPROVED";
          const isActive = !isCompleted && milestone.id === activeMilestone?.id;
          const isPending = !isCompleted && !isActive;
          const countdown = formatCountdown(milestone.dueDate);

          /* accent colours per state */
          const borderColor = isCompleted ? '#0B9C2C' : isActive ? '#FF7F00' : '#003366';
          const shadowColor = isCompleted ? '#0B9C2C' : isActive ? '#FF7F00' : '#003366';
          const numBg       = isCompleted ? '#0B9C2C' : isActive ? '#FF7F00' : '#003366';

          return (
            <div
              key={milestone.id || index}
              onClick={() => { if (isCompleted) setSelectedMilestone(milestone); }}
              className={`bg-white transition-all duration-200 ${isCompleted ? 'cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px]' : ''}`}
              style={{
                border: `3px solid ${borderColor}`,
                boxShadow: `5px 5px 0 ${shadowColor}`,
              }}
            >
              {/* Card top stripe */}
              <div
                className="h-1.5"
                style={{ background: isCompleted ? '#0B9C2C' : isActive ? '#FF7F00' : '#e5e7eb' }}
              />

              <div className="p-4 sm:p-5">
                {/* ── Header row ── */}
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">

                  {/* Number badge */}
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 font-black text-white text-base sm:text-lg"
                    style={{ background: numBg, border: '2px solid #003366', minWidth: '2.25rem' }}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base md:text-lg font-black text-dreamxec-navy uppercase tracking-tight leading-snug break-words">
                        {milestone.title}
                      </h3>

                      {/* Status pill */}
                      <span
                        className="px-2 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest whitespace-nowrap flex-shrink-0"
                        style={{
                          border: `2px solid ${borderColor}`,
                          color: borderColor,
                          background: isCompleted ? '#f0fdf4' : isActive ? '#fff7ed' : '#f3f4f6',
                        }}
                      >
                        {isCompleted ? '✓ Completed' : isActive ? '⚡ Active' : '⏸ Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Description ── */}
                {milestone.description && (
                  <p className="text-xs sm:text-sm text-dreamxec-navy/75 font-medium mb-3 sm:mb-4 leading-relaxed pl-12 sm:pl-14">
                    {milestone.description}
                  </p>
                )}

                {/* ── Info chips ── */}
                <div className="pl-12 sm:pl-14 flex flex-wrap gap-2 sm:gap-3">

                  {/* Budget */}
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1.5"
                    style={{ border: '2px solid #003366', background: '#fff' }}
                  >
                    <span className="text-base leading-none">💰</span>
                    <span className="text-xs sm:text-sm font-black text-dreamxec-navy">
                      ₹{milestone.budget?.toLocaleString()}
                    </span>
                  </div>

                  {/* Duration */}
                  {milestone.durationDays && (
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1.5"
                      style={{ border: '2px solid #003366', background: '#fff' }}
                    >
                      <span className="text-base leading-none">⏳</span>
                      <span className="text-xs sm:text-sm font-black text-dreamxec-navy">
                        {milestone.durationDays}d
                      </span>
                    </div>
                  )}

                  {/* Countdown – only for active */}
                  {isActive && countdown && (
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1.5"
                      style={{ border: '2px solid #FF7F00', background: '#fff7ed' }}
                    >
                      <span className="text-base leading-none">🔥</span>
                      <span className="text-xs sm:text-sm font-black text-dreamxec-orange">
                        {countdown}
                      </span>
                    </div>
                  )}

                  {/* Completed — click to view proof hint */}
                  {isCompleted && (
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1.5"
                      style={{ border: '2px solid #0B9C2C', background: '#f0fdf4' }}
                    >
                      <span className="text-base leading-none">📄</span>
                      <span className="text-xs sm:text-sm font-black text-green-700">
                        View Proof →
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── TOTAL BUDGET ── */}
      <div
        className="flex items-center justify-between p-4 sm:p-5 bg-white"
        style={{ border: '3px solid #003366', boxShadow: '5px 5px 0 #0B9C2C' }}
      >
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-5 bg-dreamxec-green flex-shrink-0" />
          <span className="text-sm sm:text-base font-black text-dreamxec-navy uppercase tracking-tight">
            Total Allocated Budget
          </span>
        </div>
        <span
          className="text-lg sm:text-xl md:text-2xl font-black text-white px-3 py-1.5"
          style={{ background: '#0B9C2C', border: '2px solid #003366' }}
        >
          ₹{totalBudget.toLocaleString()}
        </span>
      </div>

      <MilestoneProofModal
        isOpen={!!selectedMilestone}
        milestone={selectedMilestone}
        onClose={() => setSelectedMilestone(null)}
      />
    </div>
  );
}
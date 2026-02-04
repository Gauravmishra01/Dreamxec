import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useMemo, useState } from "react";

export default function DonationHeatmap({ donations = [] }) {

  /* =========================
     RANGE TOGGLE
  ========================== */
  const [range, setRange] = useState(3); // months

  const today = new Date();
  const startDate = new Date();
  startDate.setMonth(today.getMonth() - range);

  /* =========================
     GROUP BY DATE
  ========================== */
  const data = useMemo(() => {
    const map = {};

    donations.forEach(d => {
      const date = d.createdAt.split("T")[0];
      map[date] = (map[date] || 0) + d.amount;
    });

    return Object.entries(map).map(([date, count]) => ({
      date,
      count,
    }));
  }, [donations]);

  
  /* =========================
     STREAK CALCULATION
  ========================== */
  const streak = useMemo(() => {
    const dates = data
      .map(d => new Date(d.date))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    let current = new Date();

    for (let d of dates) {
      const diff =
        (current.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);

      if (diff <= 1) {
        streak++;
        current = d;
      } else break;
    }

    return streak;
  }, [data]);

  /* =========================
     AI INSIGHT
  ========================== */
  const insight = useMemo(() => {
    let weekend = 0;
    let weekday = 0;

    donations.forEach(d => {
      const day = new Date(d.createdAt).getDay();
      if (day === 0 || day === 6) weekend++;
      else weekday++;
    });

    if (weekend > weekday)
      return "You donate most on weekends";

    return "You prefer weekday giving";
  }, [donations]);

  /* =========================
     STATS
  ========================== */
  const totalDays = useMemo(() => {
    return new Set(donations.map(d => d.createdAt.split("T")[0])).size;
  }, [donations]);

  const totalAmount = useMemo(() => {
    return donations.reduce((sum, d) => sum + d.amount, 0);
  }, [donations]);

  /* =========================
     UI
  ========================== */
  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-200">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-blue-900">
              Donation Activity
            </h3>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <p className="text-sm font-medium">
              {insight}
            </p>
          </div>
        </div>

        {/* RANGE SWITCH */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {[3, 6, 12].map(m => (
            <button
              key={m}
              onClick={() => setRange(m)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                range === m
                  ? "bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-900"
              }`}
            >
              {m === 12 ? "1 Year" : `${m} Months`}
            </button>
          ))}
        </div>

      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <p className="text-xs font-medium text-orange-700 mb-1">Total Donated</p>
          <p className="text-xl font-bold text-blue-900">₹{totalAmount.toLocaleString()}</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <p className="text-xs font-medium text-blue-700 mb-1">Active Days</p>
          <p className="text-xl font-bold text-blue-900">{totalDays}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <p className="text-xs font-medium text-green-700 mb-1">Avg/Day</p>
          <p className="text-xl font-bold text-blue-900">
            ₹{totalDays > 0 ? Math.round(totalAmount / totalDays).toLocaleString() : 0}
          </p>
        </div>

        {streak > 1 && (
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-4 shadow-lg">
            <p className="text-xs font-semibold text-white mb-1">Giving Streak</p>
            <p className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              {streak} days
            </p>
          </div>
        )}
      </div>

      {/* HEATMAP CONTAINER */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={data}
          gutterSize={3}
          showWeekdayLabels
          tooltipDataAttrs={(value) => ({
            "data-tip": value?.date
              ? `₹${value.count.toLocaleString()} on ${value.date}`
              : "No donation",
          })}
          classForValue={(value) => {
            if (!value) return "dx-empty";
            if (value.count > 5000) return "dx-4";
            if (value.count > 2000) return "dx-3";
            if (value.count > 500) return "dx-2";
            return "dx-1";
          }}
        />
      </div>

      {/* LEGEND */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 font-medium">Activity Level</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded dx-empty border border-gray-300"></div>
            <div className="w-4 h-4 rounded dx-1"></div>
            <div className="w-4 h-4 rounded dx-2"></div>
            <div className="w-4 h-4 rounded dx-3"></div>
            <div className="w-4 h-4 rounded dx-4"></div>
          </div>
          <span className="text-xs text-gray-500">More</span>
        </div>
      </div>

      {/* CUSTOM STYLES */}
      <style>{`
        /* HEATMAP STYLING */
        :global(.react-calendar-heatmap) {
          font-family: inherit;
        }

        :global(.react-calendar-heatmap-weekday-label) {
          fill: #6B7280;
          font-size: 10px;
          font-weight: 500;
        }

        :global(.react-calendar-heatmap-month-label) {
          fill: #1E3A8A;
          font-size: 11px;
          font-weight: 600;
        }

        /* EMPTY STATE */
        :global(.dx-empty) {
          fill: #F3F4F6;
          stroke: #E5E7EB;
          stroke-width: 1;
        }

        :global(.dx-empty:hover) {
          fill: #E5E7EB;
          stroke: #D1D5DB;
        }

        /* LEVEL 1 - Light Orange */
        :global(.dx-1) {
          fill: #FED7AA;
          stroke: #FDBA74;
          stroke-width: 1;
        }

        :global(.dx-1:hover) {
          fill: #FDBA74;
          stroke: #FB923C;
          transform: scale(1.1);
        }

        /* LEVEL 2 - Medium Orange */
        :global(.dx-2) {
          fill: #FB923C;
          stroke: #F97316;
          stroke-width: 1;
        }

        :global(.dx-2:hover) {
          fill: #F97316;
          stroke: #EA580C;
          transform: scale(1.1);
        }

        /* LEVEL 3 - Dark Orange */
        :global(.dx-3) {
          fill: #EA580C;
          stroke: #C2410C;
          stroke-width: 1;
        }

        :global(.dx-3:hover) {
          fill: #C2410C;
          stroke: #9A3412;
          transform: scale(1.1);
        }

        /* LEVEL 4 - Blue Gradient */
        :global(.dx-4) {
          fill: #1E3A8A;
          stroke: #1E40AF;
          stroke-width: 1.5;
        }

        :global(.dx-4:hover) {
          fill: #1E40AF;
          stroke: #1D4ED8;
          transform: scale(1.1);
        }

        /* HOVER TRANSITIONS */
        :global(.react-calendar-heatmap rect) {
          rx: 3;
          ry: 3;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        :global(.react-calendar-heatmap rect:hover) {
          filter: brightness(1.1);
        }
      `}</style>

    </div>
  );
}
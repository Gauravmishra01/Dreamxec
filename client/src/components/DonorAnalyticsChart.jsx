import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function DonorAnalyticsCharts({ monthlyTotal, impactScore }) {

  // Chart 1 — Monthly Donations
  const monthlyData = [
    { name: "This Month", amount: monthlyTotal }
  ];

  // Chart 2 — Impact Score
  const impactData = [
    { name: "Impact", score: impactScore }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* 📊 Monthly Donations */}
      <div className="bg-white border border-blue-900/30 rounded-lg p-4 shadow-sm">
        <h3 className="font-bold text-blue-900 mb-4">
          Monthly Donations
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar
              dataKey="amount"
              fill="#16a34a"
              radius={[6,6,0,0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>


      {/* 🚀 Impact Score */}
      <div className="bg-white border border-blue-900/30 rounded-lg p-4 shadow-sm">
        <h3 className="font-bold text-blue-900 mb-4">
          Impact Score
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={impactData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#1e3a8a"
              strokeWidth={3}
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

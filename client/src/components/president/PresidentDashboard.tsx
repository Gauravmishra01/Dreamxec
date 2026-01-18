import { Link } from "react-router-dom";
import { Header } from "../../sections/Header";

export default function PresidentDashboard() {
  return (
    <>
      <Header currentUser={null} onLogin={() => {}} onLogout={() => {}} />
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-dreamxec-navy mb-8">
          Club President Dashboard
        </h1>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Link
            to="/president/members"
            className="p-6 bg-white shadow-xl rounded-xl border-4 border-dreamxec-navy hover:scale-105 transition"
          >
            <h2 className="text-2xl font-bold text-dreamxec-navy mb-2">
              Members
            </h2>
            <p className="text-gray-600">View & manage your club members.</p>
          </Link>

          <Link
            to="/president/campaigns"
            className="p-6 bg-white shadow-xl rounded-xl border-4 border-dreamxec-navy hover:scale-105 transition"
          >
            <h2 className="text-2xl font-bold text-dreamxec-navy mb-2">
              Campaigns
            </h2>
            <p className="text-gray-600">Track campaigns created by club.</p>
          </Link>

          <Link
            to="/president/upload-members"
            className="p-6 bg-white shadow-xl rounded-xl border-4 border-dreamxec-navy hover:scale-105 transition"
          >
            <h2 className="text-2xl font-bold text-dreamxec-navy mb-2">
              Upload CSV
            </h2>
            <p className="text-gray-600">Upload member list using CSV</p>
          </Link>

          <Link
            to="/president/add-member"
            className="p-6 bg-white shadow-xl rounded-xl border-4 border-dreamxec-navy hover:scale-105 transition"
          >
            <h2 className="text-2xl font-bold text-dreamxec-navy mb-2">
              Add Member
            </h2>
            <p className="text-gray-600">Add a single member manually</p>
          </Link>

        </div>

      </div>
    </div>
    </>
  );
}

import { Link } from "react-router-dom";

export default function PresidentLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <div className="w-72 bg-dreamxec-berkeley-blue text-white flex flex-col gap-6 p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Club President Panel</h1>

        <nav className="flex flex-col gap-4 font-semibold">
          <Link to="/president" className="hover:text-dreamxec-orange">Dashboard</Link>
          <Link to="/president/members" className="hover:text-dreamxec-orange">Members</Link>
          <Link to="/president/campaigns" className="hover:text-dreamxec-orange">Campaigns</Link>
          <Link to="/president/upload" className="hover:text-dreamxec-orange">Club Member Upload CSV</Link>
          <Link to="/president/add-member" className="hover:text-dreamxec-orange">Add Member</Link>
        </nav>
      </div>

      
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}

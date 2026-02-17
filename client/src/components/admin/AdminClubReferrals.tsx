// src/components/admin/AdminClubReferrals.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import ReferralDetailsModal from './ReferralDetailsModal';
import { Header } from '../../sections/Header';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
API.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token'); if (t) cfg.headers.Authorization = `Bearer ${t}`; return cfg;
});

export default function AdminClubReferrals() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [rejectionId, setRejectionId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await API.get('/admin/referrals'); // GET all referrals
      setReferrals(res.data.data || res.data || []);
    } catch (e) { console.error(e); alert('Failed to fetch referrals'); }
    setLoading(false);
  }

  async function approve(id: string) {
    try {
      await API.post(`/admin/referrals/${id}/approve`);
      load();
    } catch (e) { console.error(e); alert('Approve failed'); }
  }

  async function reject(id: string, reason: string) {
    try {
      await API.post(`/club-referral/${id}/reject`, { reason });
      setRejectionId(null);
      load();
    } catch (e) { console.error(e); alert('Reject failed'); }
  }

  return (
    <>
      <Header />
      <div className="bg-white rounded-xl shadow p-6 max-w-7xl mx-auto mt-6">
        <h2 className="text-2xl font-bold mb-4">Club Referrals</h2>
        {loading ? <p>Loading…</p> : (
          <table className="w-full">
            <thead><tr><th>Club</th><th>Referrer</th><th>President</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {referrals.length === 0 && <tr><td colSpan={5} className="py-6 text-center">No referrals</td></tr>}
              {referrals.map(r => (
                <tr key={r.id} className="border-b">
                  <td className="py-3">{r.clubName || r.collegeName}</td>
                  <td>{r.referrerEmail || r.studentEmail}</td>
                  <td>{r.presidentName || '—'}</td>
                  <td>{r.status}</td>
                  <td className="text-right">
                    <button onClick={() => setSelected(r)} className="px-3 py-1 mr-2 bg-gray-100 rounded">View</button>
                    <button onClick={() => approve(r.id)} className="px-3 py-1 mr-2 bg-green-600 text-white rounded">Approve</button>
                    <button onClick={() => setRejectionId(r.id)} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selected && <ReferralDetailsModal referral={selected} onClose={() => setSelected(null)} onApprove={approve} onReject={reject} />}
        {rejectionId && <RejectionPrompt onSubmit={(reason) => reject(rejectionId, reason)} onClose={() => setRejectionId(null)} />}
      </div>
    </>
  );
}

function RejectionPrompt({ onSubmit, onClose }: { onSubmit: (r: string) => void; onClose: () => void; }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h3 className="text-lg font-bold">Reject referral</h3>
        <textarea className="w-full p-2 border mt-3" value={reason} onChange={e => setReason(e.target.value)} />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
          <button onClick={() => onSubmit(reason)} className="px-3 py-1 bg-red-600 text-white rounded" disabled={!reason.trim()}>Submit</button>
        </div>
      </div>
    </div>
  );
}

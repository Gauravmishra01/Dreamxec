// src/components/admin/AdminClubVerifications.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VerificationDetailModal from './VerificationDetailModal';
import { getClubVerifications } from '../../services/adminService';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
API.interceptors.request.use(cfg => { const t = localStorage.getItem('token'); if (t) cfg.headers.Authorization = `Bearer ${t}`; return cfg; });

export default function AdminClubVerifications() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => { load(); }, []);
  async function load() {
    try {
      const res = await getClubVerifications();
      console.log("Fetched Verifications:", res); // Debug log
      // Handle both { data: [...] } and direct array responses
      setItems(res.data || (Array.isArray(res) ? res : []));
    } catch (e) {
      console.error("Failed to load verifications:", e);
    } finally { }
  }

    async function approve(id: string) {
      try { await API.post(`/club-verification/${id}/approve`); load(); } catch (e) { console.error(e); alert('Approve failed'); }
    }
    async function reject(id: string, reason: string) {
      try { await API.post(`/club-verification/${id}/reject`, { reason }); load(); } catch (e) { console.error(e); alert('Reject failed'); }
    }

    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Club Verifications</h2>
        <table className="w-full">
          <thead><tr><th>College</th><th>President</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={4} className="py-6 text-center">No verification requests</td></tr>}
            {items.map(v => (
              <tr key={v.id} className="border-b">
                <td className="py-3">{v.collegeName}</td>
                <td>{v.presidentName}</td>
                <td>{v.status}</td>
                <td className="text-right">
                  <button onClick={() => setSelected(v)} className="px-3 py-1 mr-2 bg-gray-100 rounded">View</button>
                  <button onClick={() => approve(v.id)} className="px-3 py-1 mr-2 bg-green-600 text-white rounded">Approve</button>
                  <button onClick={() => { const reason = prompt('Rejection reason'); if (reason) reject(v.id, reason); }} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selected && (
          <VerificationDetailModal
            verification={selected}
            onClose={() => setSelected(null)}
            onApprove={approve}
            onReject={reject}
          />
        )}
      </div>
    );
  }

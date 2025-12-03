"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function ManageUsersPage() {
  const { user } = useSelector((s: RootState) => s.auth);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const updateRole = async (id: string, role: string) => {
    setSavingId(id);
    try {
      await api.put(`/users/${id}/role`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <p className="text-sm text-gray-600">Admins can change others’ roles; you cannot change your own.</p>

      {loading ? (
        <div className="mt-6">Loading...</div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-2 text-sm">{u.name}</td>
                  <td className="px-4 py-2 text-sm">{u.email}</td>
                  <td className="px-4 py-2 text-sm">
                    <select
                      className="border rounded px-2 py-1"
                      value={u.role}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                      disabled={savingId === u._id || user?._id === u._id}
                    >
                      <option value="user">user</option>
                      <option value="instructor">instructor</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-right text-xs text-gray-500">
                    {user?._id === u._id && 'You cannot change yourself'}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={4}>No users</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


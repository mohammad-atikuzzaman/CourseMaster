'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

interface EnrollmentItem {
  _id: string;
  student: { _id: string; name: string; email: string };
  status: 'active' | 'completed' | 'dropped';
  createdAt: string;
  progress: number;
}

export default function ManageEnrollments() {
  const { courseId } = useParams();
  const [items, setItems] = useState<EnrollmentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!courseId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/enrollments/course/${courseId}`);
        setItems(res.data);
      } catch (e: any) {
        setError(e.response?.data?.message || 'Failed to load enrollments');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  return (
    <ProtectedRoute allowedRoles={['admin', 'instructor']}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Manage Enrollments</h1>
            <p className="text-gray-600">Course ID: {courseId}</p>
          </div>
          <div className="bg-white shadow sm:rounded-md">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Enrolled Students</div>
                {loading && <div className="text-sm text-gray-500">Loading...</div>}
              </div>
              {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
            </div>
            <ul className="divide-y">
              {items.map((item) => (
                <li key={item._id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.student.name}</div>
                      <div className="text-sm text-gray-600">{item.student.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">Progress: {Math.round(item.progress)}%</div>
                      <div className="text-xs text-gray-500">Status: {item.status}</div>
                      <div className="text-xs text-gray-400">Enrolled: {new Date(item.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </li>
              ))}
              {items.length === 0 && !loading && (
                <li className="p-4 text-sm text-gray-500">No enrollments yet</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

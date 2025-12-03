'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { AppDispatch, RootState } from '@/redux/store';
import { getCourseById } from '@/redux/features/courses/courseSlice';
import { createAssignment, getCourseAssignments } from '@/redux/features/assignments/assignmentSlice';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

export default function CourseAssignments() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { course } = useSelector((s: RootState) => s.course);
  const { assignments, isLoading } = useSelector((s: RootState) => s.assignments);
  const { user } = useSelector((s: RootState) => s.auth);

  const [form, setForm] = useState({ title: '', description: '', dueDate: '', moduleIndex: 0 });
  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  useEffect(() => {
    if (id) {
      dispatch(getCourseById(id as string));
      dispatch(getCourseAssignments(id as string));
    }
  }, [id, dispatch]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      createAssignment({
        courseId: id as string,
        title: form.title,
        description: form.description,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
        moduleIndex: Number(form.moduleIndex),
      })
    );
    setForm({ title: '', description: '', dueDate: '', moduleIndex: 0 });
    dispatch(getCourseAssignments(id as string));
  };

  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['user', 'admin', 'instructor']}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Assignments for {course.title}</h1>
          {isInstructor && (
            <a href={`/learn/${id}/assignments`} className="text-indigo-600 hover:text-indigo-800 text-sm">Review Submissions</a>
          )}
        </div>

        {isInstructor && (
          <form onSubmit={onSubmit} className="bg-white rounded-md shadow p-4 mb-6 space-y-3">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input className="w-full border p-2 rounded" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea className="w-full border p-2 rounded" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <input type="date" className="w-full border p-2 rounded" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Module</label>
                <select className="w-full border p-2 rounded" value={form.moduleIndex} onChange={(e) => setForm({ ...form, moduleIndex: Number(e.target.value) })}>
                  {course.syllabus.map((m: any, idx: number) => (
                    <option key={idx} value={idx}>{idx + 1}. {m.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-right">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded">Create Assignment</button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-md shadow">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Existing Assignments</h2>
          </div>
          {isLoading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <ul className="divide-y">
              {assignments.map((a) => (
                <li key={a._id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{a.title}</div>
                      <div className="text-sm text-gray-600">Module {((a.moduleIndex ?? 0) + 1)} • Due {a.dueDate ? new Date(a.dueDate).toISOString().slice(0,10) : '—'}</div>
                    </div>
                  </div>
                </li>
              ))}
              {assignments.length === 0 && <li className="p-4 text-sm text-gray-500">No assignments yet</li>}
            </ul>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

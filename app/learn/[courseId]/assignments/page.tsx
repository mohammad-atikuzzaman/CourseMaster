'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { AppDispatch, RootState } from '@/redux/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getCourseAssignments, submitAssignment, gradeSubmission } from '@/redux/features/assignments/assignmentSlice';
import { Loader2 } from 'lucide-react';

export default function CourseAssignmentsSubmit() {
  const { courseId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { assignments, submissions, isLoading } = useSelector((s: RootState) => s.assignments);
  const { user } = useSelector((s: RootState) => s.auth);

  const [submission, setSubmission] = useState<{ [assignmentId: string]: { repoUrl: string; deploymentUrl: string } }>({});

  useEffect(() => {
    if (courseId) {
      dispatch(getCourseAssignments(courseId as string));
    }
  }, [courseId, dispatch]);

  const onSubmit = async (assignmentId: string) => {
    const payload = submission[assignmentId] || { repoUrl: '', deploymentUrl: '' };
    await dispatch(
      submitAssignment({ assignmentId, repoUrl: payload.repoUrl, deploymentUrl: payload.deploymentUrl })
    );
    setSubmission((s) => ({ ...s, [assignmentId]: { repoUrl: '', deploymentUrl: '' } }));
  };

  const onGrade = async (assignmentId: string, submissionId: string, score: number) => {
    await dispatch(gradeSubmission({ assignmentId, submissionId, score }));
    // refresher not necessary, slice updates in place
  };

  return (
    <ProtectedRoute allowedRoles={['user', 'admin', 'instructor']}>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Course Assignments</h1>
        <div className="bg-white rounded-md shadow">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Submit your work</h2>
          </div>
          {isLoading ? (
            <div className="p-6 text-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : (
            <ul className="divide-y">
              {assignments.map((a) => (
                <li key={a._id} className="p-4 space-y-3">
                  <div>
                    <div className="font-medium">{a.title}</div>
                    <div className="text-sm text-gray-600">Module {((a.moduleIndex ?? 0) + 1)} • Due {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '—'}</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm">GitHub Repo URL</label>
                      <input
                        className="w-full border p-2 rounded"
                        placeholder="https://github.com/username/repo"
                        value={(submission[a._id]?.repoUrl) || ''}
                        onChange={(e) => setSubmission((s) => ({ ...s, [a._id]: { ...(s[a._id] || { deploymentUrl: '' }), repoUrl: e.target.value } }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm">Deployment URL</label>
                      <input
                        className="w-full border p-2 rounded"
                        placeholder="https://atikuzzaman.vercel.app/"
                        value={(submission[a._id]?.deploymentUrl) || ''}
                        onChange={(e) => setSubmission((s) => ({ ...s, [a._id]: { ...(s[a._id] || { repoUrl: '' }), deploymentUrl: e.target.value } }))}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <button onClick={() => onSubmit(a._id)} className="px-4 py-2 bg-indigo-600 text-white rounded">Submit</button>
                  </div>
                  {(user?.role === 'admin' || user?.role === 'instructor') && (
                    <div className="mt-4">
                      <div className="text-sm font-semibold mb-2">Submissions</div>
                      {/* simple grading UI placeholder - in a real app we'd fetch and list */}
                      <div className="text-xs text-gray-500">Use dashboard to view and grade detailed submissions.</div>
                    </div>
                  )}
                </li>
              ))}
              {assignments.length === 0 && <li className="p-4 text-sm text-gray-500">No assignments available</li>}
            </ul>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

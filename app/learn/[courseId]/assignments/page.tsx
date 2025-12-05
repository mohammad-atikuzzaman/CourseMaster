'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { AppDispatch, RootState } from '@/redux/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getCourseAssignments, gradeSubmission, getSubmissions } from '@/redux/features/assignments/assignmentSlice';
import { Loader2 } from 'lucide-react';

export default function CourseAssignmentsSubmit() {
  const { courseId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { assignments, isLoading } = useSelector((s: RootState) => s.assignments);
  const { user } = useSelector((s: RootState) => s.auth);

  const [subsMap, setSubsMap] = useState<Record<string, any[]>>({});
  const [initialized, setInitialized] = useState(false);
  const [open, setOpen] = useState<{ [aid: string]: boolean }>({});
  const [editScores, setEditScores] = useState<Record<string, number | string>>({});

  useEffect(() => {
    if (courseId) {
      dispatch(getCourseAssignments(courseId as string));
    }
  }, [courseId, dispatch]);

  useEffect(() => {
    if (!initialized && assignments.length > 0) {
      const first = assignments[0];
      (async () => {
        const list = await dispatch(getSubmissions(first._id)).unwrap();
        setSubsMap((m) => ({ ...m, [first._id]: list }));

        // Initialize score inputs
        const scores: Record<string, number | string> = {};
        list.forEach((s: any) => (scores[s._id] = s.score ?? ''));
        setEditScores(scores);

        setOpen((o) => ({ ...o, [first._id]: true }));
        setInitialized(true);
      })();
    }
  }, [assignments, initialized, dispatch]);

  const loadSubs = async (aid: string) => {
    const list = await dispatch(getSubmissions(aid)).unwrap();
    setSubsMap((m) => ({ ...m, [aid]: list }));

    const scores: Record<string, number | string> = {};
    list.forEach((s: any) => (scores[s._id] = s.score ?? ''));
    setEditScores(scores);

    setOpen((o) => ({ ...o, [aid]: true }));
  };

  const handleChangeScore = (subId: string, value: string) => {
    setEditScores((prev) => ({ ...prev, [subId]: value }));
  };

  const onGrade = async (assignmentId: string, submissionId: string) => {
    const score = Number(editScores[submissionId] ?? 0);

    const updated = await dispatch(
      gradeSubmission({ assignmentId, submissionId, score })
    ).unwrap();

    // Update local UI
    setSubsMap((prev) => {
      const arr = prev[assignmentId] || [];
      const next = arr.map((s) => (s._id === updated._id ? updated : s));
      return { ...prev, [assignmentId]: next };
    });

    // Update score input state
    setEditScores((prev) => ({ ...prev, [submissionId]: updated.score }));
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'instructor']}>
      <div className="max-w-4xl mx-auto p-6" suppressHydrationWarning>
        <h1 className="text-2xl font-bold mb-4">Course Assignments</h1>

        <div className="bg-white rounded-md shadow">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Grade submissions</h2>
          </div>

          {isLoading ? (
            <div className="p-6 text-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <ul className="divide-y">
              {assignments.map((a) => (
                <li key={a._id} className="p-4 space-y-3">
                  <div>
                    <div className="font-medium">{a.title}</div>
                    <div className="text-sm text-gray-600">
                      Module {(a.moduleIndex ?? 0) + 1} • Due{' '}
                      {a.dueDate
                        ? new Date(a.dueDate).toISOString().slice(0, 10)
                        : '—'}
                    </div>
                  </div>

                  {(user?.role === 'admin' || user?.role === 'instructor') && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">
                          Submissions
                          <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                            {(subsMap[a._id] || []).length}
                          </span>
                        </div>

                        {!open[a._id] && (
                          <button
                            onClick={() => loadSubs(a._id)}
                            className="text-indigo-600 text-sm"
                          >
                            Load submissions
                          </button>
                        )}
                      </div>

                      {open[a._id] && (
                        <div className="mt-2 border rounded">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="p-2 text-left">Student</th>
                                <th className="p-2 text-left">Repo</th>
                                <th className="p-2 text-left">Live</th>
                                <th className="p-2 text-left">Score</th>
                                <th className="p-2"></th>
                              </tr>
                            </thead>

                            <tbody>
                              {(subsMap[a._id] || []).map((s: any) => (
                                <tr key={s._id} className="border-t">
                                  <td className="p-2">
                                    {s.student?.name || '—'}
                                  </td>

                                  <td className="p-2">
                                    <a
                                      className="text-indigo-600"
                                      href={s.repoUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Repo
                                    </a>
                                  </td>

                                  <td className="p-2">
                                    <a
                                      className="text-indigo-600"
                                      href={s.deploymentUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Live
                                    </a>
                                  </td>

                                  <td className="p-2">
                                    <input
                                      type="number"
                                      className="border rounded px-2 py-1 w-20"
                                      value={editScores[s._id] ?? ''}
                                      onChange={(e) =>
                                        handleChangeScore(
                                          s._id,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>

                                  <td className="p-2">
                                    <button
                                      onClick={() => onGrade(a._id, s._id)}
                                      className="px-3 py-1 rounded bg-indigo-600 text-white"
                                    >
                                      Save
                                    </button>
                                  </td>
                                </tr>
                              ))}

                              {(subsMap[a._id] || []).length === 0 && (
                                <tr>
                                  <td
                                    className="p-3 text-gray-500"
                                    colSpan={5}
                                  >
                                    No submissions loaded
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}

              {assignments.length === 0 && (
                <li className="p-4 text-sm text-gray-500">
                  No assignments available
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
